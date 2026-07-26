import fs from "node:fs";
import path from "node:path";

/**
 * Fonte das imagens de compartilhamento.
 *
 * O `@vercel/og` tenta carregar uma fonte padrão embutida e falha no Windows,
 * com "Invalid URL", tanto no dev quanto no build. Fornecer a fonte de forma
 * explícita resolve, e ainda melhora o resultado: a imagem passa a usar a
 * Newsreader, a mesma tipografia dos títulos do site, em vez de uma fonte
 * genérica.
 *
 * O arquivo mora no repositório de propósito. Buscar fonte pela rede na hora de
 * gerar a imagem cria uma dependência externa no caminho de algo que precisa
 * funcionar sempre, inclusive quando o WhatsApp pede a prévia do link.
 */
export function fonteDaMarca(): ArrayBuffer {
  const arquivo = path.join(process.cwd(), "assets", "fontes", "newsreader-600.ttf");
  const bytes = fs.readFileSync(arquivo);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export const FONTES_OG = () => [
  { name: "Newsreader", data: fonteDaMarca(), weight: 600 as const, style: "normal" as const },
];
