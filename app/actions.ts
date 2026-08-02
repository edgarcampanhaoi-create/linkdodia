"use server";

import { inscrever } from "@/lib/lista";
import { sairDaLista } from "@/lib/saida";
import { guardarResposta } from "@/lib/pesquisa";
import { PERGUNTAS } from "@/lib/pesquisa-perguntas";

export type EstadoInscricao = { ok: boolean; mensagem?: string };

/**
 * Cadastro na lista.
 *
 * O campo `sobrenome` é uma armadilha para robô (honeypot): fica escondido no
 * formulário, gente não preenche, robô preenche tudo. Se vier preenchido, a
 * gente responde "deu certo" e não grava nada. Dizer "você é um robô" só ensina
 * o robô a passar da próxima vez.
 */
export async function inscreverNaLista(
  _anterior: EstadoInscricao,
  dados: FormData,
): Promise<EstadoInscricao> {
  if (String(dados.get("sobrenome") ?? "").trim() !== "") {
    return { ok: true, mensagem: "Pronto. Você é avisado quando mudar." };
  }

  const origem = String(dados.get("origem") ?? "site").slice(0, 60);
  const r = await inscrever(dados.get("email"), origem);

  if (!r.ok) return { ok: false, mensagem: r.motivo };

  return {
    ok: true,
    mensagem: r.jaEstava
      ? "Você já estava na lista. Não fazemos nada duas vezes."
      : "Pronto. Você é avisado quando mudar.",
  };
}

export type EstadoSaida = { ok: boolean; mensagem?: string; concluido?: boolean };

/**
 * A baixa na lista.
 *
 * Fica atrás de um botão, e não do simples abrir do link, porque programa de
 * e-mail e antivírus visitam sozinhos os endereços de uma mensagem. Sem o botão,
 * quem nunca pediu para sair sairia calado, e só descobriria ao parar de receber.
 */
export async function removerDaLista(
  _anterior: EstadoSaida,
  dados: FormData,
): Promise<EstadoSaida> {
  const ficha = String(dados.get("ficha") ?? "");

  try {
    const r = await sairDaLista(ficha);
    if (!r.ok) {
      return {
        ok: false,
        mensagem: "Esse link não vale mais. Se você já saiu, está tudo certo.",
      };
    }
    return {
      ok: true,
      concluido: true,
      mensagem: r.jaEstavaFora
        ? "Você já não estava na lista. Nada muda."
        : "Pronto. Seu endereço saiu da lista e não recebe mais aviso.",
    };
  } catch {
    return { ok: false, mensagem: "Não consegui processar agora. Tenta de novo em instantes?" };
  }
}

export type EstadoPesquisa = { ok: boolean; mensagem?: string };

/**
 * A pesquisa que vai virar o benchmark próprio.
 *
 * Mesma armadilha de robô do cadastro. Aqui ela pesa mais: resposta falsa não
 * enche caixa de e-mail, ela entra na conta e sai publicada como se fosse
 * medição de gente que opera.
 */
export async function responderPesquisa(
  _anterior: EstadoPesquisa,
  dados: FormData,
): Promise<EstadoPesquisa> {
  if (String(dados.get("sobrenome") ?? "").trim() !== "") {
    return { ok: true, mensagem: "Registrada. Obrigado." };
  }

  const bruto: Record<string, unknown> = {};
  for (const p of PERGUNTAS) bruto[p.id] = dados.get(p.id);

  try {
    const guardou = await guardarResposta(bruto);
    if (!guardou) {
      return { ok: false, mensagem: "Faltou responder alguma pergunta. Confere e manda de novo?" };
    }
    return { ok: true, mensagem: "Registrada. Obrigado." };
  } catch {
    return { ok: false, mensagem: "Não consegui guardar agora. Tenta de novo em instantes?" };
  }
}
