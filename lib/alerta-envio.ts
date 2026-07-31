import { bancoLigado, comando, comandoLista } from "@/lib/redis";
import { registrarFicha } from "@/lib/saida";
import { SITE } from "@/lib/site";
import {
  itensDoSite,
  novidades,
  registroDe,
  assunto,
  corpoTexto,
  corpoHtml,
  type ItemAlerta,
  type Visto,
} from "@/lib/alerta";
import { todasAsMudancas } from "@/lib/mudancas";
import { todosOsNumeros } from "@/lib/numeros";
import { todosOsPosts } from "@/lib/posts";

/**
 * O envio do alerta: o que fala com o banco e com o Resend.
 *
 * A decisão de o que é novidade está em `lib/alerta.ts`, sem rede e sem banco,
 * para poder ser testada. Aqui fica só o que precisa sair da máquina.
 *
 * Uma mensagem por pessoa, sempre. Nada de várias no mesmo campo de destino nem
 * de cópia oculta: cópia oculta erra uma vez e vaza a lista inteira, e este site
 * promete não repassar endereço de ninguém.
 */

const CHAVE_VISTO = "alerta:visto";
const LISTA = "lista:emails";

/** Quantos endereços cabem numa chamada do Resend. */
const LOTE = 100;

function chaveResend(): string | null {
  return process.env.RESEND_API_KEY || null;
}

/** O remetente. Precisa ser de domínio verificado no Resend, ou o envio é recusado. */
function remetente(): string | null {
  return process.env.ALERTA_DE || null;
}

/**
 * Para onde vai a resposta de quem apertar responder.
 *
 * Opcional. Sem ela, o rodapé do alerta diz com todas as letras que a caixa do
 * remetente não recebe. O que não pode existir é a terceira via: caixa muda que
 * engole resposta sem avisar.
 */
function paraResponder(): string | undefined {
  return process.env.ALERTA_RESPONDER || undefined;
}

export function alertaLigado(): boolean {
  return Boolean(chaveResend() && remetente() && bancoLigado());
}

export function oQueFalta(): string[] {
  const falta: string[] = [];
  if (!chaveResend()) falta.push("RESEND_API_KEY");
  if (!remetente()) falta.push("ALERTA_DE");
  if (!bancoLigado()) falta.push("UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN");
  return falta;
}

async function assinantes(): Promise<string[]> {
  return comandoLista(["SMEMBERS", LISTA]);
}

/**
 * O registro do que já saiu.
 *
 * A API REST devolve HGETALL às vezes como objeto e às vezes como lista chata de
 * campo e valor alternados. As duas formas são lidas aqui, porque descobrir isso
 * em produção, com a lista esperando, seria caro.
 */
async function vistoAtual(): Promise<Record<string, Visto>> {
  const bruto = await comando(["HGETALL", CHAVE_VISTO]);
  const pares: [string, string][] = [];

  if (Array.isArray(bruto)) {
    for (let i = 0; i + 1 < bruto.length; i += 2) {
      pares.push([String(bruto[i]), String(bruto[i + 1])]);
    }
  } else if (bruto && typeof bruto === "object") {
    for (const [k, v] of Object.entries(bruto as Record<string, unknown>)) {
      pares.push([k, String(v)]);
    }
  }

  const visto: Record<string, Visto> = {};
  for (const [campo, valor] of pares) {
    try {
      visto[campo] = JSON.parse(valor) as Visto;
    } catch {
      // Campo corrompido conta como nunca visto. O preço é um aviso repetido,
      // que é bem menor que o de travar o alerta inteiro.
      visto[campo] = { i: "" };
    }
  }
  return visto;
}

async function gravarVisto(registro: Record<string, Visto>): Promise<void> {
  const partes: string[] = ["HSET", CHAVE_VISTO];
  for (const [campo, valor] of Object.entries(registro)) {
    partes.push(campo, JSON.stringify(valor));
  }
  if (partes.length === 2) return;
  await comando(partes);
}

type Mensagem = {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
};

