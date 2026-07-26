/**
 * Leitura de número digitado por gente.
 *
 * Mora aqui, e não dentro do componente da calculadora, por dois motivos. O
 * primeiro é teste: função pura se testa, componente com estado não. O segundo
 * é fronteira de cliente e servidor. Componente marcado como cliente não pode
 * importar nada que puxe `node:fs`, e `lib/numeros.ts` puxa. Misturar as duas
 * coisas num arquivo só é o jeito clássico de arrastar o servidor inteiro para
 * dentro do pacote que vai para o navegador.
 */

/**
 * Aceita as formas que aparecem quando alguém copia do painel: "1.234,56",
 * "1234,56", "1234.56", "R$ 1.240" e com espaço sobrando.
 *
 * Devolve `null` para o que não der para ler com segurança. Chutar a
 * interpretação de um número de faturamento seria pior que não responder.
 */
export function numeroBrasileiro(bruto: string): number | null {
  const limpo = bruto.replace(/R\$/g, "").replace(/\s/g, "");
  if (!limpo) return null;
  if (!/^[\d.,]+$/.test(limpo)) return null;

  // Com vírgula, ela é o separador decimal e o ponto é milhar: padrão daqui.
  // Sem vírgula, o ponto pode ser decimal ("1234.56") ou milhar ("18.500"). A
  // regra de desempate é o tamanho do último grupo: três dígitos é milhar.
  let normalizado: string;
  if (limpo.includes(",")) {
    normalizado = limpo.replace(/\./g, "").replace(",", ".");
  } else if (limpo.includes(".")) {
    const partes = limpo.split(".");
    const ultima = partes[partes.length - 1];
    normalizado = partes.length > 2 || ultima.length === 3 ? partes.join("") : limpo;
  } else {
    normalizado = limpo;
  }

  const n = Number(normalizado);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
