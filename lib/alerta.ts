import { createHash } from "node:crypto";
import { formatarData, type PostResumido } from "@/lib/posts";
import type { Mudanca } from "@/lib/mudancas";
import type { Numero } from "@/lib/numeros";

/**
 * O que o alerta tem para contar, e como ele decide isso.
 *
 * O motivo de assinar a lista deixa de ser newsletter e passa a ser vigilância:
 * quem está na lista fica sabendo quando uma regra de plataforma muda, quando um
 * número do benchmark muda de valor, de fonte ou de data, e quando sai texto
 * novo. Nada disso depende de alguém lembrar de escrever um e-mail.
 *
 * Este arquivo é de propósito sem banco e sem rede. Ele recebe o que está
 * publicado e o registro do que já saiu, e devolve o que é novidade. Assim a
 * regra que decide o que chega na caixa de e-mail de alguém pode ser testada
 * sem tocar em Redis nem mandar mensagem para ninguém.
 *
 * O texto daqui vai por e-mail, então passa pelo mesmo portão de estilo dos
 * posts. Está escrito em `conteudo/ESTILO.md`: a regra vale para o que é
 * publicado no site e para o que sai por e-mail.
 */

export type TipoItem = "mudanca" | "numero" | "post";

export type ItemAlerta = {
  /** Identidade estável do item, sem o conteúdo. É por ela que se sabe se já saiu. */
  raiz: string;
  /** Impressão do conteúdo. Quando ela muda, o item mudou. */
  impressao: string;
  tipo: TipoItem;
  titulo: string;
  detalhe: string;
  caminho: string;
  /** O valor atual, quando o item é número. É o que permite dizer "era 3%". */
  valor?: string;
};

/** O que ficou registrado da última vez que este item saiu. */
export type Visto = { i: string; v?: string };

export type Novidade = ItemAlerta & {
  /** Falso quando o item nunca saiu, verdadeiro quando ele saiu e mudou. */
  alterado: boolean;
  /** O valor anterior, quando é número que mudou e o valor antigo foi registrado. */
  antes?: string;
};

const ROTULO: Record<TipoItem, { novo: string; alterado: string }> = {
  mudanca: { novo: "Regra nova", alterado: "Regra corrigida" },
  numero: { novo: "Número novo", alterado: "Número alterado" },
  post: { novo: "Publicação nova", alterado: "Publicação revista" },
};

function impressaoDe(partes: string[]): string {
  return createHash("sha1").update(partes.join("|")).digest("hex").slice(0, 12);
}

/**
 * Tudo que está publicado hoje, na ordem em que vale a pena ser contado.
 *
 * Regra primeiro, porque é a que quebra operação. Número depois, porque muda
 * conta. Publicação por último, porque é leitura.
 */
export function itensDoSite(entrada: {
  mudancas: Mudanca[];
  numeros: Numero[];
  posts: PostResumido[];
}): ItemAlerta[] {
  const mudancas: ItemAlerta[] = entrada.mudancas.map((m) => ({
    raiz: `mudanca:${m.id}`,
    // A entrada do registro não leva o conteúdo na impressão de propósito.
    // Acerto de vírgula numa entrada antiga não é motivo para chegar e-mail.
    impressao: "registro",
    tipo: "mudanca",
    titulo: m.titulo,
    // O rótulo "o que quebra" vai junto, porque sem ele a frase chega solta na
    // caixa de e-mail e parece opinião. Na página ele está do lado.
    detalhe: `${m.plataforma}, ${formatarData(m.data)}. O que quebra: ${m.oQueQuebra}`,
    caminho: `/mudancas#${m.id}`,
  }));

  const numeros: ItemAlerta[] = entrada.numeros.map((n) => ({
    raiz: `numero:${n.id}`,
    // Aqui a impressão leva o conteúdo, porque é exatamente disso que a lista
    // quer ser avisada: valor, fonte e data do documento.
    impressao: impressaoDe([n.valor, n.fonte, n.desde]),
    tipo: "numero",
    titulo: n.titulo,
    detalhe: `${n.fonte}, ${
      n.dataDe === "consulta" ? `conferida em ${formatarData(n.desde)}` : `de ${formatarData(n.desde)}`
    }.`,
    caminho: `/benchmarks#${n.id}`,
    valor: n.valor,
  }));

  const posts: ItemAlerta[] = entrada.posts.map((p) => ({
    raiz: `post:${p.slug}`,
    impressao: "publicado",
    tipo: "post",
    titulo: p.titulo,
    detalhe: p.resumo,
    caminho: `/posts/${p.slug}`,
  }));

  return [...mudancas, ...numeros, ...posts];
}

/**
 * O que é novidade de verdade.
 *
 * Item que nunca saiu é novo. Item que saiu e está com outra impressão mudou, e
 * aí o valor anterior vai junto, porque "a comissão base era 3% e agora é 4%"
 * vale muito mais que "um número mudou".
 */
