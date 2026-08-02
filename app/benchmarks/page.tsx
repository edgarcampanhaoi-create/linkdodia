import type { Metadata } from "next";
import Link from "next/link";
import { numerosPorCategoria, todasAsLacunas, atualizadoEm } from "@/lib/numeros";
import { formatarData } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { migalhas } from "@/lib/schema";
import { Estruturado } from "@/components/Estruturado";
import { capturaLigada } from "@/lib/lista";
import { resultadoDaPesquisa } from "@/lib/pesquisa";
import { SeloConfianca, Etiqueta } from "@/components/Selos";
import { Faixa } from "@/components/Faixa";
import { Calculadora } from "@/components/Calculadora";
import { ResultadoPesquisa } from "@/components/ResultadoPesquisa";
import { Inscrever } from "@/components/Inscrever";

/**
 * A página que o site inteiro existe para sustentar.
 *
 * Post é leitura, e leitura envelhece na memória de quem leu. Aqui fica o que a
 * pessoa volta para consultar: o número, a fonte com nome e data, e o que fazer
 * com ele. A lista de lacunas fica na mesma página, e não escondida, porque
 * saber o que ninguém sabe vale tanto quanto saber o número.
 */

/** O bloco da pesquisa lê a contagem no banco, então a página não congela no build. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Benchmarks de afiliado e marketplace, com a fonte de cada número",
  description:
    "Comissão base, janela de atribuição, requisitos de tagueamento e prazos da Meta. Cada número com o documento que o sustenta, a data, e o que fazer com ele.",
  alternates: { canonical: "/benchmarks" },
  openGraph: {
    type: "website",
    title: "Benchmarks de afiliado e marketplace",
    description:
      "Os números que valem, com o documento de cada um. E a lista do que ainda não dá para afirmar.",
    url: `${SITE.url}/benchmarks`,
  },
};

export default async function Benchmarks() {
  const grupos = numerosPorCategoria();
  const lacunas = todasAsLacunas();
  const atualizado = atualizadoEm();
  const quantos = grupos.reduce((soma, g) => soma + g.numeros.length, 0);
  const lista = capturaLigada();
  const pesquisa = await resultadoDaPesquisa();

  return (
    <main>
      <Estruturado dados={migalhas([{ nome: "Benchmarks", caminho: "/benchmarks" }])} />

      <Faixa
        etiqueta="Referência"
        titulo={
          <>
            Os {quantos} números{" "}
            <em className="italic text-fumaca">que dá para provar</em>.
          </>
        }
        texto="Cada um com o documento, o artigo e a data. Se você não conseguir conferir por conta própria em dois cliques, o número não deveria estar nesta página, e não está. Nenhum deles é estimativa nossa: onde o mercado publica média, aqui há artigo de contrato, e onde não há artigo, há uma lacuna declarada no fim da página."
        abaixo={
          <>
            {quantos} números conferidos
            {atualizado ? ` · documento mais recente de ${formatarData(atualizado)}` : ""}
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-5">

      {/* A nota de método fica no alto, e não escondida no rodapé. A diferença
          entre data de documento e data de consulta é o que diz se o número
          pode ter mudado ontem sem ninguém avisar. */}
      <p className="max-w-leitura border-b border-risco py-6 text-sm leading-relaxed text-tinta-2">
        Número de contrato traz a data da versão do documento. Número de documentação sem
        versionamento público traz a data em que consultamos. A diferença aparece em cada
        linha, porque é ela que diz se o número pode ter mudado ontem sem ninguém avisar.
      </p>

      {grupos.map((grupo) => (
        <section key={grupo.categoria} className="border-b border-risco py-10">
          <Etiqueta>{grupo.categoria}</Etiqueta>

          <div className="mt-5 flex flex-col divide-y divide-risco">
            {grupo.numeros.map((n) => (
              <article
                key={n.id}
                id={n.id}
                className="grid scroll-mt-6 gap-x-8 gap-y-3 py-6 first:pt-0 md:grid-cols-[190px_1fr]"
              >
                <div>
                  <p className="font-serif text-3xl font-semibold leading-none tracking-tight tabular-nums">
                    {n.valor}
                  </p>
                  <div className="mt-3">
                    <SeloConfianca confianca={n.confianca} />
                  </div>
                </div>

                <div className="max-w-leitura">
                  <h2 className="font-serif text-xl font-semibold leading-snug">
                    {n.titulo}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-tinta-2">{n.oQueE}</p>

                  <p className="mt-3 border-l-2 border-farol pl-3 text-[15px] leading-relaxed">
                    <strong className="font-semibold">O que fazer: </strong>
                    <span className="text-tinta-2">{n.oQueFazer}</span>
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-tinta-3">
                    {n.fonteUrl ? (
                      <a
                        href={n.fonteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-farol underline underline-offset-2"
                      >
                        {n.fonte}
                      </a>
                    ) : (
                      n.fonte
                    )}
                    {n.dataDe === "consulta"
                      ? `, conferida em ${formatarData(n.desde)}`
                      : `, de ${formatarData(n.desde)}`}
                    . Explicado em{" "}
                    <Link
                      href={`/posts/${n.post}`}
                      className="font-medium text-farol underline underline-offset-2"
                    >
                      {n.tituloDoPost}
                    </Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="border-b border-risco py-10">
        <Etiqueta>Faça a sua conta</Etiqueta>
        <h2 className="mt-3 max-w-leitura font-serif text-2xl font-semibold leading-snug tracking-tight">
          A sua comissão média dos últimos 90 dias
        </h2>
        <p className="mt-3 max-w-leitura text-[15px] leading-relaxed text-tinta-2">
          A conta é comissão recebida dividida pelo valor dos pedidos. Faça antes de
          acreditar em qualquer tabela de categoria: o número certo para a sua operação está
          no seu painel, e não no blog de ninguém. Se der perto de 3%, você está no piso do
          contrato, e o gargalo provavelmente é o que você escolhe divulgar.
        </p>
        <p className="mt-2 max-w-leitura text-sm leading-relaxed text-tinta-3">
          Roda inteira no seu navegador. Nada do que você digitar sai da sua máquina, porque
          não existe para onde mandar.
        </p>
        <div className="mt-5">
          <Calculadora />
        </div>
      </section>

      <section id="lacunas" className="scroll-mt-6 border-b border-risco py-10">
        <Etiqueta>O que ainda não sabemos</Etiqueta>
        <h2 className="mt-3 max-w-leitura font-serif text-2xl font-semibold leading-snug tracking-tight">
          As {lacunas.length} perguntas que ninguém responde
        </h2>
        <div className="mt-3 flex max-w-leitura flex-col gap-3 text-[15px] leading-relaxed text-tinta-2">
          <p>
            Esta lista é publicada de propósito. Site de referência que só mostra o que sabe
            ensina o leitor a confiar demais, e a primeira lacuna que ele descobrir sozinho
            derruba o resto junto.
          </p>
          <p>
            Cada pergunta aqui embaixo vem com o motivo de não ter resposta. Não são
            perguntas difíceis: são perguntas cuja resposta não existe em documento nenhum,
            público ou divulgado. Publicar um número para elas exigiria inventar.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {lacunas.map((l) => (
            <article key={l.pergunta} className="rounded-xl border border-risco bg-papel-alto p-5">
              <h3 className="font-serif text-lg font-semibold leading-snug">{l.pergunta}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-2">{l.porque}</p>
              <Link
                href={`/posts/${l.post}`}
                className="mt-3 inline-block text-sm font-medium text-farol underline underline-offset-2"
              >
                {l.tituloDoPost}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {pesquisa && (
        <section className="border-b border-risco py-10">
          <Etiqueta>O benchmark de quem opera</Etiqueta>
          <h2 className="mt-3 max-w-leitura font-serif text-2xl font-semibold leading-snug tracking-tight">
            {pesquisa.publicavel
              ? "O que a operação de verdade está reportando"
              : "O número que nenhuma plataforma divulga está sendo medido aqui"}
          </h2>
          <p className="mt-3 max-w-leitura text-[15px] leading-relaxed text-tinta-2">
            Os números acima vêm de documento. Estes vêm de gente que opera, respondendo em
            faixa e sem se identificar. É a única forma de saber quanto um afiliado
            brasileiro tira de comissão média, porque isso não está publicado em lugar
            nenhum.
          </p>
          <div className="mt-6">
            <ResultadoPesquisa dados={pesquisa} />
          </div>
        </section>
      )}

      <section className="py-10">
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="max-w-leitura">
            <Etiqueta>O que vem a seguir</Etiqueta>
            <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-tight">
              As lacunas acima são a próxima etapa deste site
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-tinta-2">
              Nenhuma delas se resolve lendo documento, porque a resposta não está publicada
              em lugar nenhum. Ela só aparece juntando medição de muita gente que opera e
              anota. A{" "}
              <Link href="/pesquisa" className="text-farol underline underline-offset-2">
                pesquisa
              </Link>{" "}
              é a máquina de juntar, e leva dois minutos.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-tinta-2">
              O resultado nasce com o mesmo rótulo de confiança do resto: o número de
              respostas na cara, e o que a amostra não permite dizer escrito junto.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-tinta-2">
              As regras que produzem esses números também mudam, e a data de cada mudança fica
              em{" "}
              <Link href="/mudancas" className="text-farol underline underline-offset-2">
                o que mudou
              </Link>
              . Número desta página que sair de regra substituída aparece lá com a data da
              troca.
            </p>
          </div>

          {lista && (
            <Inscrever
              origem="benchmarks-fim"
              titulo="Número muda sem aviso"
              texto={`Quando um destes ${quantos} números mudar de valor, de fonte ou de data, sai um e-mail. É o único motivo pelo qual mandamos e-mail.`}
            />
          )}
        </div>
      </section>
      </div>
    </main>
  );
}
