import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { todosOsPosts, type Confianca } from "@/lib/posts";

/**
 * O registro de mudanças de regra de plataforma.
 *
 * Nasceu de um erro. Em 30 de julho de 2026 este site publicou o critério da
 * política de originalidade do Instagram citando o documento de 2024, que já
 * tinha sido substituído. O erro não foi de leitura: foi de não existir, em
 * lugar nenhum em português, um lugar que dissesse quando cada regra mudou.
 * Ninguém mantém esse registro para quem vive de afiliado no Brasil, e por isso
 * o mercado inteiro segue citando versão vencida.
 *
 * Mesma arquitetura de `lib/numeros.ts`, e pelo mesmo motivo: os dados moram em
 * `conteudo/mudancas.md`, para que registrar mudança não exija mexer em
 * componente. A validação abaixo quebra o build, porque entrada sem data ou sem
 * documento transforma o registro naquilo que ele existe para corrigir.
 */

const ARQUIVO = path.join(process.cwd(), "conteudo", "mudancas.md");

export type Mudanca = {
  id: string;
  /** ISO aaaa-mm-dd: a data em que a regra mudou, segundo o documento. */
  data: string;
  /** "Instagram", "Shopee", "Shopee e Meta". Como aparece na etiqueta. */
  plataforma: string;
  titulo: string;
  oQueMudou: string;
  /** O que a mudança quebra na prática de quem opera. É por isso que a página existe. */
  oQueQuebra: string;
  confianca: Confianca;
  fonte: string;
  fonteUrl?: string;
  /**
   * Id da entrada que substituiu esta regra.
   *
   * A entrada vencida não sai do ar. Ela fica apontando para a que vale, porque
   * quem chega procurando "dez reposts em 30 dias" precisa achar exatamente
   * isso, e ser levado dali para a regra atual. Apagar seria repetir, do outro
   * lado, o erro que criou esta página.
   */
  substituidaPor?: string;
  /** Data da entrada que substituiu, resolvida na leitura. */
  substituidaEm?: string;
  /**
   * Slug do post que explica. Opcional de propósito.
   *
   * Registrar a mudança no dia em que ela acontece vale mais que esperar o texto
   * ficar pronto: a velocidade é metade do valor deste registro. Quando o slug
   * existe, ele precisa apontar para post publicado, como no resto do site.
   */
  post?: string;
  tituloDoPost?: string;
};

const CONFIANCAS = ["verificado", "parcial", "nao-confirmado"] as const;

function texto(bruto: unknown, campo: string, onde: string): string {
  const v = typeof bruto === "string" ? bruto.trim() : "";
  if (!v) throw new Error(`mudancas.md: ${onde} está sem "${campo}".`);
  return v;
}

/** Aceita data escrita com e sem aspas: sem aspas, o YAML já devolve Date. */
function dataIso(bruto: unknown, onde: string): string {
  const v = bruto instanceof Date ? bruto.toISOString().slice(0, 10) : String(bruto ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    throw new Error(`mudancas.md: ${onde} está sem data válida em "data" (aaaa-mm-dd).`);
  }
  return v;
}

function lerArquivo(): Mudanca[] {
  if (!fs.existsSync(ARQUIVO)) return [];

  const { data } = matter(fs.readFileSync(ARQUIVO, "utf8"));
  const publicados = new Map(todosOsPosts().map((p) => [p.slug, p.titulo]));

  const brutas = Array.isArray(data.mudancas) ? data.mudancas : [];
  const mudancas: Mudanca[] = brutas.map((b: Record<string, unknown>, i: number) => {
    const onde = `mudança ${i + 1}${b?.id ? ` ("${String(b.id)}")` : ""}`;

    const confianca = String(b.confianca ?? "");
    if (!CONFIANCAS.includes(confianca as Confianca)) {
      throw new Error(
        `mudancas.md: ${onde} tem confiança "${confianca}", que não existe. Use ${CONFIANCAS.join(", ")}.`,
      );
    }

    const post = typeof b.post === "string" && b.post.trim() ? b.post.trim() : undefined;
    if (post && !publicados.has(post)) {
      throw new Error(
        `mudancas.md: ${onde} aponta para o post "${post}", que não está publicado. Deixe o campo de fora até o texto existir.`,
      );
    }

    return {
      id: texto(b.id, "id", onde),
      data: dataIso(b.data, onde),
      plataforma: texto(b.plataforma, "plataforma", onde),
      titulo: texto(b.titulo, "titulo", onde),
      oQueMudou: texto(b.oQueMudou, "oQueMudou", onde),
      oQueQuebra: texto(b.oQueQuebra, "oQueQuebra", onde),
      confianca: confianca as Confianca,
      // A página emenda a fonte com ", de tal data" e com "Explicado em", então
      // ponto final aqui vira ponto duplo na tela. Tirar na leitura poupa quem
      // registrar a próxima mudança de lembrar dessa regra.
      fonte: texto(b.fonte, "fonte", onde).replace(/\.$/, ""),
      fonteUrl: typeof b.fonteUrl === "string" && b.fonteUrl ? b.fonteUrl : undefined,
      substituidaPor:
        typeof b.substituidaPor === "string" && b.substituidaPor
          ? b.substituidaPor.trim()
          : undefined,
      post,
      tituloDoPost: post ? publicados.get(post) : undefined,
    };
  });

  const repetidos = mudancas.map((m) => m.id).filter((id, i, todos) => todos.indexOf(id) !== i);
  if (repetidos.length > 0) {
    throw new Error(`mudancas.md: id repetido (${repetidos.join(", ")}).`);
  }

  // A corrente de substituição precisa fechar. Entrada vencida apontando para
  // id inexistente, ou para uma regra anterior a ela, faria a página afirmar
  // uma cronologia errada, que é o defeito exato que ela existe para consertar.
  const porId = new Map(mudancas.map((m) => [m.id, m]));
  for (const m of mudancas) {
    if (!m.substituidaPor) continue;

    const nova = porId.get(m.substituidaPor);
    if (!nova) {
      throw new Error(
        `mudancas.md: a mudança "${m.id}" diz ter sido substituída por "${m.substituidaPor}", que não existe nesta lista.`,
      );
    }
    if (nova.id === m.id) {
      throw new Error(`mudancas.md: a mudança "${m.id}" aponta para si mesma como substituta.`);
    }
    if (nova.data <= m.data) {
      throw new Error(
        `mudancas.md: a mudança "${m.id}" (${m.data}) diz ter sido substituída por "${nova.id}", que é de ${nova.data}. A substituta precisa ser mais recente.`,
      );
    }
    m.substituidaEm = nova.data;
  }

  return mudancas.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export function todasAsMudancas(): Mudanca[] {
  return lerArquivo();
}

/** Agrupa por ano, do mais recente para o mais antigo, para a linha do tempo. */
export function mudancasPorAno(): { ano: string; mudancas: Mudanca[] }[] {
  const grupos: { ano: string; mudancas: Mudanca[] }[] = [];
  for (const m of todasAsMudancas()) {
    const ano = m.data.slice(0, 4);
    const grupo = grupos.find((g) => g.ano === ano);
    if (grupo) grupo.mudancas.push(m);
    else grupos.push({ ano, mudancas: [m] });
  }
  return grupos;
}

/** A data da mudança mais recente. Nula quando a lista está vazia. */
export function mudancaMaisRecente(): string | null {
  return todasAsMudancas()[0]?.data ?? null;
}

/** Quantas regras registradas ainda estão em vigor. */
export function quantasEmVigor(): number {
  return todasAsMudancas().filter((m) => !m.substituidaPor).length;
}
