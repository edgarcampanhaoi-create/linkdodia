import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { Etiqueta } from "@/components/Selos";

export const metadata: Metadata = {
  title: "O método",
  description:
    "Como o Link do Dia apura, o que significa cada selo de confiança e o que a gente se recusa a publicar.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-5xl px-5">
      <article className="max-w-leitura py-10">
        <Etiqueta>O método</Etiqueta>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Como a gente apura — e o que se recusa a publicar
        </h1>

        <div className="prosa mt-8">
          <p>
            O mercado de conteúdo sobre marketing digital tem um problema
            específico: <strong>número sem fonte</strong>. Uma porcentagem
            aparece num post, é copiada por outro, e três meses depois ela é
            &ldquo;o que todo mundo sabe&rdquo; — sem que ninguém consiga dizer
            de onde saiu.
          </p>
          <p>
            O Link do Dia existe para o contrário disso. A regra é simples e não
            tem exceção: <strong>toda afirmação vem com a fonte</strong>, e o que
            não deu para confirmar é publicado dizendo que não deu.
          </p>

          <h2>Os três selos</h2>
          <p>
            Todo texto abre com um selo. Ele não é decoração — é o peso do que
            você vai ler:
          </p>
          <ul>
            <li>
              <strong>Verificado na fonte</strong> — cada afirmação central foi
              conferida no documento oficial citado (termos de uso, central de
              ajuda, documentação técnica, lei).
            </li>
            <li>
              <strong>Parcialmente verificado</strong> — parte vem de documento
              oficial, parte de observação de campo. O texto diz qual é qual, no
              parágrafo em que aparece.
            </li>
            <li>
              <strong>Não confirmado</strong> — não achamos fonte primária para o
              ponto central. Publicamos como hipótese, marcada como tal, porque
              às vezes saber que <em>ninguém sabe</em> já é informação útil.
            </li>
          </ul>

          <h2>O que não publicamos</h2>
          <ul>
            <li>
              <strong>Número sem origem.</strong> Se não dá para dizer de onde
              veio, não vira gráfico aqui.
            </li>
            <li>
              <strong>Tabela sem data.</strong> Comissão, limite e regra de
              plataforma mudam. Tabela sem data envelhece calada e vira
              desinformação.
            </li>
            <li>
              <strong>Dado privado de operação real.</strong> Faturamento, custo
              e margem de pessoas e empresas identificáveis não entram, mesmo com
              autorização informal — o nicho é pequeno e o anonimato costuma ser
              ilusório.
            </li>
            <li>
              <strong>Conteúdo raspado de plataforma.</strong> Não coletamos
              dados em desacordo com os termos de uso das redes. O que se ganha
              em volume se perde em risco — e em credibilidade.
            </li>
          </ul>

          <h2>De onde vêm os dados</h2>
          <p>
            Documentos oficiais das plataformas (termos, centrais de ajuda,
            documentação de API), legislação e jurisprudência brasileiras,
            ferramentas de inteligência de mercado licenciadas e observação
            direta declarada como tal. Quando uma informação vem de fonte
            secundária, o texto diz isso.
          </p>

          <h2>Correções</h2>
          <p>
            Plataforma muda regra sem avisar, e a gente erra como qualquer um.
            Post corrigido leva a correção visível no próprio texto, com data —
            não some nem é reescrito em silêncio.
          </p>
        </div>

        <p className="mt-10 rounded-xl border border-risco bg-papel-fundo p-4 text-sm leading-relaxed text-tinta-2">
          {SITE.promessa}
        </p>
      </article>
    </main>
  );
}
