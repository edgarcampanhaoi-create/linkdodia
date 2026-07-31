import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * A saída da lista e as rotas de serviço ficam fora do índice.
 *
 * Página de baixa indexada faz alguém cair nela por busca sem nunca ter
 * assinado, e rota de serviço no índice é convite para robô bater nela.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/sair/", "/api/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
