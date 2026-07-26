import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

/**
 * O conteúdo mora em Markdown no repositório (`conteudo/posts/*.md`), não em
 * banco nem em CMS.
 *
 * Por quê: publicar vira `commit` — o texto fica versionado, revisável e com
 * histórico de quem mudou o quê, que é exatamente o que um site que se vende
 * como referência precisa poder provar. Sem banco não há o que cair, o site é
 * estático e carrega rápido, e o custo de infraestrutura é zero. Quando alguém
 * de fora precisar publicar sem mexer em git, aí entra um CMS por cima destes
 * mesmos arquivos — não antes.
 */

const DIRETORIO = path.join(process.cwd(), "conteudo", "posts");

/** Quão firme é o que o post afirma. Aparece na página: é o diferencial. */
export type Confianca = "verificado" | "parcial" | "nao-confirmado";

export type Fonte = {
  texto: string;
  url?: string;
};

export type Post = {
  slug: string;
  titulo: string;
  resumo: string;
  /** ISO: aaaa-mm-dd */
  data: string;
  categoria: string;
  tags: string[];
  fontes: Fonte[];
  confianca: Confianca;
  /** Frase curta que explica o veredito de confiança daquele post. */
  ressalva?: string;
  html: string;
  minutos: number;
};

export type PostResumido = Omit<Post, "html">;

const md = new MarkdownIt({
  // O conteúdo é nosso e passa por revisão em git, mas HTML solto no Markdown é
  // porta aberta pra erro bobo virar problema. Fica desligado.
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
});

// Link externo abre em nova aba e não passa autoridade a quem a gente cita
// apenas como referência.
const renderLinkAbrir =
  md.renderer.rules.link_open ??
  ((tokens, i, options, _env, self) => self.renderToken(tokens, i, options));

md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  const href = tokens[i].attrGet("href") ?? "";
  if (/^https?:\/\//i.test(href)) {
    tokens[i].attrSet("target", "_blank");
    tokens[i].attrSet("rel", "noopener noreferrer");
  }
  return renderLinkAbrir(tokens, i, options, env, self);
};

function minutosDeLeitura(texto: string): number {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palavras / 200));
}

function normalizarFontes(bruto: unknown): Fonte[] {
  if (!Array.isArray(bruto)) return [];
  return bruto
    .map((f) => {
      if (typeof f === "string") return { texto: f };
      const o = f as Record<string, unknown>;
      const texto = typeof o.texto === "string" ? o.texto : null;
      if (!texto) return null;
      const url = typeof o.url === "string" && o.url ? o.url : undefined;
      return { texto, url };
    })
    .filter((f): f is Fonte => f !== null);
}

function lerArquivo(arquivo: string): Post | null {
  const bruto = fs.readFileSync(path.join(DIRETORIO, arquivo), "utf8");
  const { data, content } = matter(bruto);

  // Rascunho não vai pro ar. Some da listagem, do sitemap e do RSS.
  if (data.rascunho === true) return null;

  const slug = arquivo.replace(/\.mdx?$/, "");
  const dataPost = data.data instanceof Date
    ? data.data.toISOString().slice(0, 10)
    : String(data.data ?? "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataPost)) {
    throw new Error(`Post "${arquivo}" está sem data válida (aaaa-mm-dd) no cabeçalho.`);
  }
  if (!data.titulo) throw new Error(`Post "${arquivo}" está sem título.`);

  return {
    slug,
    titulo: String(data.titulo),
    resumo: String(data.resumo ?? ""),
    data: dataPost,
    categoria: String(data.categoria ?? "Geral"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    fontes: normalizarFontes(data.fontes),
    confianca: (["verificado", "parcial", "nao-confirmado"] as const).includes(data.confianca)
      ? data.confianca
      : "parcial",
    ressalva: data.ressalva ? String(data.ressalva) : undefined,
    html: md.render(content),
    minutos: minutosDeLeitura(content),
  };
}

/** Todos os posts publicados, do mais novo pro mais antigo. */
export function todosOsPosts(): Post[] {
  if (!fs.existsSync(DIRETORIO)) return [];
  return fs
    .readdirSync(DIRETORIO)
    .filter((a) => /\.mdx?$/.test(a))
    .map(lerArquivo)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export function postPorSlug(slug: string): Post | null {
  return todosOsPosts().find((p) => p.slug === slug) ?? null;
}

/** "Afiliados" vira "afiliados"; "Automação" vira "automacao". */
export function slugCategoria(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function categorias(): { nome: string; slug: string; quantos: number }[] {
  const conta = new Map<string, number>();
  for (const p of todosOsPosts()) conta.set(p.categoria, (conta.get(p.categoria) ?? 0) + 1);
  return Array.from(conta.entries())
    .map(([nome, quantos]) => ({ nome, slug: slugCategoria(nome), quantos }))
    .sort((a, b) => b.quantos - a.quantos);
}

export function postsDaCategoria(slug: string): Post[] {
  return todosOsPosts().filter((p) => slugCategoria(p.categoria) === slug);
}

const DATA_BR = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatarData(iso: string): string {
  return DATA_BR.format(new Date(`${iso}T12:00:00Z`));
}

export const ROTULO_CONFIANCA: Record<Confianca, { rotulo: string; explica: string }> = {
  verificado: {
    rotulo: "Verificado na fonte",
    explica: "Cada afirmação deste texto foi conferida no documento oficial citado abaixo.",
  },
  parcial: {
    rotulo: "Parcialmente verificado",
    explica:
      "Parte do que está aqui vem de fonte oficial e parte de observação de campo. O texto diz qual é qual.",
  },
  "nao-confirmado": {
    rotulo: "Não confirmado",
    explica:
      "Não encontramos fonte primária para o ponto central. Está publicado como hipótese, marcada como tal.",
  },
};
