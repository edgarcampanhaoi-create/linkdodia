import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { todosOsPosts, type Confianca } from "@/lib/posts";

/**
 * Os números da página de benchmarks.
 *
 * Ficam num arquivo só, `conteudo/benchmarks.md`, e não espalhados em código:
 * quem escreve a página é quem apura, e apurar não deveria exigir mexer em
 * componente. O formato é cabeçalho YAML porque a lista é tabela, não texto
 * corrido.
 *
 * A validação abaixo é severa de propósito. Um site que se vende como
 * referência não pode publicar número sem fonte, sem data ou apontando para
 * post que não existe. Quando algo assim aparece, o build quebra e o erro diz o
 * arquivo, o item e o que falta. Publicar errado é pior que não publicar.
 */

const ARQUIVO = path.join(process.cwd(), "conteudo", "benchmarks.md");

export type Numero = {
  id: string;
  /** O dado em si, curto o bastante para caber num cartão. */
  valor: string;
  titulo: string;
  oQueE: string;
  oQueFazer: string;
  categoria: string;
  confianca: Confianca;
  /** Nome do documento, com artigo quando existe. */
  fonte: string;
  fonteUrl?: string;
  /** ISO aaaa-mm-dd: a data do documento, não a da publicação nossa. */
  desde: string;
  /** Slug do post que explica. Precisa existir. */
  post: string;
};

export type Lacuna = {
  pergunta: string;
  porque: string;
  post: string;
};

const CONFIANCAS = ["verificado", "parcial", "nao-confirmado"] as const;

function texto(bruto: unknown, campo: string, onde: string): string {
  const v = typeof bruto === "string" ? bruto.trim() : "";
  if (!v) throw new Error(`benchmarks.md: ${onde} está sem "${campo}".`);
  return v;
}

function lerArquivo(): { numeros: Numero[]; lacunas: Lacuna[] } {
  if (!fs.existsSync(ARQUIVO)) return { numeros: [], lacunas: [] };

  const { data } = matter(fs.readFileSync(ARQUIVO, "utf8"));
  const slugsPublicados = new Set(todosOsPosts().map((p) => p.slug));

  const brutos = Array.isArray(data.numeros) ? data.numeros : [];
  const numeros = brutos.map((b: Record<string, unknown>, i: number) => {
    const onde = `número ${i + 1}${b?.id ? ` ("${String(b.id)}")` : ""}`;

    const desde = b.desde instanceof Date
      ? b.desde.toISOString().slice(0, 10)
      : String(b.desde ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(desde)) {
      throw new Error(`benchmarks.md: ${onde} está sem data válida em "desde" (aaaa-mm-dd).`);
    }

    const confianca = String(b.confianca ?? "");
    if (!CONFIANCAS.includes(confianca as Confianca)) {
      throw new Error(
        `benchmarks.md: ${onde} tem confiança "${confianca}", que não existe. Use ${CONFIANCAS.join(", ")}.`,
      );
    }

    const post = texto(b.post, "post", onde);
    if (!slugsPublicados.has(post)) {
      throw new Error(
        `benchmarks.md: ${onde} aponta para o post "${post}", que não está publicado. Número sem texto que explique não vai ao ar.`,
      );
    }

    return {
      id: texto(b.id, "id", onde),
      valor: texto(b.valor, "valor", onde),
      titulo: texto(b.titulo, "titulo", onde),
      oQueE: texto(b.oQueE, "oQueE", onde),
      oQueFazer: texto(b.oQueFazer, "oQueFazer", onde),
      categoria: texto(b.categoria, "categoria", onde),
      confianca: confianca as Confianca,
      fonte: texto(b.fonte, "fonte", onde),
      fonteUrl: typeof b.fonteUrl === "string" && b.fonteUrl ? b.fonteUrl : undefined,
      desde,
      post,
    };
  });

  const idsRepetidos = numeros
    .map((n) => n.id)
    .filter((id, i, todos) => todos.indexOf(id) !== i);
  if (idsRepetidos.length > 0) {
    throw new Error(`benchmarks.md: id repetido (${idsRepetidos.join(", ")}).`);
  }

  const lacunasBrutas = Array.isArray(data.lacunas) ? data.lacunas : [];
  const lacunas = lacunasBrutas.map((b: Record<string, unknown>, i: number) => {
    const onde = `lacuna ${i + 1}`;
    const post = texto(b.post, "post", onde);
    if (!slugsPublicados.has(post)) {
      throw new Error(`benchmarks.md: ${onde} aponta para o post "${post}", que não está publicado.`);
    }
    return {
      pergunta: texto(b.pergunta, "pergunta", onde),
      porque: texto(b.porque, "porque", onde),
      post,
    };
  });

  return { numeros, lacunas };
}

export function todosOsNumeros(): Numero[] {
  return lerArquivo().numeros;
}

export function todasAsLacunas(): Lacuna[] {
  return lerArquivo().lacunas;
}

/** Agrupa para a página, preservando a ordem em que os números foram escritos. */
export function numerosPorCategoria(): { categoria: string; numeros: Numero[] }[] {
  const grupos: { categoria: string; numeros: Numero[] }[] = [];
  for (const n of todosOsNumeros()) {
    const grupo = grupos.find((g) => g.categoria === n.categoria);
    if (grupo) grupo.numeros.push(n);
    else grupos.push({ categoria: n.categoria, numeros: [n] });
  }
  return grupos;
}

/** A data do documento mais recente da lista. Serve de "atualizado em". */
export function atualizadoEm(): string | null {
  const datas = todosOsNumeros().map((n) => n.desde).sort();
  return datas.length > 0 ? datas[datas.length - 1] : null;
}