export function novidades(itens: ItemAlerta[], visto: Record<string, Visto>): Novidade[] {
  const saida: Novidade[] = [];

  for (const item of itens) {
    const anterior = visto[item.raiz];
    if (!anterior) {
      saida.push({ ...item, alterado: false });
      continue;
    }
    if (anterior.i !== item.impressao) {
      saida.push({ ...item, alterado: true, antes: anterior.v });
    }
  }

  return saida;
}

/** O registro a gravar depois que o envio deu certo. */
export function registroDe(itens: ItemAlerta[]): Record<string, Visto> {
  const registro: Record<string, Visto> = {};
  for (const item of itens) {
    registro[item.raiz] = item.valor ? { i: item.impressao, v: item.valor } : { i: item.impressao };
  }
  return registro;
}

function contar(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

export function assunto(novas: Novidade[]): string {
  if (novas.length === 1) {
    const u = novas[0];
    return `${u.alterado ? ROTULO[u.tipo].alterado : ROTULO[u.tipo].novo}: ${u.titulo}`;
  }

  const partes: string[] = [];
  const regras = novas.filter((n) => n.tipo === "mudanca").length;
  const numeros = novas.filter((n) => n.tipo === "numero").length;
  const posts = novas.filter((n) => n.tipo === "post").length;
  if (regras) partes.push(contar(regras, "regra", "regras"));
  if (numeros) partes.push(contar(numeros, "número", "números"));
  if (posts) partes.push(contar(posts, "publicação", "publicações"));

  return `Link do Dia: ${partes.join(", ")}`;
}

function rotuloDe(n: Novidade): string {
  return n.alterado ? ROTULO[n.tipo].alterado : ROTULO[n.tipo].novo;
}

/** A linha do valor, que é onde mora o achado quando o item é número. */
function linhaDeValor(n: Novidade): string | null {
  if (!n.valor) return null;
  if (n.alterado && n.antes && n.antes !== n.valor) return `${n.valor}, e era ${n.antes}`;
  return n.valor;
}

export function corpoTexto(novas: Novidade[], base: string, urlSaida: string): string {
  const blocos = novas.map((n) => {
    const linhas = [`${rotuloDe(n).toUpperCase()}`, n.titulo];
    const valor = linhaDeValor(n);
    if (valor) linhas.push(valor);
    linhas.push(n.detalhe);
    linhas.push(`${base}${n.caminho}`);
    return linhas.join("\n");
  });

  return [
    blocos.join("\n\n"),
    "",
    "Cada item acima tem a fonte na página, com nome de documento e data.",
    "",
    "Você recebe este aviso porque entrou na lista do Link do Dia.",
    `Para sair: ${urlSaida}`,
  ].join("\n");
}

function escapar(t: string): string {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * O corpo em HTML.
 *
 * Sem imagem, sem rastreador de abertura e sem folha de estilo externa. Cliente
 * de e-mail ignora metade do que a gente mandar, e um site que promete não
 * repassar endereço não vai abrir exceção para pixel de rastreio.
 */
export function corpoHtml(novas: Novidade[], base: string, urlSaida: string): string {
  const blocos = novas
    .map((n) => {
      const valor = linhaDeValor(n);
      return [
        '<article style="margin:0 0 28px;padding:0 0 24px;border-bottom:1px solid #e4ded4">',
        `<p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7a716a">${escapar(rotuloDe(n))}</p>`,
        `<h2 style="margin:8px 0 0;font-family:Georgia,serif;font-size:19px;line-height:1.35;color:#14100e">${escapar(n.titulo)}</h2>`,
        valor
          ? `<p style="margin:10px 0 0;font-family:Georgia,serif;font-size:26px;font-weight:600;color:#14100e">${escapar(valor)}</p>`
          : "",
        `<p style="margin:10px 0 0;font-size:15px;line-height:1.6;color:#544c46">${escapar(n.detalhe)}</p>`,
        `<p style="margin:12px 0 0;font-size:15px"><a href="${escapar(base + n.caminho)}" style="color:#1746c4">Ver no site</a></p>`,
        "</article>",
      ].join("");
    })
    .join("");

  return [
    '<div style="margin:0;padding:24px;background:#fbfaf7;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;color:#14100e">',
    '<div style="max-width:560px;margin:0 auto">',
    `<p style="margin:0 0 24px;font-family:Georgia,serif;font-size:20px;font-weight:600"><a href="${escapar(base)}" style="color:#14100e;text-decoration:none">Link do Dia</a></p>`,
    blocos,
    '<p style="margin:0;font-size:13px;line-height:1.6;color:#7a716a">Cada item acima tem a fonte na página, com nome de documento e data.</p>',
    `<p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#7a716a">Você recebe este aviso porque entrou na lista do Link do Dia. <a href="${escapar(urlSaida)}" style="color:#7a716a">Sair da lista</a>.</p>`,
    "</div></div>",
  ].join("");
}
