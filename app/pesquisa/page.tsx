import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { migalhas } from "@/lib/schema";
import { resultadoDaPesquisa, pesquisaLigada } from "@/lib/pesquisa";
import { PERGUNTAS, MIN_RESPOSTAS } from "@/lib/pesquisa-perguntas";
import { Pesquisa } from "@/components/Pesquisa";
import { Faixa } from "@/components/Faixa";
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
    "Sete perguntas de faixa, dois minutos, sem nome e sem e-mail. As respostas viram o benchmark de comissão média que nenhuma plataforma divulga.",
  alternates: { canonical: "/pesquisa" },
  openGraph: {
    type: "website",
    title: "A pesquisa do Link do Dia",
    description:
      "Sete perguntas, dois minutos, anônima. O resultado volta público, com o número de respostas na cara.",
    url: `${SITE.url}/pesquisa`,
  },
};

export default async function PaginaPesquisa() {
  const ligada = pesquisaLigada();
  const dados = await resultadoDaPesquisa();

  /**
   * A manchete é a única escassez que este site pode usar, porque é verdadeira.
   * Ela conta quantas faltam, e o número vem do banco, não do texto. Quando a
   * amostra atinge o piso, a manchete deixa de pedir e passa a entregar.
   *
   * E quando o banco não responde, `dados` vem nulo e a manchete não cita
   * número nenhum. Carimbar o piso de {MIN_RESPOSTAS} como se fosse leitura
   * seria anunciar um número que não foi conferido, na página que existe para
   * dizer que número sem origem não vale.
   */
  const publicavel = dados?.publicavel ?? false;

  return (
    <main>
      <Estruturado dados={migalhas([{ nome: "A pesquisa", caminho: "/pesquisa" }])} />

      <Faixa
        etiqueta="A pesquisa"
        titulo={
          publicavel && dados ? (
            <>
              O que {dados.n} operadores{" "}
              <em className="italic text-fumaca">responderam</em>.
            </>
          ) : dados ? (
            <>
              Faltam {dados.faltam} respostas para este mercado ter{" "}
              <em className="italic text-fumaca">o primeiro número real</em>.
            </>
          ) : (
            <>
              {PERGUNTAS.length} perguntas para montar o número que{" "}
              <em className="italic text-fumaca">ninguém publica</em>.
            </>
          )
        }
        texto="Quanto um afiliado brasileiro recebe de comissão por mês? Qual categoria paga a conta? Quanta gente já usa tagueamento nativo e quanta abandonou? Nenhuma plataforma divulga isso, e nenhum blog mede. Só dá para saber perguntando a quem opera."
        abaixo={
          dados && !dados.publicavel && dados.n > 0 ? (
            <>
              {dados.n} {dados.n === 1 ? "pessoa já respondeu" : "pessoas já responderam"}.
              Faltam {dados.faltam} para publicar o primeiro resultado.
            </>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-5xl px-5">
      <section className="border-b border-risco py-10">
        <div className="flex flex-col gap-2 text-[15px] leading-relaxed text-tinta-2">
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
      </section>

      <section className="border-b border-risco py-10">
        <h2 className="max-w-leitura font-serif text-2xl font-semibold leading-snug tracking-tight">
          Por que {MIN_RESPOSTAS}, e por que {MIN_RESPOSTAS} ainda é pouco
        </h2>
        <div className="mt-3 flex max-w-leitura flex-col gap-3 text-[15px] leading-relaxed text-tinta-2">
          <p>
            Trinta é pouco para um censo e é o mínimo para não ser anedota. Abaixo disso esta
            página não mostra porcentagem nenhuma: mostra quantas faltam.
          </p>
          <p>
            Publicar percentual de oito respostas é precisamente o que acusamos os outros de
            fazer. Não vamos fazer na nossa própria página.
          </p>
          <p>
            E quando publicar, vai junto o que a amostra{" "}
            <strong className="font-semibold text-tinta">não</strong> permite dizer: leitor
            deste site não é amostra aleatória do mercado, tudo é autodeclarado, e resposta
            anônima não dá para impedir de repetir. Mesmo com as três ressalvas, vai ser o
            único número público que existe sobre isso.
          </p>
        </div>
      </section>

      <section className="py-10">
        {ligada && dados && !publicavel && (
          <p className="mb-6 max-w-leitura font-serif text-xl font-semibold leading-snug">
            Você é uma das {dados.faltam} que faltam.
          </p>
        )}
        {ligada ? (
          <Pesquisa />
        ) : (
          <p className="max-w-leitura text-[15px] leading-relaxed text-tinta-2">
            A coleta está fora do ar neste momento. Perguntar e jogar a resposta fora seria
            pior que não perguntar, então o formulário não aparece.
          </p>
        )}
      </section>
      </div>
    </main>
  );
}
