import fs from "node:fs";
import path from "node:path";

/**
 * Fonte das imagens de compartilhamento.
 *
 * A Newsreader vive em `assets/fontes` e é a mesma tipografia dos títulos do
 * site, então a imagem sai com a cara certa. O arquivo mora no repositório de
 * propósito: buscar fonte pela rede na hora de gerar a imagem criaria uma
 * dependência externa no caminho de algo que precisa responder quando o
 * WhatsApp pede a prévia do link.
 *
 * Se o arquivo não estiver presente, devolvemos `undefined` e o gerador usa a
 * fonte embutida dele. A imagem sai com tipografia genérica, o que é bem melhor
 * que não sair. Isso acontece, por exemplo, num deploy feito sem os binários do
 * repositório.
 */
export function fontesDaMarca():
  | { name: string; data: ArrayBuffer; weight: 600; style: "normal" }[]
  | undefined {
  try {
    const arquivo = path.join(process.cwd(), "assets", "fontes", "newsreader-600.ttf");
    const bytes = fs.readFileSync(arquivo);
    const data = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
    return [{ name: "Newsreader", data, weight: 600, style: "normal" }];
  } catch {
    return undefined;
  }
}

/** Opções extras do ImageResponse, já prontas para espalhar. */
export function opcoesDeFonte() {
  const fonts = fontesDaMarca();
  return fonts ? { fonts } : {};
}
