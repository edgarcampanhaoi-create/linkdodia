import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categorias, postsDaCategoria, formatarData } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { migalhas } from "@/lib/schema";
import { SeloConfianca } from "@/components/Selos";
import { Faixa } from "@/components/Faixa";
import { Estruturado } from "@/components/Estruturado";

export function generateStaticParams() {
  return categorias().map((c) => ({ nome: c.slug }));
}

export function generateMetadata({ params }: { params: { nome: string } }): Metadata {
  const cat = categorias().find((c) => c.slug === params.nome);
  if (!cat) return {};
  const assunto = cat.nome.toLowerCase();
  return {
    title: `${cat.nome}, com a fonte de cada afirmação`,
    description: `Tudo o que o ${SITE.nome} publicou sobre ${assunto}: ${cat.quantos} ${
      cat.quantos === 1 ? "publicação" : "publicações"
    }, cada uma com o documento que sustenta o que afirma.`,
    alternates: { canonical: `/categoria/${cat.slug}` },
    openGraph: {
      type: "website",
      title: `${cat.nome} no ${SITE.nome}`,
      description: `O que está confirmado sobre ${assunto}, e o que ainda não está.`,
      url: `${SITE.url}/categoria/${cat.slug}`,
    },
  };
}

export default function CategoriaPage({ params }: { params: { nome: string } }) {
  const cat = categorias().find((c) => c.slug === params.nome);
  if (!cat) notFound();

  const posts = postsDaCategoria(params.nome);

  return (
    <main>
      <Estruturado
        dados={migalhas([{ nome: cat.nome, caminho: `/categoria/${cat.slug}` }])}
      />

      <Faixa
        etiqueta="Assunto"
        titulo={cat.nome}
        abaixo={
          <>
            {posts.length} {posts.length === 1 ? "publicação" : "publicações"}, cada uma com
            o documento que sustenta o que afirma
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-5">
      <div className="flex max-w-leitura flex-col divide-y divide-risco py-6">
        {posts.map((post) => (
          <article key={post.slug} className="py-6 first:pt-0">
            <div className="flex flex-wrap items-center gap-3">
              <SeloConfianca confianca={post.confianca} />
              <span className="text-sm text-tinta-3">{formatarData(post.data)}</span>
            </div>
            <h2 className="mt-2 font-serif text-xl font-semibold leading-snug">
              <Link href={`/posts/${post.slug}`} className="hover:text-farol">
                {post.titulo}
              </Link>
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-tinta-2">{post.resumo}</p>
          </article>
        ))}
      </div>

      <div className="border-t border-risco py-8">
        <Link href="/" className="text-sm font-semibold text-farol underline underline-offset-2">
          Ver todas as publicações
        </Link>
      </div>
      </div>
    </main>
  );
}
