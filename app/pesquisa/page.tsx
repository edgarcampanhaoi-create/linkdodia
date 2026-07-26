import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { migalhas } from "@/lib/schema";
import { resultadoDaPesquisa, pesquisaLigada } from "@/lib/pesquisa";
import { PERGUNTAS } from "@/lib/pesquisa-perguntas";
import { Pesquisa } from "@/components/Pesquisa";
import { Etiqueta } from "@/components/Selos";
import { Estruturado } from "@/components/Estruturado";

/**
 * A página que fabrica o dado que não existe.
 *
 * As lacunas da página de benchmarks não se resolvem lendo documento nenhum,
 * porque a resposta não está publicada em lugar algum. Ela só aparece juntando
 * medição de quem opera. Isto aqui é a máquina de juntar.
 */

/** Lê a contagem no banco, então não pode ser página congelada no build. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Quanto um afiliado brasileiro tira de comissão? A pesquisa",
  description:
    "Seis perguntas de faixa, dois minutos, sem nome e sem e-mail. As respostas viram o benchmark de comissão média que nenhuma plataforma divulga.",
  alternates: { canonical: "/pesquisa" },
  openGraph: {
    type: "website",
    title: "A pesquisa do Link do Dia",
    description:
      "Seis perguntas, dois minutos, anônima. O resultado volta público, com o número de respostas na cara.",
    url: `${SITE.url}/pesquisa`,
  },
};

export default async function PaginaPesquisa() {
  const ligada = pesquisaLigada();
  const dados = await resultadoDaPesquisa();

  return (
    <main className="mx-auto max-w-5xl px-5">
      <Estruturado dados={migalhas([{ nome: "A pesquisa", caminho: "/pesquisa" }])} />

      <section className="border-b border-risco py-10">
        <Etiqueta>A pesquisa</Etiqueta>
        <h1 className="mt-3 max-w-leitura font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Seis perguntas para montar o número que{" "}
          <em className="italic text-tinta-2">ninguém publica</em>.
        </h1>
        <p className="mt-4 max-w-leitura text-base leading-relaxed text-tinta-2">
          Quanto um afiliado brasileiro recebe de comissão por mês? Qual categoria paga a
          conta? Quanta gente já usa tagueamento nativo e quanta abandonou? Nenhuma
          plataforma divulga isso, e nenhum blog mede. Só dá para saber perguntando a quem
          opera.
        </p>

        <div className="mt-6 flex flex-col gap-2 text-[15px] leading-relaxed text-tinta-2">
          <p>
            <strong className="font-semibold">Dois minutos.</strong> São {PERGUNTAS.length}{" "}
            perguntas de escolha única, e toda resposta é faixa.
          </p>
          <p>
            <strong className="font-semibold">Anônima de verdade.</strong> Não pedimos nome,
            não pedimos e-mail e não guardamos nada que identifique você. Toda resposta é
            faixa, inclusive a de dinheiro, e a de dinheiro tem opção para quem prefere não
            responder. Não há campo onde caiba um dado pessoal, então isso não depende da
            nossa palavra.
          </p>
          <p>
            <strong className="font-semibold">O resultado é público.</strong> Vai para a{" "}
            <Link href="/benchmarks" className="text-farol underline underline-offset-2">
              página de benchmarks
            </Link>
            , de graça, com o número de respostas na cara e o que a amostra não permite
            dizer escrito junto.
          </p>
        </div>

        {dados && !dados.publicavel && dados.n > 0 && (
          <p className="mt-6 text-sm text-tinta-3">
            {dados.n} {dados.n === 1 ? "pessoa já respondeu" : "pessoas já responderam"}.
            Faltam {dados.faltam} para publicar o primeiro resultado.
          </p>
        )}
      </section>

      <section className="py-10">
        {ligada ? (
          <Pesquisa />
        ) : (
          <p className="max-w-leitura text-[15px] leading-relaxed text-tinta-2">
            A coleta está fora do ar neste momento. Perguntar e jogar a resposta fora seria
            pior que não perguntar, então o formulário não aparece.
          </p>
        )}
      </section>
    </main>
  );
}
