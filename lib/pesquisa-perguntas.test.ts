import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PERGUNTAS,
  MIN_RESPOSTAS,
  validarResposta,
  agregar,
  type Resposta,
} from "./pesquisa-perguntas";

/**
 * O que precisa estar certo aqui é a fronteira do que entra na amostra e a
 * conta que sai dela. Um percentual errado numa página que se vende como
 * benchmark é pior que não ter a página.
 */

function respostaValida(troca: Resposta = {}): Record<string, string> {
  const base: Record<string, string> = {};
  for (const p of PERGUNTAS) base[p.id] = p.opcoes[0].id;
  return { ...base, ...troca };
}

test("aceita resposta completa e devolve só o que foi perguntado", () => {
  const limpa = validarResposta({ ...respostaValida(), sobrenome: "robo", extra: "lixo" });
  assert.ok(limpa);
  assert.deepEqual(Object.keys(limpa).sort(), PERGUNTAS.map((p) => p.id).sort());
});

test("recusa resposta incompleta em vez de guardar pela metade", () => {
  const faltando = respostaValida();
  delete faltando[PERGUNTAS[2].id];
  assert.equal(validarResposta(faltando), null);
});

test("recusa opção que não existe no cardápio", () => {
  assert.equal(validarResposta(respostaValida({ comissao: "50-a-90" })), null);
  assert.equal(validarResposta(respostaValida({ plataforma: "" })), null);
});

test("recusa o que não é texto", () => {
  assert.equal(validarResposta(respostaValida({ tamanho: 3 as unknown as string })), null);
  assert.equal(validarResposta({}), null);
});

test("conta e calcula percentual sobre o total de respostas", () => {
  const amostra = [
    respostaValida({ comissao: "ate-3" }),
    respostaValida({ comissao: "ate-3" }),
    respostaValida({ comissao: "ate-3" }),
    respostaValida({ comissao: "acima-15" }),
  ].map((r) => validarResposta(r)!);

  const saida = agregar(amostra);
  const comissao = saida.perguntas.find((p) => p.id === "comissao")!;

  assert.equal(saida.n, 4);
  assert.equal(comissao.opcoes.find((o) => o.id === "ate-3")!.quantos, 3);
  assert.equal(comissao.opcoes.find((o) => o.id === "ate-3")!.percentual, 75);
  assert.equal(comissao.opcoes.find((o) => o.id === "acima-15")!.percentual, 25);
  assert.equal(comissao.opcoes.find((o) => o.id === "6-a-10")!.percentual, 0);
});

test("toda opção aparece no resultado, inclusive a que ninguém escolheu", () => {
  const saida = agregar([validarResposta(respostaValida())!]);
  for (const p of PERGUNTAS) {
    const contada = saida.perguntas.find((x) => x.id === p.id)!;
    assert.equal(contada.opcoes.length, p.opcoes.length);
  }
});

test("não publica antes do piso, e diz quantas faltam", () => {
  const uma = agregar([validarResposta(respostaValida())!]);
  assert.equal(uma.publicavel, false);
  assert.equal(uma.faltam, MIN_RESPOSTAS - 1);

  const cheia = agregar(
    Array.from({ length: MIN_RESPOSTAS }, () => validarResposta(respostaValida())!),
  );
  assert.equal(cheia.publicavel, true);
  assert.equal(cheia.faltam, 0);
});

test("percentual usa o n da pergunta, e não o da amostra", () => {
  // Simula pergunta acrescentada depois: metade das respostas não a tem.
  const alvo = PERGUNTAS[1].id;
  const amostra = [
    validarResposta(respostaValida())!,
    validarResposta(respostaValida())!,
    { ...validarResposta(respostaValida())!, [alvo]: "" },
    { ...validarResposta(respostaValida())!, [alvo]: "" },
  ];

  const saida = agregar(amostra);
  const pergunta = saida.perguntas.find((p) => p.id === alvo)!;
  const escolhida = pergunta.opcoes.find((o) => o.id === PERGUNTAS[1].opcoes[0].id)!;

  assert.equal(saida.n, 4);
  assert.equal(pergunta.n, 2);
  // Dois de dois responderam essa opção. Sobre o total da amostra daria 50%.
  assert.equal(escolhida.percentual, 100);

  // Pergunta que todo mundo respondeu segue contando sobre a amostra inteira.
  const intacta = saida.perguntas.find((p) => p.id === PERGUNTAS[0].id)!;
  assert.equal(intacta.n, 4);
});

test("amostra vazia não divide por zero", () => {
  const vazia = agregar([]);
  assert.equal(vazia.n, 0);
  assert.equal(vazia.publicavel, false);
  for (const p of vazia.perguntas) {
    for (const o of p.opcoes) assert.equal(o.percentual, 0);
  }
});
