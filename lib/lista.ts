/**
 * A lista de e-mails.
 *
 * DECISÃO: não existe banco neste projeto, e não vamos criar um só pra guardar
 * endereço. E-mail que você não consegue *enviar* não vale nada — então a lista
 * nasce indo direto pra onde vai ser usada.
 *
 * Dois destinos, o que estiver configurado (nesta ordem):
 *
 *   1. `LISTA_WEBHOOK_URL` — um POST com JSON. Serve pra praticamente tudo:
 *      Buttondown, Zapier, Make, n8n, Apps Script de Planilha Google. Zero
 *      dependência e zero amarra de fornecedor.
 *   2. Redis da Vercel/Upstash — grava num conjunto (`SADD`), que já dedupe
 *      sozinho. Usa a API REST via `fetch`: sem SDK, sem pacote novo.
 *
 * Se NENHUM estiver configurado, `capturaLigada()` devolve false e o formulário
 * simplesmente não aparece no site. Prometer cadastro e jogar o endereço fora
 * seria pior que não ter formulário.
 *
 * Os nomes de variável são lidos em várias grafias porque a integração da
 * Vercel já mudou de nome mais de uma vez — mesma defesa que usamos pra
 * connection string no outro projeto. Ela mora em `lib/redis.ts`, que é onde o
 * resto do site também fala com o banco.
 */

import { bancoLigado, urlRedis, tokenRedis } from "@/lib/redis";

export type ResultadoInscricao =
  | { ok: true; jaEstava: boolean }
  | { ok: false; motivo: string };

export function capturaLigada(): boolean {
  return Boolean(process.env.LISTA_WEBHOOK_URL || bancoLigado());
}

/**
 * Validação de e-mail deliberadamente simples.
 *
 * Regex de e-mail "completa" é folclore: a especificação aceita coisas que
 * nenhum provedor usa, e toda regex esperta acaba recusando endereço válido de
 * gente real. O que importa aqui é barrar erro de digitação óbvio — quem
 * confirma de verdade é o e-mail de boas-vindas.
 */
export function normalizarEmail(bruto: unknown): string | null {
  if (typeof bruto !== "string") return null;
  const email = bruto.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(email)) return null;
  return email;
}

async function enviarAoWebhook(url: string, email: string, origem: string) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, origem, em: new Date().toISOString() }),
    // Se o destino demorar, é melhor falhar rápido e dizer que não deu do que
    // segurar a pessoa olhando um botão girando.
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`webhook respondeu ${r.status}`);
}

async function gravarNoRedis(email: string): Promise<boolean> {
  const base = urlRedis();
  const token = tokenRedis();
  if (!base || !token) throw new Error("redis não configurado");

  const r = await fetch(`${base}/sadd/lista:emails/${encodeURIComponent(email)}`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`redis respondeu ${r.status}`);

  // SADD devolve 1 quando entrou agora, 0 quando já existia.
  const corpo = (await r.json()) as { result?: number };
  return corpo.result === 0;
}

export async function inscrever(
  emailBruto: unknown,
  origem: string,
): Promise<ResultadoInscricao> {
  const email = normalizarEmail(emailBruto);
  if (!email) return { ok: false, motivo: "Esse e-mail não parece certo — confere?" };

  if (!capturaLigada()) {
    return { ok: false, motivo: "O cadastro está temporariamente fora do ar." };
  }

  try {
    const webhook = process.env.LISTA_WEBHOOK_URL;
    if (webhook) {
      await enviarAoWebhook(webhook, email, origem);
      return { ok: true, jaEstava: false };
    }
    const jaEstava = await gravarNoRedis(email);
    return { ok: true, jaEstava };
  } catch {
    // O motivo técnico fica no log do servidor; pra quem está lendo, o que
    // importa é que não foi culpa dela e que dá pra tentar de novo.
    return { ok: false, motivo: "Não consegui salvar agora. Tenta de novo em instantes?" };
  }
}
