import { sairDaLista } from "@/lib/saida";

/**
 * A saída em um clique, feita pelo próprio programa de e-mail.
 *
 * O cabeçalho `List-Unsubscribe-Post` de todo alerta aponta para cá, e é o que
 * faz o Gmail mostrar o botão de cancelar inscrição ao lado do remetente. Quem
 * clica ali nunca chega ao site, e é o caminho que mais gente usa.
 *
 * Só POST de propósito. Programa de e-mail e antivírus abrem os links de uma
 * mensagem por conta própria para checar se são seguros, e uma saída por GET
 * tiraria da lista quem nunca pediu para sair.
 */

export const dynamic = "force-dynamic";

export async function POST(pedido: Request) {
  const ficha = new URL(pedido.url).searchParams.get("t") ?? "";

  try {
    const r = await sairDaLista(ficha);
    if (!r.ok) return Response.json({ erro: "ficha desconhecida" }, { status: 404 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ erro: "não deu para processar agora" }, { status: 500 });
  }
}
