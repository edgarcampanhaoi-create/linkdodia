/**
 * O acesso ao Redis, num lugar só.
 *
 * A lista de e-mails e a pesquisa nasceram cada uma com a sua cópia destas
 * funções, e o alerta seria a terceira. Três cópias do mesmo `fetch` é como se
 * perde a defesa que está escrita numa delas: os nomes de variável são lidos em
 * várias grafias porque a integração da Vercel já mudou de nome mais de uma vez,
 * e essa defesa precisa valer para quem chegar depois.
 *
 * Sem SDK e sem pacote novo: a API REST da Upstash aceita o comando como lista
 * de strings num POST, que é tudo que este projeto precisa.
 */

export function urlRedis(): string | null {
  return process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || null;
}

export function tokenRedis(): string | null {
  return process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || null;
}

export function bancoLigado(): boolean {
  return Boolean(urlRedis() && tokenRedis());
}

/** Roda um comando e devolve o `result` cru. Quem chama interpreta. */
export async function comando(partes: (string | number)[]): Promise<unknown> {
  const base = urlRedis();
  const token = tokenRedis();
  if (!base || !token) throw new Error("redis não configurado");

  const r = await fetch(base, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(partes.map(String)),
    cache: "no-store",
    // Se o banco demorar, é melhor falhar rápido e dizer que não deu do que
    // segurar alguém olhando um botão girando.
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`redis respondeu ${r.status}`);

  const corpo = (await r.json()) as { result?: unknown };
  return corpo.result;
}

/** Lista de strings, para os comandos que devolvem conjunto. */
export async function comandoLista(partes: (string | number)[]): Promise<string[]> {
  const bruto = await comando(partes);
  return Array.isArray(bruto) ? bruto.map(String) : [];
}
