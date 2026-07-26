/**
 * Verificador de estilo editorial.
 *
 * A regra está em `conteudo/ESTILO.md`. Este script é o que impede a regra de
 * virar boa intenção: ele roda antes do build e quebra quando o texto escorrega
 * para os vícios que denunciam escrita automática.
 *
 * Ele não julga qualidade. Passar aqui é o piso, não o objetivo.
 *
 * Uso: `npm run estilo`
 */
import fs from "node:fs";
import path from "node:path";

const ALVOS = [
  { pasta: path.join(process.cwd(), "conteudo", "posts"), ext: /\.mdx?$/ },
  // A lista de benchmarks é texto de leitor como qualquer outro, então passa
  // pelas mesmas regras. Alvo pelo nome do arquivo, e não pela pasta inteira,
  // porque o próprio ESTILO.md cita os caracteres proibidos para explicá-los.
  { pasta: path.join(process.cwd(), "conteudo"), ext: /^benchmarks\.md$/ },
  { pasta: path.join(process.cwd(), "app"), ext: /\.tsx?$/ },
  { pasta: path.join(process.cwd(), "components"), ext: /\.tsx?$/ },
  { pasta: path.join(process.cwd(), "lib"), ext: /^site\.ts$/ },
];

/** Quebra o build. */
const ERROS = [
  {
    nome: "travessão",
    regex: /[—–]/g,
    conserto: "Troque por vírgula, ponto, dois-pontos ou parênteses.",
  },
  {
    nome: "muleta de transição",
    regex: /\b(em suma|em resumo|por fim|vale ressaltar|vale notar|vale dizer|é importante (notar|ressaltar|destacar)|em última análise|dito isso)\b/gi,
    conserto: "Corte a muleta e escreva a informação direto.",
  },
  {
    nome: "abertura genérica",
    regex: /\b(no mundo (dinâmico|acelerado|competitivo)|nos dias de hoje|na era digital|cada vez mais empresas)\b/gi,
    conserto: "Comece pelo fato concreto do texto.",
  },
  {
    nome: "adjetivo de folheto",
    regex: /\b(revolucionári[ao]|game.?changer|poderos[ao] ferramenta|solução robusta|mergulh(e|ar) fundo|desvendar|descomplicar)\b/gi,
    conserto: "Descreva o que a coisa faz.",
  },
  { nome: "reticências", regex: /…/g, conserto: "Termine a frase." },
];

/** Só avisa. Julgamento é humano. */
const AVISOS = [
  {
    nome: "antítese em série",
    regex: /não é .{2,60}?, é /gi,
    limite: 1,
    conserto: 'Mais de uma "não é X, é Y" por texto vira tique.',
  },
  {
    nome: "negrito",
    regex: /\*\*[^*]+\*\*/g,
    limite: 6,
    conserto: "Negrito demais anula o negrito. Guarde para o dado que a pessoa copiaria.",
  },
];

function arquivosDe(pasta, ext) {
  if (!fs.existsSync(pasta)) return [];
  const saida = [];
  for (const item of fs.readdirSync(pasta, { withFileTypes: true })) {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) saida.push(...arquivosDe(caminho, ext));
    else if (ext.test(item.name)) saida.push(caminho);
  }
  return saida;
}

function linhaDe(texto, indice) {
  return texto.slice(0, indice).split("\n").length;
}

let falhas = 0;
let avisos = 0;

for (const alvo of ALVOS) {
  for (const arquivo of arquivosDe(alvo.pasta, alvo.ext)) {
    const texto = fs.readFileSync(arquivo, "utf8");
    const relativo = path.relative(process.cwd(), arquivo);

    for (const regra of ERROS) {
      for (const achado of texto.matchAll(regra.regex)) {
        falhas += 1;
        console.error(
          `ERRO  ${relativo}:${linhaDe(texto, achado.index)}  ${regra.nome} ("${achado[0].trim()}")\n      ${regra.conserto}`,
        );
      }
    }

    for (const regra of AVISOS) {
      const quantos = Array.from(texto.matchAll(regra.regex)).length;
      if (quantos > regra.limite) {
        avisos += 1;
        console.warn(
          `aviso ${relativo}  ${regra.nome}: ${quantos} ocorrências (limite ${regra.limite})\n      ${regra.conserto}`,
        );
      }
    }

    // Frase longa demais: mede só o corpo do post, onde o ritmo importa.
    //
    // Citação em bloco fica de fora. Documento oficial escreve em período longo,
    // e a citação é literal por obrigação: encurtar a frase de um artigo de lei
    // para agradar este script seria falsificar a fonte, que é o oposto do que
    // o site faz. Avisar sobre ela só criaria pressão para isso.
    if (alvo.ext.source.includes("md")) {
      // Mede linha a linha, e não o texto corrido.
      //
      // Intertítulo não termina em ponto, então um split por pontuação cola o
      // parágrafo anterior, o título e o parágrafo seguinte numa "frase" só, e
      // o aviso dispara sozinho. Item de lista tem o mesmo problema. Como aqui
      // cada parágrafo ocupa uma linha, medir por linha é a leitura fiel.
      const linhas = texto
        .replace(/^---[\s\S]*?---/, "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith(">") && !l.startsWith("#") && !l.startsWith("|"));

      const longas = linhas
        .flatMap((linha) => linha.split(/(?<=[.!?])\s+/))
        .filter((f) => f.split(/\s+/).length > 42);
      if (longas.length > 0) {
        avisos += 1;
        console.warn(
          `aviso ${relativo}  ${longas.length} frase(s) com mais de 42 palavras.\n      Quebre em duas. Frase longa demais cansa e some do ritmo.`,
        );
      }
    }
  }
}

console.log("");
if (falhas > 0) {
  console.error(`Estilo: ${falhas} erro(s) e ${avisos} aviso(s). Corrija os erros.`);
  process.exit(1);
}
console.log(`Estilo: nenhum erro. ${avisos} aviso(s) para olhar com calma.`);
