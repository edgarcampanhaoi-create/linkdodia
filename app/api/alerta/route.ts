import { rodarAlerta, enviarProva } from "@/lib/alerta-envio";
import { normalizarEmail } from "@/lib/lista";

/**
 * A rodada diária do alerta, chamada pelo cron da Vercel.
 *
 * Ela lê o que está publicado, compara com o registro do que já saiu e envia só
 * a diferença. É por isso que o horário não importa muito e que repetir a
 * chamada no mesmo dia não manda nada duas vezes: quem decide é o registro, e
 * não o relógio.
 *
 * `?ensaio=1` faz a rodada inteira sem enviar e sem gravar, e devolve o que
 * sairia. Conferir alerta em produção sem ensaio significa usar a caixa de
 * e-mail de gente real como ambiente de teste.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(pedido: Request) {
  const segredo = process.env.CRON_SECRET;

  // Sem segredo configurado a rota fica fechada. Aberta, ela seria um botão de
  // disparar e-mail para a lista inteira ao alcance de qualquer um.
  if (!segredo) {
    return Response.json(
      { erro: "CRON_SECRET não configurado. A rota fica fechada até existir segredo." },
      { status: 503 },
    );
  }

  if (pedido.headers.get("authorization") !== `Bearer ${segredo}`) {
    return Response.json({ erro: "não autorizado" }, { status: 401 });
  }

  const parametros = new URL(pedido.url).searchParams;
  const ensaio = parametros.get("ensaio") === "1";

  // `?prova=<endereço>` manda uma mensagem para um endereço só, sem mexer no
  // registro do que já saiu. É como se confere entrega de verdade sem usar a
  // lista como cobaia.
  const prova = parametros.get("prova");

  try {
    if (prova) {
      const email = normalizarEmail(prova);
      if (!email) return Response.json({ erro: "endereço de prova inválido" }, { status: 400 });
      const relatorio = await enviarProva(email);
      return Response.json(relatorio, { status: relatorio.erro ? 502 : 200 });
    }

    const relatorio = await rodarAlerta({ ensaio });
    return Response.json(relatorio, { status: relatorio.erro ? 502 : 200 });
  } catch (e) {
    return Response.json({ erro: (e as Error).message }, { status: 500 });
  }
}
