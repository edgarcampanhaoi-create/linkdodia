import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categorias, postsDaCategoria, formatarData } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { SeloConfianca, Etiqueta } from "@/components/Selos";

export function generateStaticParams() {
  return categorias().map((c) => ({ nome: c.slug }));
}

export function generateMetadata({ params }: { params: { nome: string } }): Metadata {
  const cat = categorias().find((c) => c.slug === params.nome);
  if (!cat) return {};
  return {
    title: cat.nome,
    description: `Tudo o que o ${SITE.nome} publicou sobre ${cat.nome.toLowerCase()}, com a fonte de cada afirmação.`,
    alternates: { canonical: `/categoria/${cat.slug}` },
  };
}

export default function CategoriaPage({ params }: { params: { nome: string } }) {
  const cat = categorias().find((c) => c.slug === params.nome);
  if (!cat) notFound();

  const posts = postsDaCategoria(params.nome);

  return (
    <main className="mx-auto max-w-5xl px-5">
      <div className="border-b border-risco py-10">
        <Etiqueta>Assunto</Etiqueta>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight">
          {cat.nome}
        </h1>
        <p className="mt-2 text-tinta-2">
          {posts.length} {posts.length === 1 ? "publicação" : "publicações"}
        </p>
      </div>

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
    </main>
  );
}
