import { test } from "node:test";
import assert from "node:assert/strict";
import { numeroBrasileiro } from "./formato";

/**
 * O caso que importa é o ponto ambíguo. "18.500" copiado do painel é dezoito
 * mil e quinhentos, e ler isso como 18,5 erra a comissão média por mil vezes,
 * silenciosamente, com cara de resultado.
 */

test("lê o formato daqui", () => {
  assert.equal(numeroBrasileiro("1.234,56"), 1234.56);
  assert.equal(numeroBrasileiro("1234,56"), 1234.56);
  assert.equal(numeroBrasileiro("18.500,00"), 18500);
  assert.equal(numeroBrasileiro("1.234.567,89"), 1234567.89);
});

test("lê o formato que vem de planilha em inglês", () => {
  assert.equal(numeroBrasileiro("1234.56"), 1234.56);
  assert.equal(numeroBrasileiro("0.5"), 0.5);
});

test("desempata o ponto pelo tamanho do último grupo", () => {
  assert.equal(numeroBrasileiro("18.500"), 18500);
  assert.equal(numeroBrasileiro("1.240"), 1240);
  assert.equal(numeroBrasileiro("12.5"), 12.5);
  assert.equal(numeroBrasileiro("1.234.567"), 1234567);
});

test("tolera o que a pessoa cola junto", () => {
  assert.equal(numeroBrasileiro("R$ 1.240,00"), 1240);
  assert.equal(numeroBrasileiro("  980  "), 980);
});

test("recusa em vez de chutar", () => {
  assert.equal(numeroBrasileiro(""), null);
  assert.equal(numeroBrasileiro("   "), null);
  assert.equal(numeroBrasileiro("mil e duzentos"), null);
  assert.equal(numeroBrasileiro("-500"), null);
  assert.equal(numeroBrasileiro("1,2,3"), null);
});
