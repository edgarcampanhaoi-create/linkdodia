import Link from "next/link";
import { todosOsPosts, categorias, formatarData } from "@/lib/posts";
import { todosOsNumeros } from "@/lib/numeros";
import { todasAsMudancas } from "@/lib/mudancas";
import { SITE } from "@/lib/site";
import { siteWeb } from "@/lib/schema";
import { capturaLigada } from "@/lib/lista";
import { SeloConfianca, Etiqueta } from "@/components/Selos";
import { Estruturado } from "@/components/Estruturado";
import { Inscrever } from "@/components/Inscrever";

/**
 * A faixa escura do topo.
 *
 * Ela existe por medição, e não por gosto. Abrimos os quatro sites que ranqueiam
 * nos nossos termos e contamos: 56, 24, 17 e 7 elementos com gradiente,
 * vocabulário de venda em todos os quatro, botão de WhatsApp em três. E os
 * quatro abrem com promessa de benefício, do tipo "venda com lucro".
 *
 * Nenhum abre com um número e a fonte dele. É esse o espaço vazio, e é nele que
 * a gente entra: quem chega vê um dado duro e o artigo do contrato ao lado,
 * antes de qualquer adjetivo.
 */
export default function Home() {
  const posts = todosOsPosts();
  const [destaque, ...resto] = posts;
  const cats = categorias();
  const lista = capturaLigada();

  const numeros = todosOsNumeros();
  const [numeroDestaque, ...outrosNumeros] = numeros;
  const mudancas = todasAsMudancas();

  return (
    <main>
      <Estruturado dados={siteWeb()} />

      <section className="bg-carvao text-papel">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
          {/* Três células, e não duas, por causa do celular.

              Medido em 31 de julho, num quadro de 375: com a coluna de texto
              inteira numa célula só, o cartão do número caía em 656 pixels, e a
              tela útil de um telefone acaba perto de 700. Ou seja, quem chegava
              pelo celular lia 616 pixels de adjetivo antes de ver um dado, que é
              o oposto do que este site diz fazer.

              Separando parágrafo e botões numa terceira célula, a ordem no
              telefone vira manchete, número, e depois o resto. No computador o
              `md:row-span-2` devolve o desenho de sempre: texto à esquerda
              ocupando as duas linhas, cartão à direita. */}
          <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,20rem)] md:gap-x-10 md:gap-y-5">
            <div className="entra">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-fumaca">
                Publicação independente
              </p>

              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
                O que está funcionando em marketing digital e marketplaces,{" "}
                <em className="italic text-fumaca">com a fonte na mesa</em>.
              </h1>
            </div>

            <div className="entra order-last md:order-none">
              <p className="max-w-leitura text-[15px] leading-relaxed text-fumaca">
                Todo número aqui vem com o documento que o sustenta, com artigo e data. O que
                não deu para confirmar aparece escrito como não confirmado.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/benchmarks"
                  className="rounded-lg bg-papel px-5 py-3 text-sm font-semibold text-carvao transition hover:bg-white"
                >
                  Ver os {numeros.length} números
                </Link>
                <Link
                  href="/pesquisa"
                  className="rounded-lg border border-fumaca/40 px-5 py-3 text-sm font-semibold text-papel transition hover:border-farol-alto hover:text-farol-alto"
                >
                  Responder a pesquisa
                </Link>
              </div>
            </div>

            {numeroDestaque && (
              <Link
                href={`/posts/${numeroDestaque.post}`}
                className="entra entra-2 group block rounded-2xl bg-carvao-2 p-6 transition hover:bg-[#2c2723] md:col-start-2 md:row-start-1 md:row-span-2 md:self-center"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-fumaca">
                  O número
                </p>
                <p className="mt-3 font-serif text-6xl font-semibold leading-none tracking-tight tabular-nums sm:text-7xl">
                  {numeroDestaque.valor}
                </p>
                <p className="mt-4 text-[15px] leading-snug group-hover:text-farol-alto">
                  {numeroDestaque.titulo}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-fumaca">
                  {numeroDestaque.fonte}
                  {numeroDestaque.dataDe === "consulta"
                    ? `, conferida em ${formatarData(numeroDestaque.desde)}`
                    : `, de ${formatarData(numeroDestaque.desde)}`}
                </p>
              </Link>
            )}
          </div>

          {outrosNumeros.length > 0 && (
            <div className="entra entra-3 mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-carvao-2 pt-6">
              {outrosNumeros.map((n) => (
                <Link
                  key={n.id}
                  href={`/benchmarks#${n.id}`}
                  className="group flex items-baseline gap-2"
                >
                  <span className="font-serif text-lg font-semibold tabular-nums group-hover:text-farol-alto">
                    {n.valor}
                  </span>
                  <span className="text-xs text-fumaca">{n.curto}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5">
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

                <div className="rounded-xl border border-risco bg-papel-alto p-5">
                  <Etiqueta>O que mudou</Etiqueta>
                  <p className="mt-2 font-serif text-lg font-semibold leading-snug">
                    O registro datado de mudança de regra
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-tinta-2">
                    {mudancas.length} mudanças da Shopee, do Instagram e da Meta, cada uma com o
                    documento e o que ela quebra. Regra substituída fica no ar, marcada.
                  </p>
                  <Link
                    href="/mudancas"
                    className="mt-3 inline-block text-sm font-semibold text-farol underline underline-offset-2"
                  >
                    Ver a linha do tempo
                  </Link>
                </div>

                <div className="rounded-xl border border-risco bg-papel-alto p-5">
                  <Etiqueta>A pesquisa</Etiqueta>
                  <p className="mt-2 font-serif text-lg font-semibold leading-snug">
                    Quanto um afiliado recebe por mês?
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-tinta-2">
                    Sete perguntas de faixa, dois minutos, sem nome e sem e-mail. O resultado
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
      </div>
    </main>
  );
}
