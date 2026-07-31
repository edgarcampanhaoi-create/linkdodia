import { createHmac } from "node:crypto";
import { comando, tokenRedis } from "@/lib/redis";

/**
 * A porta de saída da lista.
 *
 * O formulário promete que dá para sair, então sair precisa funcionar sem
 * responder e-mail, sem pedir senha e sem falar com ninguém. Isso não é gentileza:
 * lista de onde não se sai vira denúncia de spam, e denúncia de spam derruba a
 * entrega de todo mundo.
 *
 * O endereço da pessoa nunca aparece no link. O que viaja é uma ficha opaca,
 * guardada num mapa no Redis, e é ela que o site troca de volta pelo endereço.
 * Endereço em barra de navegador vaza para histórico, para o referenciador e para
 * qualquer um que olhe a tela por cima do ombro.
 *
 * A chave que assina a ficha é `ALERTA_SEGREDO`, e sem ela vale o próprio token
 * do Redis, que já é segredo de servidor. Trocar a chave não quebra link antigo,
 * porque a validação é feita pelo mapa guardado, e não recalculando a ficha.
 */

const MAPA = "lista:tokens";
const LISTA = "lista:emails";

function chaveDeAssinatura(): string | null {
  return process.env.ALERTA_SEGREDO || tokenRedis();
}

/** A ficha de saída de um endereço. Determinística, para não criar uma nova a cada envio. */
export function fichaDe(email: string): string | null {
  const chave = chaveDeAssinatura();
  if (!chave) return null;
  return createHmac("sha256", chave).update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
}

/** Registra a ficha, para que o site consiga voltar dela ao endereço. */
export async function registrarFicha(email: string): Promise<string | null> {
  const ficha = fichaDe(email);
  if (!ficha) return null;
  await comando(["HSET", MAPA, ficha, email]);
  return ficha;
}

export async function emailDaFicha(ficha: string): Promise<string | null> {
  if (!/^[a-f0-9]{32}$/.test(ficha)) return null;
  const bruto = await comando(["HGET", MAPA, ficha]);
  return typeof bruto === "string" && bruto ? bruto : null;
}

export type ResultadoSaida = { ok: boolean; jaEstavaFora?: boolean };

/**
 * Tira o endereço da lista.
 *
 * Apaga a ficha junto: link de saída usado não serve mais, e o mapa não guarda
 * endereço de quem não está mais na lista.
 */
export async function sairDaLista(ficha: string): Promise<ResultadoSaida> {
  const email = await emailDaFicha(ficha);
  if (!email) return { ok: false };

  const removidos = await comando(["SREM", LISTA, email]);
  await comando(["HDEL", MAPA, ficha]);

  return { ok: true, jaEstavaFora: removidos === 0 };
}

/** Mostra o endereço sem entregá-lo por inteiro a quem só tem o link. */
export function enderecoEncoberto(email: string): string {
  const [nome, dominio] = email.split("@");
  if (!dominio) return "seu endereço";
  const visivel = nome.slice(0, 1);
  return `${visivel}${"*".repeat(Math.max(3, nome.length - 1))}@${dominio}`;
}
