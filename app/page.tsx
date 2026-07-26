import Link from "next/link";
import { todosOsPosts, categorias, formatarData } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { capturaLigada } from "@/lib/lista";
import { SeloConfianca, Etiqueta } from "@/components/Selos";
import { Inscrever } from "@/components/Inscrever";

export default function Home() {
  const posts = todosOsPosts();
  const [destaque, ...resto] = posts;
  const cats = categorias();
  // Sem destino configurado, o formulário nem aparece. Ver lib/lista.ts.
  const lista = capturaLigada();

  return (
    <main className="mx-auto max-w-5xl px-5">
      <section className="border-b border-risco py-10">
        <h1 className="max-w-leitura font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          O que está funcionando em marketing digital e marketplaces,{" "}
          <em className="italic text-tinta-2">com a fonte na mesa</em>.
        </h1>
        <p className="mt-4 max-w-leitura text-base leading-relaxed text-tinta-2">
          {SITE.descricao}
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="py-16 text-tinta-2">Nada publicado ainda.</p>
      ) : (
        <>
          <article className="border-b border-risco py-10">
            <div className="flex flex-wrap items-center gap-3">
              <Etiqueta>Publicação mais recente</Etiqueta>
              <SeloConfianca confianca={destaque.confianca} />
            </div>
            <h2 className="mt-3 max-w-leitura font-serif text-2xl font-semibold leading-snug tracking-tight sm:text-[28px]">
              <Link href={`/posts/${destaque.slug}`} className="hover:text-farol">
                {destaque.titulo}
              </Link>
            </h2>
            <p className="mt-3 max-w-leitura leading-relaxed text-tinta-2">
              {destaque.resumo}
            </p>
            <p className="mt-4 text-sm text-tinta-3">
              {formatarData(destaque.data)} · {destaque.categoria} · {destaque.minutos} min
              de leitura
            </p>
          </article>

          <div className="grid gap-x-10 py-10 md:grid-cols-[1fr_220px]">
            <div className="flex flex-col divide-y divide-risco">
              {resto.map((post) => (
                <article key={post.slug} className="py-6 first:pt-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <Etiqueta>{post.categoria}</Etiqueta>
                    <SeloConfianca confianca={post.confianca} />
                  </div>
                  <h3 className="mt-2 max-w-leitura font-serif text-xl font-semibold leading-snug">
                    <Link href={`/posts/${post.slug}`} className="hover:text-farol">
                      {post.titulo}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-leitura text-[15px] leading-relaxed text-tinta-2">
                    {post.resumo}
                  </p>
                  <p className="mt-3 text-sm text-tinta-3">
                    {formatarData(post.data)} · {post.minutos} min
                  </p>
                </article>
              ))}
            </div>

            <aside className="mt-10 flex flex-col gap-4 md:mt-0">
              {lista && <Inscrever origem="home-lateral" />}

              <div className="rounded-xl border border-farol/25 bg-farol-claro p-5">
                <Etiqueta>Referência</Etiqueta>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug">
                  Os números, com o documento de cada um
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-2">
                  A página de consulta: o que está conferido, o que ainda não dá para
                  afirmar e a conta que diz onde você está.
                </p>
                <Link
                  href="/benchmarks"
                  className="mt-3 inline-block text-sm font-semibold text-farol underline underline-offset-2"
                >
                  Ver os benchmarks
                </Link>
              </div>

              <div className="rounded-xl border border-risco bg-papel-alto p-5">
                <Etiqueta>A pesquisa</Etiqueta>
                <p className="mt-2 font-serif text-lg font-semibold leading-snug">
                  Quanto um afiliado tira de verdade?
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-2">
                  Seis perguntas de faixa, dois minutos, sem nome e sem e-mail. O resultado
                  volta público para todo mundo.
                </p>
                <Link
                  href="/pesquisa"
                  className="mt-3 inline-block text-sm font-semibold text-farol underline underline-offset-2"
                >
                  Responder
                </Link>
              </div>

              <div className="rounded-xl border border-risco bg-papel-alto p-5">
                <Etiqueta>Assuntos</Etiqueta>
                <ul className="mt-3 flex flex-col gap-2 text-sm">
                  {cats.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/categoria/${c.slug}`}
                        className="flex justify-between gap-3 text-tinta-2 hover:text-farol"
                      >
                        <span>{c.nome}</span>
                        <span className="tabular-nums text-tinta-3">{c.quantos}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-risco bg-papel-fundo p-5">
                <Etiqueta>Como lemos</Etiqueta>
                <p className="mt-2 text-sm leading-relaxed text-tinta-2">{SITE.promessa}</p>
                <Link
                  href="/sobre"
                  className="mt-3 inline-block text-sm font-semibold text-farol underline underline-offset-2"
                >
                  O método
                </Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
