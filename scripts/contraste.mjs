/**
 * Contraste da paleta, medido — não estimado.
 *
 * Rodar: `node scripts/contraste.mjs`. Falha (exit 1) se algum par de TEXTO
 * ficar abaixo de 4,5:1 (WCAG 2.1 AA). Um site cujo produto é credibilidade não
 * pode ter legenda ilegível.
 */

const PAPEL = "#fbfaf7";
const PAPEL_ALTO = "#ffffff";
const PAPEL_FUNDO = "#f2efe9";

const PARES = [
  ["tinta sobre papel", "#14100e", PAPEL, "texto"],
  ["tinta-2 sobre papel", "#544c46", PAPEL, "texto"],
  ["tinta-3 sobre papel", "#7a716a", PAPEL, "texto"],
  ["tinta-3 sobre papel-alto", "#7a716a", PAPEL_ALTO, "texto"],
  ["tinta-2 sobre papel-fundo", "#544c46", PAPEL_FUNDO, "texto"],
  ["farol sobre papel", "#1746c4", PAPEL, "texto"],
  ["farol sobre farol-claro", "#1746c4", "#e8edfb", "texto"],
  ["branco sobre farol", "#ffffff", "#1746c4", "texto"],
  ["brasa sobre papel", "#a8390f", PAPEL, "texto"],
  ["brasa sobre brasa-claro", "#a8390f", "#fbeae2", "texto"],
  ["risco sobre papel", "#e4ded4", PAPEL, "linha"],
];

function luminancia(hex) {
  const canais = hex
    .replace("#", "")
    .match(/../g)
    .map((par) => {
      const v = parseInt(par, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
  return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2];
}

function razao(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

let reprovou = false;
console.log("par                              razão   veredito");
for (const [nome, frente, fundo, tipo] of PARES) {
  const r = razao(frente, fundo);
  let veredito;
  if (tipo === "linha") {
    veredito = "linha (sem exigência de texto)";
  } else if (r >= 4.5) {
    veredito = "AA texto";
  } else if (r >= 3) {
    veredito = "só texto grande — REVER";
    reprovou = true;
  } else {
    veredito = "REPROVA";
    reprovou = true;
  }
  console.log(nome.padEnd(32), r.toFixed(2).padStart(5), " ", veredito);
}

if (reprovou) {
  console.error("\nAlgum par de texto ficou abaixo de 4,5:1. Corrija a paleta.");
  process.exit(1);
}
console.log("\nTodos os pares de texto passam em AA.");
