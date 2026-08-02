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
      {pending ? "Enviando" : "Quero o aviso"}
    </button>
  );
}

/**
 * Caixa de cadastro. Só é renderizada quando existe destino configurado. Quem
 * decide é o servidor, em `capturaLigada()`.
 *
 * O texto padrão vende o silêncio, e não a frequência. Quem assina esperando
 * conteúdo diário cancela na terceira semana sem receber nada; quem assina
 * entendendo que o silêncio é o produto fica. A `nota` existe para isso: ela
 * avisa que o primeiro e-mail pode demorar, e é de propósito que ela não seja
 * escondida. Quem lê aquilo e assina mesmo assim é o leitor certo.
 */
export function Inscrever({
  origem,
  titulo = "O aviso",
  texto = "Um e-mail quando a regra do jogo muda. Só isso. Sem bom dia, sem newsletter de sexta, sem convite para conferir nosso conteúdo. Se a Shopee e a Meta não mexerem em nada, você não recebe nada, e passar vinte dias sem notícia nossa é a melhor notícia possível.",
  nota = "O primeiro e-mail pode demorar. Ele só sai quando algo mudar.",
}: {
  origem: string;
  titulo?: string;
  texto?: string;
  nota?: string;
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

      {nota && <p className="mt-3 text-sm font-medium leading-relaxed text-tinta-2">{nota}</p>}

      <p className="mt-2 text-xs leading-relaxed text-tinta-3">
        Três coisas disparam aviso: entrada nova no registro de mudanças, número do
        benchmark que mudou de valor, de fonte ou de data, e publicação nova. Guardamos só o
        endereço, não repassamos a ninguém, e a saída é um clique no rodapé de todo aviso.
      </p>
    </section>
  );
}
