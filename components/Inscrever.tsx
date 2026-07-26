"use client";

import { useFormState, useFormStatus } from "react-dom";
import { inscreverNaLista, type EstadoInscricao } from "@/app/actions";

const inicial: EstadoInscricao = { ok: true };

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-lg bg-farol px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Quero receber"}
    </button>
  );
}

/**
 * Caixa de cadastro. Só é renderizada quando existe destino configurado — quem
 * decide é o servidor, em `capturaLigada()`.
 */
export function Inscrever({
  origem,
  titulo = "Receba o próximo",
  texto = "Uma publicação por dia, com a fonte junto. Sem propaganda e sem repasse do seu e-mail.",
}: {
  origem: string;
  titulo?: string;
  texto?: string;
}) {
  const [estado, acao] = useFormState(inscreverNaLista, inicial);

  return (
    <section className="rounded-xl border border-risco bg-papel-alto p-5">
      <p className="font-serif text-lg font-semibold">{titulo}</p>
      <p className="mt-1 max-w-leitura text-sm leading-relaxed text-tinta-2">{texto}</p>

      {estado.ok && estado.mensagem ? (
        <p className="mt-4 rounded-lg bg-farol-claro px-3 py-2.5 text-sm font-medium text-farol">
          {estado.mensagem}
        </p>
      ) : (
        <form action={acao} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input type="hidden" name="origem" value={origem} />

          {/* Armadilha de robô: invisível e fora da ordem de tabulação. */}
          <input
            type="text"
            name="sobrenome"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <label className="sr-only" htmlFor={`email-${origem}`}>
            Seu e-mail
          </label>
          <input
            id={`email-${origem}`}
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-risco bg-papel px-3.5 py-2.5 text-base outline-none transition focus:border-farol focus:ring-2 focus:ring-farol/20"
          />
          <Botao />
        </form>
      )}

      {!estado.ok && estado.mensagem && (
        <p className="mt-2 text-sm text-brasa">{estado.mensagem}</p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-tinta-3">
        Guardamos só o endereço, para enviar as publicações. Não repassamos a ninguém e dá
        pra sair em um clique, em qualquer e-mail.
      </p>
    </section>
  );
}
