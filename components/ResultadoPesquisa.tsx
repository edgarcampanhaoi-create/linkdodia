import Link from "next/link";
import type { Agregado } from "@/lib/pesquisa-perguntas";
import { Etiqueta } from "@/components/Selos";

/**
 * O resultado da pesquisa, ou a contagem para chegar nele.
 *
 * As duas telas importam. Enquanto a amostra é pequena, mostrar quantas
 * respostas faltam é mais honesto que mostrar percentual de dez pessoas, e
 * ainda dá motivo para quem chegou ali responder.
 */

function Barra({ percentual, destaque }: { percentual: number; destaque: boolean }) {
  return (
    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-papel-fundo">
      <div
        className={`h-full rounded-full ${destaque ? "bg-farol" : "bg-tinta-3"}`}
        style={{ width: `${Math.max(percentual, 1)}%` }}
      />
    </div>
  );
}

export function ResultadoPesquisa({ dados }: { dados: Agregado }) {
  if (!dados.publicavel) {
    return (
      <div className="rounded-xl border border-risco bg-papel-alto p-6">
        <Etiqueta>Em coleta</Etiqueta>
        <p className="mt-3 font-serif text-2xl font-semibold leading-snug">
          {dados.n === 0
            ? "A coleta começou agora"
            : `${dados.n} ${dados.n === 1 ? "resposta" : "respostas"} até aqui`}
        </p>
        <p className="mt-2 max-w-leitura text-[15px] leading-relaxed text-tinta-2">
          Faltam {dados.faltam} para publicar. Esse piso existe porque percentual tirado de
          amostra pequena parece informação e não é. Enquanto não chegar lá, nada de
          porcentagem nesta página.
        </p>
        <Link
          href="/pesquisa"
          className="mt-4 inline-block rounded-lg bg-farol px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Responder em dois minutos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        {dados.perguntas.map((pergunta) => {
          const maior = Math.max(...pergunta.opcoes.map((o) => o.percentual));
          return (
            <div key={pergunta.id} className="rounded-xl border border-risco bg-papel-alto p-5">
              <h3 className="font-serif text-lg font-semibold leading-snug">{pergunta.texto}</h3>
              {pergunta.n !== dados.n && (
                <p className="mt-1 text-xs text-tinta-3">
                  {pergunta.n} de {dados.n} responderam esta pergunta. Os percentuais abaixo
                  são sobre {pergunta.n}.
                </p>
              )}

              <ul className="mt-4 flex flex-col gap-3">
                {pergunta.opcoes.map((opcao) => (
                  <li key={opcao.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className={opcao.percentual === maior ? "font-semibold" : "text-tinta-2"}>
                        {opcao.rotulo}
                      </span>
                      <span className="tabular-nums text-tinta-3">
                        {opcao.percentual}% <span className="text-xs">({opcao.quantos})</span>
                      </span>
                    </div>
                    <Barra percentual={opcao.percentual} destaque={opcao.percentual === maior} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-risco bg-papel-fundo p-5">
        <Etiqueta>Como ler estes números</Etiqueta>
        <ul className="mt-3 flex max-w-leitura flex-col gap-2 text-sm leading-relaxed text-tinta-2">
          <li>
            A amostra é de {dados.n} respostas de leitores deste site. Não é amostra
            aleatória do mercado, e leitor de um site sobre método provavelmente mede mais
            que a média.
          </li>
          <li>
            Tudo é autodeclarado e em faixa. Ninguém enviou extrato, e a gente não tem como
            conferir.
          </li>
          <li>
            A resposta é anônima, então não dá para impedir que a mesma pessoa responda duas
            vezes. Se isso virar problema visível na série, a gente muda o método e conta o
            que mudou.
          </li>
          <li>
            Percentual arredondado para inteiro. Casa decimal em amostra deste tamanho é
            precisão que o número não tem.
          </li>
        </ul>
      </div>
    </div>
  );
}
