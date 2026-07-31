import { test } from "node:test";
import assert from "node:assert/strict";
import {
  itensDoSite,
  novidades,
  registroDe,
  assunto,
  corpoTexto,
  corpoHtml,
} from "./alerta";
import type { Mudanca } from "./mudancas";
import type { Numero } from "./numeros";
import type { PostResumido } from "./posts";

/**
 * O que se testa aqui é quem recebe e-mail e por quê.
 *
 * Errar para o lado do silêncio custa um aviso perdido. Errar para o outro lado
 * manda o acervo inteiro para a caixa de gente que assinou esperando ser avisada
 * do que muda daqui em diante, e essa pessoa não volta.
 */

const MUDANCA: Mudanca = {
  id: "regra-teste",
  data: "2026-07-01",
  plataforma: "Shopee",
  titulo: "Uma regra mudou",
  oQueMudou: "O texto do que mudou.",
  oQueQuebra: "O que isso quebra.",
  confianca: "verificado",
  fonte: "Documento oficial, artigo 1",
};

const NUMERO: Numero = {
  id: "comissao",
  valor: "3%",
  titulo: "Comissão base",
  curto: "comissão",
  oQueE: "O piso pago pela plataforma.",
  oQueFazer: "Compare com o seu extrato.",
  categoria: "Afiliados",
  confianca: "verificado",
  fonte: "Termos do programa, artigo 124094",
  desde: "2026-06-30",
  dataDe: "documento",
  post: "algum-post",
  tituloDoPost: "Algum post",
};

const POST: PostResumido = {
  slug: "algum-post",
  titulo: "Um post publicado",
  resumo: "O resumo do post.",
  data: "2026-07-26",
  categoria: "Afiliados",
  tags: [],
  fontes: [],
  confianca: "verificado",
  minutos: 4,
};

function site(over: Partial<Parameters<typeof itensDoSite>[0]> = {}) {
  return itensDoSite({
    mudancas: [MUDANCA],
    numeros: [NUMERO],
    posts: [POST],
    ...over,
  });
}

test("sem registro anterior, tudo é novidade", () => {
  const novas = novidades(site(), {});
  assert.equal(novas.length, 3);
  assert.deepEqual(
    novas.map((n) => n.raiz),
    ["mudanca:regra-teste", "numero:comissao", "post:algum-post"],
  );
  assert.equal(
    novas.every((n) => n.alterado === false),
    true,
  );
});

test("com o registro em dia, nada é novidade", () => {
  const itens = site();
  assert.equal(novidades(itens, registroDe(itens)).length, 0);
});

test("número que muda de valor vira novidade, e leva o valor antigo junto", () => {
  const registro = registroDe(site());
  const depois = site({ numeros: [{ ...NUMERO, valor: "4%" }] });

  const novas = novidades(depois, registro);
  assert.equal(novas.length, 1);
  assert.equal(novas[0].raiz, "numero:comissao");
  assert.equal(novas[0].alterado, true);
  assert.equal(novas[0].antes, "3%");
  assert.equal(novas[0].valor, "4%");
});

test("número que troca de fonte ou de data também avisa", () => {
  const registro = registroDe(site());

  const outraFonte = novidades(site({ numeros: [{ ...NUMERO, fonte: "Outro documento" }] }), registro);
  assert.equal(outraFonte.length, 1);
  assert.equal(outraFonte[0].alterado, true);

  const outraData = novidades(site({ numeros: [{ ...NUMERO, desde: "2026-07-30" }] }), registro);
  assert.equal(outraData.length, 1);
});

test("acerto de texto numa entrada antiga do registro não manda e-mail", () => {
  const registro = registroDe(site());
  const revisada = site({
    mudancas: [{ ...MUDANCA, oQueQuebra: "O mesmo, escrito melhor.", titulo: "Outro título" }],
  });
  assert.equal(novidades(revisada, registro).length, 0);
});

test("post revisado não manda e-mail, post novo manda", () => {
  const registro = registroDe(site());

  const editado = site({ posts: [{ ...POST, titulo: "Outro título", resumo: "Outro resumo" }] });
  assert.equal(novidades(editado, registro).length, 0);

  const comNovo = site({ posts: [POST, { ...POST, slug: "post-novo", titulo: "Post novo" }] });
  const novas = novidades(comNovo, registro);
  assert.equal(novas.length, 1);
  assert.equal(novas[0].raiz, "post:post-novo");
});

test("o assunto diz o que aconteceu quando é um só", () => {
  const [mudanca, numero, post] = novidades(site(), {});
  assert.equal(assunto([mudanca]), "Regra nova: Uma regra mudou");
  assert.equal(assunto([post]), "Publicação nova: Um post publicado");
  assert.equal(
    assunto([{ ...numero, alterado: true, antes: "3%" }]),
    "Número alterado: Comissão base",
  );
});

test("o assunto conta os tipos quando é mais de um", () => {
  assert.equal(assunto(novidades(site(), {})), "Link do Dia: 1 regra, 1 número, 1 publicação");

  const doisNumeros = novidades(
    site({ numeros: [NUMERO, { ...NUMERO, id: "outro" }], mudancas: [], posts: [] }),
    {},
  );
  assert.equal(assunto(doisNumeros), "Link do Dia: 2 números");
});

test("o corpo leva endereço absoluto e a porta de saída", () => {
  const novas = novidades(site(), {});
  const texto = corpoTexto(novas, "https://linkdodia.com", "https://linkdodia.com/sair/abc");

  assert.match(texto, /https:\/\/linkdodia\.com\/mudancas#regra-teste/);
  assert.match(texto, /https:\/\/linkdodia\.com\/benchmarks#comissao/);
  assert.match(texto, /https:\/\/linkdodia\.com\/posts\/algum-post/);
  assert.match(texto, /Para sair: https:\/\/linkdodia\.com\/sair\/abc/);
});

test("o número alterado mostra o valor de antes no corpo", () => {
  const registro = registroDe(site());
  const novas = novidades(site({ numeros: [{ ...NUMERO, valor: "4%" }] }), registro);
  assert.match(corpoTexto(novas, "https://linkdodia.com", "x"), /4%, e era 3%/);
});

test("o html escapa o que veio do conteúdo", () => {
  const novas = novidades(site({ mudancas: [{ ...MUDANCA, titulo: '<script>"oi"' }] }), {});
  const html = corpoHtml(novas, "https://linkdodia.com", "https://linkdodia.com/sair/abc");

  assert.equal(html.includes("<script>"), false);
  assert.match(html, /&lt;script&gt;&quot;oi&quot;/);
});
