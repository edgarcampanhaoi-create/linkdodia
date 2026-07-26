/**
 * Um bloco de dado estruturado na página.
 *
 * Existe para não repetir o `dangerouslySetInnerHTML` em cinco lugares, e para
 * que a serialização seja igual em todos eles.
 */
export function Estruturado({ dados }: { dados: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
