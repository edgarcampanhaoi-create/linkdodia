import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizarEmail } from "./lista";

/**
 * O que importa testar aqui é a fronteira: o que entra na lista e o que é
 * barrado. O envio em si depende de rede e de configuração — isso se verifica
 * rodando, não em teste de unidade.
 */

test("aceita endereço normal e normaliza", () => {
  assert.equal(normalizarEmail("Fulana@Exemplo.com.br"), "fulana@exemplo.com.br");
  assert.equal(normalizarEmail("  espaco@exemplo.com  "), "espaco@exemplo.com");
});

test("aceita os formatos esquisitos que gente de verdade usa", () => {
  assert.equal(normalizarEmail("nome+marca@exemplo.com"), "nome+marca@exemplo.com");
  assert.equal(normalizarEmail("nome.sobrenome@exemplo.com.br"), "nome.sobrenome@exemplo.com.br");
  assert.equal(normalizarEmail("a_b-c@sub.exemplo.io"), "a_b-c@sub.exemplo.io");
});

test("recusa erro de digitação óbvio", () => {
  assert.equal(normalizarEmail("sem-arroba.com"), null);
  assert.equal(normalizarEmail("sem@dominio"), null);
  assert.equal(normalizarEmail("dois@@arrobas.com"), null);
  assert.equal(normalizarEmail("com espaco@exemplo.com"), null);
  assert.equal(normalizarEmail("@exemplo.com"), null);
  assert.equal(normalizarEmail("fulano@.com"), null);
});

test("recusa o que não é texto", () => {
  assert.equal(normalizarEmail(undefined), null);
  assert.equal(normalizarEmail(null), null);
  assert.equal(normalizarEmail(42), null);
  assert.equal(normalizarEmail({ email: "a@b.com" }), null);
});

test("recusa tamanhos absurdos", () => {
  assert.equal(normalizarEmail("a@b.c"), null); // curto demais pra ser real
  assert.equal(normalizarEmail("a".repeat(250) + "@exemplo.com"), null);
});
