import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { migalhas } from "@/lib/schema";
import { Etiqueta } from "@/components/Selos";
import { Estruturado } from "@/components/Estruturado";

export const metadata: Metadata = {
  title: "O método: como a gente apura e o que se recusa a publicar",
  description:
    "Como o Link do Dia apura, o que significa cada selo de confiança e o que a gente se recusa a publicar.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    type: "website",
    title: `O método do ${SITE.nome}`,
    description: "Como a gente apura, e o que se recusa a publicar.",
    url: `${SITE.url}/sobre`,
  },
};

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-5xl px-5">
      <Estruturado dados={migalhas([{ nome: "O método", caminho: "/sobre" }])} />

      <article className="max-w-leitura py-10">
        <Etiqueta>O método</Etiqueta>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Como a gente apura, e o que se recusa a publicar
        </h1>

        <div className="prosa mt-8">
          <p>
            O conteúdo sobre marketing digital tem um problema específico:
            número sem fonte. Uma porcentagem aparece num post, é copiada por
            outro, e três meses depois virou &ldquo;o que todo mundo sabe&rdquo;
            sem que ninguém consiga dizer de onde ela saiu.
          </p>
          <p>
            O Link do Dia existe para fazer o contrário. A regra é simples e não
            tem exceção: toda afirmação vem com a fonte, e o que não deu para
            confirmar é publicado dizendo que não deu.
          </p>

          <h2>Os três selos</h2>
          <p>
            Todo texto abre com um selo. Ele indica o peso do que você vai ler.
          </p>
          <ul>
            <li>
              <strong>Verificado na fonte.</strong> Cada afirmação central foi
              conferida no documento oficial citado no rodapé, seja termo de uso,
              central de ajuda, documentação técnica ou lei.
            </li>
            <li>
              <strong>Parcialmente verificado.</strong> Parte vem de documento
              oficial e parte de observação de campo. O texto diz qual é qual, no
              parágrafo em que a informação aparece.
            </li>
            <li>
              <strong>Não confirmado.</strong> Não achamos fonte primária para o
              ponto central. Publicamos como hipótese, marcada como tal, porque
              às vezes saber que ninguém sabe já resolve a decisão de alguém.
            </li>
          </ul>

          <h2>O que não publicamos</h2>
          <ul>
            <li>
              Número sem origem. Se não dá para dizer de onde veio, não vira
              gráfico aqui.
            </li>
            <li>
              Tabela sem data. Comissão, limite e regra de plataforma mudam.
              Tabela sem data envelhece calada e vira desinformação com cara de
              referência.
            </li>
            <li>
              Dado privado de operação real identificável. Faturamento, custo e
              margem de pessoas e empresas não entram, mesmo com autorização
              informal, porque o nicho é pequeno e o anonimato costuma ser
              ilusório.
            </li>
            <li>
              Conteúdo raspado de plataforma. O que se ganha em volume se perde
              em risco de termos de uso, e em credibilidade.
            </li>
          </ul>

          <h2>De onde vêm os dados</h2>
          <p>
            Documentos oficiais das plataformas, como termos, centrais de ajuda e
            documentação de API. Legislação e jurisprudência brasileiras.
            Ferramentas de inteligência de mercado licenciadas. E observação
            direta, sempre declarada como observação. Quando a informação vem de
            fonte secundária, o texto avisa.
          </p>

          <h2>Correções</h2>
          <p>
            Plataforma muda regra sem avisar, e a gente erra como qualquer um.
            Post corrigido leva a correção visível no próprio texto, com data. Não
            some nem é reescrito em silêncio.
          </p>
        </div>

        <p className="mt-10 rounded-xl border border-risco bg-papel-fundo p-4 text-sm leading-relaxed text-tinta-2">
          {SITE.promessa}
        </p>
      </article>
    </main>
  );
}
