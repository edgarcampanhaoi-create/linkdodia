import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { todosOsPosts, postPorSlug, formatarData, ROTULO_CONFIANCA } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { capturaLigada } from "@/lib/lista";
import { SeloConfianca, Etiqueta } from "@/components/Selos";
import { Inscrever } from "@/components/Inscrever";

/** Todos os posts são estáticos: o conteúdo mora no repositório e só muda com
 *  deploy. Página gerada no build = rápida e barata. */
export function generateStaticParams() {
  return todosOsPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = postPorSlug(params.slug);
  if (!post) return {};
  return {
    title: post.titulo,
    description: post.resumo,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.titulo,
      description: post.resumo,
      url: `${SITE.url}/posts/${post.slug}`,
      publishedTime: post.data,
      tags: post.tags,
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = postPorSlug(params.slug);
  if (!post) notFound();

  const outros = todosOsPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // Dado estruturado: é assim que o Google entende que isto é um artigo com
  // data e autor, e é barato de fazer certo.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.resumo,
    datePublished: post.data,
    dateModified: post.data,
    inLanguage: "pt-BR",
    publisher: { "@type": "Organization", name: SITE.nome },
    mainEntityOfPage: `${SITE.url}/posts/${post.slug}`,
  };

  return (
    <main className="mx-auto max-w-5xl px-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Etiqueta>{post.categoria}</Etiqueta>
          <SeloConfianca confianca={post.confianca} />
        </div>

        <h1 className="mt-3 max-w-leitura font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-[38px]">
          {post.titulo}
        </h1>

        <p className="mt-4 max-w-leitura text-lg leading-relaxed text-tinta-2">
          {post.resumo}
        </p>

        <p className="mt-4 text-sm text-tinta-3">
          {formatarData(post.data)} · {post.minutos} min de leitura
        </p>

        {/* O veredito de confiança vem ANTES do texto, não escondido no fim:
            quem lê tem direito de saber o peso do que vai ler. */}
        <div className="mt-8 max-w-leitura rounded-xl border border-risco bg-papel-fundo p-4">
          <Etiqueta>{ROTULO_CONFIANCA[post.confianca].rotulo}</Etiqueta>
          <p className="mt-1.5 text-sm leading-relaxed text-tinta-2">
            {ROTULO_CONFIANCA[post.confianca].explica}
          </p>
          {post.ressalva && (
            <p className="mt-2 text-sm leading-relaxed text-brasa">{post.ressalva}</p>
          )}
        </div>

        <div
          className="prosa mt-10 max-w-leitura"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {capturaLigada() && (
          <div className="mt-12 max-w-leitura">
            <Inscrever
              origem={`post-${post.slug}`}
              titulo="Recebe o próximo por e-mail"
              texto="Uma publicação por dia sobre o que está funcionando — sempre com a fonte junto."
            />
          </div>
        )}

        {post.fontes.length > 0 && (
          <section className="mt-12 max-w-leitura border-t border-risco pt-6">
            <Etiqueta>Fontes</Etiqueta>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-tinta-2">
              {post.fontes.map((f, i) => (
                <li key={i}>
                  {f.url ? (
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-farol underline underline-offset-2"
                    >
                      {f.texto}
                    </a>
                  ) : (
                    f.texto
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {outros.length > 0 && (
        <section className="border-t border-risco py-10">
          <Etiqueta>Continue</Etiqueta>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {outros.map((o) => (
              <Link
                key={o.slug}
                href={`/posts/${o.slug}`}
                className="group rounded-xl border border-risco bg-papel-alto p-4"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-3">
                  {o.categoria}
                </p>
                <p className="mt-1.5 font-serif text-base font-semibold leading-snug group-hover:text-farol">
                  {o.titulo}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
