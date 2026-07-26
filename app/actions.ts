"use server";

import { inscrever } from "@/lib/lista";
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
    return { ok: true, mensagem: "Pronto! Você recebe o próximo." };
  }

  const origem = String(dados.get("origem") ?? "site").slice(0, 60);
  const r = await inscrever(dados.get("email"), origem);

  if (!r.ok) return { ok: false, mensagem: r.motivo };

  return {
    ok: true,
    mensagem: r.jaEstava
      ? "Você já estava na lista. Tudo certo."
      : "Pronto! Você recebe o próximo.",
  };
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
    return { ok: true, mensagem: "Resposta registrada. Obrigado." };
  }

  const bruto: Record<string, unknown> = {};
  for (const p of PERGUNTAS) bruto[p.id] = dados.get(p.id);

  try {
    const guardou = await guardarResposta(bruto);
    if (!guardou) {
      return { ok: false, mensagem: "Faltou responder alguma pergunta. Confere e manda de novo?" };
    }
    return { ok: true, mensagem: "Resposta registrada. Obrigado." };
  } catch {
    return { ok: false, mensagem: "Não consegui guardar agora. Tenta de novo em instantes?" };
  }
}
