import { todosOsPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

/**
 * RSS. Num site de publicação diária, é o canal que não depende de algoritmo de
 * rede nenhuma — e o público deste site (gente que trabalha com marketing) é
 * justamente quem ainda usa leitor de feed.
 */

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const posts = todosOsPosts();

  const itens = posts
    .map(
      (p) => `    <item>
      <title>${escapar(p.titulo)}</title>
      <link>${SITE.url}/posts/${p.slug}</link>
      <guid isPermaLink="true">${SITE.url}/posts/${p.slug}</guid>
      <pubDate>${new Date(`${p.data}T12:00:00Z`).toUTCString()}</pubDate>
      <category>${escapar(p.categoria)}</category>
      <description>${escapar(p.resumo)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapar(SITE.nome)}</title>
    <link>${SITE.url}</link>
    <description>${escapar(SITE.descricao)}</description>
    <language>pt-BR</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
${itens}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
