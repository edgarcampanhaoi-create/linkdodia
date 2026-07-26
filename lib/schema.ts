import { SITE } from "@/lib/site";

/**
 * Dado estruturado, que é como o buscador entende o que a página é.
 *
 * Fica tudo aqui para que o formato seja um só, e para que dê para ler numa
 * tela o que a gente declara ao Google. Declaração errada custa caro: marcar
 * como artigo o que não é artigo, ou usar tipo de avaliação para o que não foi
 * avaliado, vira penalidade e não vantagem.
 *
 * Por isso a lista é curta e literal. Só o que a página realmente é.
 */

export function organizacao() {
  return {
    "@type": "Organization",
    name: SITE.nome,
    url: SITE.url,
    description: SITE.descricao,
  };
}

export function siteWeb() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.nome,
    url: SITE.url,
    inLanguage: "pt-BR",
    description: SITE.descricao,
    publisher: organizacao(),
  };
}

/**
 * Trilha de navegação.
 *
 * Serve para o resultado de busca mostrar o caminho em vez do endereço cru, e
 * ajuda o buscador a entender que assunto agrupa o quê. O primeiro item é
 * sempre a home.
 */
export function migalhas(itens: { nome: string; caminho: string }[]) {
  const todos = [{ nome: "Início", caminho: "/" }, ...itens];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todos.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: `${SITE.url}${item.caminho === "/" ? "" : item.caminho}`,
    })),
  };
}