async function enviarLote(mensagens: Mensagem[]): Promise<number> {
  const r = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      authorization: `Bearer ${chaveResend()}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(mensagens),
    signal: AbortSignal.timeout(20000),
  });

  if (!r.ok) {
    const corpo = await r.text();
    throw new Error(`resend respondeu ${r.status}: ${corpo.slice(0, 200)}`);
  }

  const corpo = (await r.json()) as { data?: unknown[] };
  return Array.isArray(corpo.data) ? corpo.data.length : mensagens.length;
}

export type Relatorio = {
  ligado: boolean;
  falta?: string[];
  /** Verdadeiro na primeira rodada: registra o que existe e não manda nada. */
  semeou?: boolean;
  ensaio?: boolean;
  novidades: number;
  itens: { raiz: string; titulo: string; alterado: boolean }[];
  assinantes: number;
  enviados: number;
  erro?: string;
};

/**
 * Uma rodada do alerta.
 *
 * Em ensaio, faz tudo menos enviar e menos gravar: serve para olhar o que sairia
 * antes de sair. É o único jeito de conferir isto em produção sem usar a caixa de
 * e-mail de gente real como ambiente de teste.
 */
export async function rodarAlerta({ ensaio = false } = {}): Promise<Relatorio> {
  if (!alertaLigado()) {
    return { ligado: false, falta: oQueFalta(), novidades: 0, itens: [], assinantes: 0, enviados: 0 };
  }

  const itens: ItemAlerta[] = itensDoSite({
    mudancas: todasAsMudancas(),
    numeros: todosOsNumeros(),
    posts: todosOsPosts(),
  });

  const visto = await vistoAtual();

  // Primeira rodada. Sem isto, ligar o alerta despacharia o acervo inteiro para
  // quem assinou esperando ser avisado do que mudou daqui em diante.
  if (Object.keys(visto).length === 0) {
    if (!ensaio) await gravarVisto(registroDe(itens));
    return {
      ligado: true,
      semeou: true,
      ensaio,
      novidades: 0,
      itens: [],
      assinantes: 0,
      enviados: 0,
    };
  }

  const novas = novidades(itens, visto);
  const resumo = novas.map((n) => ({ raiz: n.raiz, titulo: n.titulo, alterado: n.alterado }));

  if (novas.length === 0) {
    return { ligado: true, ensaio, novidades: 0, itens: [], assinantes: 0, enviados: 0 };
  }

  const lista = await assinantes();
  if (lista.length === 0) {
    // Nada para enviar, mas o que está publicado passa a ser o novo ponto de
    // partida. Senão o primeiro assinante receberia todo o acúmulo de uma vez.
    if (!ensaio) await gravarVisto(registroDe(itens));
    return { ligado: true, ensaio, novidades: novas.length, itens: resumo, assinantes: 0, enviados: 0 };
  }

  const titulo = assunto(novas);
  const mensagens: Mensagem[] = [];

  for (const email of lista) {
    const ficha = ensaio ? "ensaio" : await registrarFicha(email);
    if (!ficha) continue;
    const urlSaida = `${SITE.url}/sair/${ficha}`;

    mensagens.push({
      from: remetente() as string,
      to: [email],
      reply_to: paraResponder(),
      subject: titulo,
      text: corpoTexto(novas, SITE.url, urlSaida, paraResponder()),
      html: corpoHtml(novas, SITE.url, urlSaida, paraResponder()),
      headers: {
        // Faz o próprio programa de e-mail mostrar o botão de sair, que é o
        // caminho que a pessoa acha primeiro quando cansou da lista.
        "List-Unsubscribe": `<${SITE.url}/api/sair?t=${ficha}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  }

  if (ensaio) {
    return {
      ligado: true,
      ensaio: true,
      novidades: novas.length,
      itens: resumo,
      assinantes: lista.length,
      enviados: 0,
    };
  }

  let enviados = 0;
  try {
    for (let i = 0; i < mensagens.length; i += LOTE) {
      enviados += await enviarLote(mensagens.slice(i, i + LOTE));
    }
  } catch (e) {
    // O que já saiu não pode sair de novo na próxima rodada, então o registro é
    // gravado mesmo com falha no meio. Repetir aviso em caixa de e-mail alheia
    // custa mais caro que perder um aviso, e o relatório diz o que houve.
    await gravarVisto(registroDe(itens));
    return {
      ligado: true,
      novidades: novas.length,
      itens: resumo,
      assinantes: lista.length,
      enviados,
      erro: (e as Error).message,
    };
  }

  await gravarVisto(registroDe(itens));
  return { ligado: true, novidades: novas.length, itens: resumo, assinantes: lista.length, enviados };
}
