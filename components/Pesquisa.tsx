"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { responderPesquisa, type EstadoPesquisa } from "@/app/actions";
import { PERGUNTAS } from "@/lib/pesquisa-perguntas";

/**
 * O formulário da pesquisa.
 *
 * Escolha única em tudo, faixa em tudo, nenhum campo aberto. Some o tempo de
 * resposta e some também a chance de alguém digitar por engano algo que
 * identifique a operação dele.
 */

const inicial: EstadoPesquisa = { ok: true };

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-farol px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
    >
      {pending ? "Enviando" : "Enviar minhas respostas"}
    </button>
  );
}

export function Pesquisa() {
  const [estado, acao] = useFormState(responderPesquisa, inicial);

  /**
   * O destaque da opção escolhida sai do estado, e não de seletor de CSS que
   * depende do irmão marcado. Assim ele funciona igual em qualquer navegador, e
   * um recurso de CSS ainda desigual não decide se a pessoa enxerga o que
   * acabou de clicar.
   */
  const [escolhas, setEscolhas] = useState<Record<string, string>>({});

  if (estado.ok && estado.mensagem) {
    return (
      <div className="rounded-xl border border-farol/25 bg-farol-claro p-6">
        <p className="font-serif text-xl font-semibold">{estado.mensagem}</p>
        <p className="mt-2 max-w-leitura text-[15px] leading-relaxed text-tinta-2">
          Sua resposta entrou na amostra. O resultado aparece na página de benchmarks assim
          que houver respostas suficientes para publicar sem inventar precisão.
        </p>
      </div>
    );
  }

  return (
    <form action={acao} className="flex flex-col gap-8">
      {/* Armadilha de robô: invisível e fora da ordem de tabulação. */}
      <input type="text" name="sobrenome" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {PERGUNTAS.map((pergunta, i) => (
        <fieldset key={pergunta.id} className="border-t border-risco pt-6 first:border-0 first:pt-0">
          <legend className="sr-only">{pergunta.texto}</legend>

          <p className="text-sm font-bold uppercase tracking-[0.12em] text-tinta-3">
            Pergunta {i + 1} de {PERGUNTAS.length}
          </p>
          <p className="mt-2 max-w-leitura font-serif text-xl font-semibold leading-snug">
            {pergunta.texto}
          </p>
          {pergunta.ajuda && (
            <p className="mt-1.5 max-w-leitura text-sm leading-relaxed text-tinta-2">
              {pergunta.ajuda}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {pergunta.opcoes.map((opcao) => {
              const marcada = escolhas[pergunta.id] === opcao.id;
              return (
                <label
                  key={opcao.id}
                  className={`cursor-pointer rounded-lg border px-4 py-2.5 text-[15px] transition ${
                    marcada
                      ? "border-farol bg-farol-claro font-semibold text-farol"
                      : "border-risco bg-papel-alto hover:border-farol"
                  }`}
                >
                  <input
                    type="radio"
                    name={pergunta.id}
                    value={opcao.id}
                    required
                    checked={marcada}
                    onChange={() => setEscolhas((a) => ({ ...a, [pergunta.id]: opcao.id }))}
                    className="sr-only"
                  />
                  {opcao.rotulo}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="border-t border-risco pt-6">
        <Botao />
        {!estado.ok && estado.mensagem && (
          <p className="mt-3 text-sm text-brasa">{estado.mensagem}</p>
        )}
      </div>
    </form>
  );
}
