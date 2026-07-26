import Link from "next/link";
import { todosOsPosts } from "@/lib/posts";
import { Etiqueta } from "@/components/Selos";

/**
 * A 404 padrão do Next é em inglês e sem a nossa cara. Quem cai aqui costuma ter
 * vindo de um link antigo ou de busca, então a página oferece saída em vez de
 * pedir desculpa: as publicações mais recentes ficam logo abaixo.
 */
export default function NaoEncontrada() {
  const recentes = todosOsPosts().slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-5">
      <div className="max-w-leitura py-12">
        <Etiqueta>Página não encontrada</Etiqueta>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight">
          Esse endereço não existe por aqui
        </h1>
        <p className="mt-3 leading-relaxed text-tinta-2">
          Pode ser um link antigo ou um endereço digitado torto. As publicações mais
          recentes estão logo abaixo, e a{" "}
          <Link href="/" className="text-farol underline underline-offset-2">
            página inicial
          </Link>{" "}
          tem tudo.
        </p>
      </div>

      {recentes.length > 0 && (
        <div className="grid gap-6 border-t border-risco py-10 sm:grid-cols-2">
          {recentes.map((p) => (
            <Link
              key={p.slug}
              href={`/posts/${p.slug}`}
              className="group rounded-xl border border-risco bg-papel-alto p-4"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-3">
                {p.categoria}
              </p>
              <p className="mt-1.5 font-serif text-lg font-semibold leading-snug group-hover:text-farol">
                {p.titulo}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
