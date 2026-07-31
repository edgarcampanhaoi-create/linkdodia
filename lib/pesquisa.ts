import { validarResposta, agregar, type Resposta, type Agregado } from "@/lib/pesquisa-perguntas";
import { bancoLigado, comando } from "@/lib/redis";

/**
 * Onde as respostas da pesquisa ficam.
 *
 * Mesmo Redis da lista de e-mails, chave separada. Cada resposta é uma linha
 * numa lista, com a data e nada mais. Sem IP, sem identificador de navegador,
 * sem cruzamento com o e-mail de quem está na lista. Quem responde e quem entra
 * na lista são dois atos separados no site, e continuam separados no banco.
 *
 * A escolha por lista, e não por conjunto, é de propósito: respostas iguais são
 * respostas diferentes de pessoas diferentes, e um conjunto apagaria a segunda.
 */

const CHAVE = "pesquisa:respostas";

/** Teto de leitura. Muito acima do que a amostra vai ter, e evita puxar o mundo. */
const LIMITE = 5000;

export function pesquisaLigada(): boolean {
  return bancoLigado();
}

export async function guardarResposta(bruto: Record<string, unknown>): Promise<boolean> {
  const limpa = validarResposta(bruto);
  if (!limpa) return false;

  await comando(["LPUSH", CHAVE, JSON.stringify({ ...limpa, em: new Date().toISOString() })]);
  return true;
}

async function lerRespostas(): Promise<Resposta[]> {
  const bruto = await comando(["LRANGE", CHAVE, 0, LIMITE - 1]);
  if (!Array.isArray(bruto)) return [];

  return bruto
    .map((linha) => {
      try {
        return JSON.parse(String(linha)) as Resposta;
      } catch {
        // Linha corrompida não derruba a conta inteira. Ela sai da amostra, e o
        // n publicado continua sendo o número de respostas que a gente leu.
        return null;
      }
    })
    .filter((r): r is Resposta => r !== null);
}

/** O resultado pronto para a página. Devolve `null` quando não há banco. */
export async function resultadoDaPesquisa(): Promise<Agregado | null> {
  if (!pesquisaLigada()) return null;
  try {
    return agregar(await lerRespostas());
  } catch {
    // Banco fora do ar não pode derrubar a página de benchmarks, que é
    // estática e vale por si.
    return null;
  }
}
