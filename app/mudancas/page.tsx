import type { Metadata } from "next";
import Link from "next/link";
import { mudancasPorAno, mudancaMaisRecente, quantasEmVigor, todasAsMudancas } from "@/lib/mudancas";
import { formatarData } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { migalhas } from "@/lib/schema";
import { capturaLigada } from "@/lib/lista";
import { Estruturado } from "@/components/Estruturado";
import { SeloConfianca, Etiqueta } from "@/components/Selos";
import { Faixa } from "@/components/Faixa";
import { Inscrever } from "@/components/Inscrever";

/**
 * A linha do tempo das regras de plataforma.
 *
 * A página existe por causa de um erro nosso, e o erro tem endereço: em 30 de
 * julho de 2026 publicamos o critério da política de originalidade do Instagram
 * saído do documento de 2024, que já tinha sido substituído. Procurando o
 * documento certo, ficou claro que o problema não era nosso sozinho. Não existe,
 * em português, um lugar que diga quando cada regra mudou, e é por isso que
 * conselho vencido circula por anos com cara de novidade.
 *
 * Duas escolhas sustentam a página. A entrada vencida não é apagada, porque quem
 * chega procurando a regra antiga precisa achar exatamente ela e ser levado dali
 * para a atual. E toda entrada diz o que quebra na prática, porque data de
 * documento sem consequência é trivia.
 */

export const metadata: Metadata = {
  title: "Mudanças de regra da Shopee, do Instagram e da Meta, com data e documento",
  description:
    "Registro datado de cada mudança de regra de plataforma que afeta quem vende online. O que mudou, o documento que sustenta e o que quebra na prática. Regra substituída fica no ar, apontando para a que vale.",
  alternates: { canonical: "/mudancas" },
  openGraph: {
    type: "website",
    title: "O registro de mudanças de regra de plataforma",
    description:
      "Cada mudança com a data, o documento e o que ela quebra na operação de quem vende online.",
    url: `${SITE.url}/mudancas`,
  },
};

