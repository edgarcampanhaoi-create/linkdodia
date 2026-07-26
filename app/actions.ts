"use server";

import { inscrever } from "@/lib/lista";

export type EstadoInscricao = { ok: boolean; mensagem?: string };

/**
 * Cadastro na lista.
 *
 * O campo `sobrenome` é uma armadilha para robô (honeypot): fica escondido no
 * formulário, gente não preenche, robô preenche tudo. Se vier preenchido, a
 * gente responde "deu certo" e não grava nada — dizer "você é um robô" só
 * ensina o robô a passar da próxima vez.
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
      ? "Você já estava na lista — tudo certo."
      : "Pronto! Você recebe o próximo.",
  };
}
