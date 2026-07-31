"use client";

import { useFormState, useFormStatus } from "react-dom";
import { removerDaLista, type EstadoSaida } from "@/app/actions";

const inicial: EstadoSaida = { ok: true };

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-carvao px-5 py-3 text-sm font-semibold text-papel transition hover:brightness-125 disabled:opacity-60"
    >
      {pending ? "Saindo" : "Sair da lista"}
    </button>
  );
}

export function Sair({ ficha }: { ficha: string }) {
  const [estado, acao] = useFormState(removerDaLista, inicial);

  if (estado.concluido) {
    return (
      <p className="rounded-xl border border-risco bg-farol-claro px-4 py-3 text-[15px] font-medium text-farol">
        {estado.mensagem}
      </p>
    );
  }

  return (
    <>
      <form action={acao}>
        <input type="hidden" name="ficha" value={ficha} />
        <Botao />
      </form>

      {!estado.ok && estado.mensagem && (
        <p className="mt-3 text-[15px] text-brasa">{estado.mensagem}</p>
      )}
    </>
  );
}