export default function Mudancas() {
  const grupos = mudancasPorAno();
  const quantas = todasAsMudancas().length;
  const emVigor = quantasEmVigor();
  const recente = mudancaMaisRecente();
  const lista = capturaLigada();

  return (
    <main>
      <Estruturado dados={migalhas([{ nome: "Mudanças", caminho: "/mudancas" }])} />

      <Faixa
        etiqueta="Registro"
        titulo={
          <>
            Quando a plataforma muda a regra,{" "}
            <em className="italic text-fumaca">a data fica registrada aqui</em>.
          </>
        }
        texto="Ninguém mantém esse registro em português para quem vive de marketplace e de rede social, e é por isso que conselho vencido circula por anos com cara de novidade. Cada entrada traz a data da mudança, o documento que a sustenta e o que ela quebra na prática. Regra substituída não sai do ar: fica apontando para a que vale."
        abaixo={
          <>
            {quantas} mudanças registradas · {emVigor} em vigor
            {recente ? ` · a mais recente de ${formatarData(recente)}` : ""}
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-5">
        {grupos.map((grupo) => (
          <section key={grupo.ano} className="border-b border-risco py-10">
            <Etiqueta>{grupo.ano}</Etiqueta>

            <div className="mt-6">
              {grupo.mudancas.map((m) => (
                <article
                  key={m.id}
                  id={m.id}
                  className="relative scroll-mt-6 border-l border-risco pb-10 pl-6 last:pb-0"
                >
                  {/* Cheio é regra em vigor, vazio é regra substituída. É a mesma
                      linguagem do ponto do selo de confiança: a informação existe
                      na forma, e não só na cor, então sobrevive em preto e branco. */}
                  <span
                    aria-hidden
                    className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                      m.substituidaPor
                        ? "bg-papel ring-1 ring-tinta-3"
                        : "bg-farol ring-4 ring-papel"
                    }`}
                  />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <time
                      dateTime={m.data}
                      className="font-serif text-lg font-semibold tabular-nums"
                    >
                      {formatarData(m.data)}
                    </time>
                    <Etiqueta>{m.plataforma}</Etiqueta>
                    <SeloConfianca confianca={m.confianca} />
                    {m.substituidaPor && m.substituidaEm && (
                      <a
                        href={`#${m.substituidaPor}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-risco bg-papel-fundo px-2.5 py-0.5 text-[11px] font-semibold text-tinta-2 transition hover:border-tinta-3"
                      >
                        <span
                          aria-hidden
                          className="h-2 w-2 shrink-0 rounded-full ring-1 ring-inset ring-current"
                        />
                        Substituída em {formatarData(m.substituidaEm)}
                      </a>
                    )}
                  </div>

                  <h2 className="mt-2 max-w-leitura font-serif text-xl font-semibold leading-snug">
                    {m.titulo}
                  </h2>

                  <p className="mt-2 max-w-leitura text-[15px] leading-relaxed text-tinta-2">
                    {m.oQueMudou}
                  </p>

                  <p className="mt-3 max-w-leitura border-l-2 border-farol pl-3 text-[15px] leading-relaxed">
                    <strong className="font-semibold">
                      {m.substituidaPor ? "O que quebrou: " : "O que quebra: "}
                    </strong>
                    <span className="text-tinta-2">{m.oQueQuebra}</span>
                  </p>

                  <p className="mt-3 max-w-leitura text-sm leading-relaxed text-tinta-3">
                    {m.fonteUrl ? (
                      <a
                        href={m.fonteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-farol underline underline-offset-2"
                      >
                        {m.fonte}
                      </a>
                    ) : (
                      m.fonte
                    )}
                    {m.post && m.tituloDoPost && (
                      <>
                        . Explicado em{" "}
                        <Link
                          href={`/posts/${m.post}`}
                          className="font-medium text-farol underline underline-offset-2"
                        >
                          {m.tituloDoPost}
                        </Link>
                      </>
                    )}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="py-10">
          <div className="grid gap-8 md:grid-cols-[1fr_320px]">
            <div className="max-w-leitura">
              <Etiqueta>Por que esta página existe</Etiqueta>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-tight">
                Ela nasceu de um erro nosso, e o erro tem data
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-tinta-2">
                Em 30 de julho de 2026 este site descreveu o critério da política de
                originalidade do Instagram citando o documento de 2024, que já tinha sido
                substituído. A{" "}
                <Link
                  href="/posts/instagram-conta-agregadora"
                  className="text-farol underline underline-offset-2"
                >
                  correção ficou no alto do texto
                </Link>
                , com as duas etapas do mesmo dia, e a regra que saiu dali está em{" "}
                <Link href="/sobre" className="text-farol underline underline-offset-2">
                  como a gente apura
                </Link>
                : achar um documento não encerra a busca.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-tinta-2">
                Procurando o documento certo, ficou claro que o buraco era maior. A data em que
                cada regra mudou não está reunida em lugar nenhum, então quem escreveu antes da
                mudança segue sendo lido depois dela. Este registro é a tentativa de fechar esse
                buraco, e ele cresce a cada mudança nova.
              </p>

              <h3 className="mt-7 font-serif text-lg font-semibold leading-snug">
                O que entra, e o que não entra
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-[15px] leading-relaxed text-tinta-2">
                <li>
                  Entrada só existe com data e com o documento que a sustenta. Aviso de grupo e
                  print de tela não viram registro.
                </li>
                <li>
                  Toda entrada diz o que a mudança quebra na operação. Data de documento sem
                  consequência prática não muda o dia de ninguém.
                </li>
                <li>
                  Regra substituída fica no ar, marcada, apontando para a que vale. Apagar é o
                  que faz o mercado citar versão vencida.
                </li>
                <li>
                  Quando a plataforma não publica o que mudou de uma versão para a outra, a
                  entrada diz isso, e vale como parcialmente verificada.
                </li>
              </ul>

              <p className="mt-6 text-[15px] leading-relaxed text-tinta-2">
                Os números que essas regras produzem ficam em{" "}
                <Link href="/benchmarks" className="text-farol underline underline-offset-2">
                  benchmarks
                </Link>
                , cada um com o documento e a data.
              </p>
            </div>

            {lista && (
              <Inscrever
                origem="mudancas"
                titulo="Quando a regra mudar"
                texto="A lista recebe as publicações do site, e mudança de regra vira publicação. Sem propaganda e sem repasse do seu e-mail."
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
