import { ROTULO_CONFIANCA, type Confianca } from "@/lib/posts";

/**
 * O selo de confiança é o produto, não enfeite.
 *
 * A promessa do site é que dá pra saber, batendo o olho, se aquilo foi conferido
 * em documento oficial ou é leitura de campo. Um site de benchmark que não
 * distingue as duas coisas é um blog com gráfico.
 */
/**
 * O ponto que diz o degrau da escala pela forma, e não só pela cor.
 *
 * Cheio é confirmado, metade é parcial, vazio é não confirmado. Existe por dois
 * motivos. O primeiro é que o degrau do meio é cinza de propósito, porque não é
 * elogio nem alerta, e cinza sozinho parecia descuido ao lado do azul. Dar cor
 * quente a ele resolveria a aparência e criaria um problema maior, porque
 * qualquer quente fica vizinho da brasa do não confirmado, e essa é a distinção
 * que o site mais precisa preservar.
 *
 * O segundo motivo é que informação que só existe em cor não chega para quem não
 * distingue cor. Com o ponto, a escala continua legível em preto e branco.
 *
 * Usa `currentColor`, então herda a cor do próprio selo e funciona igual sobre
 * papel e sobre a faixa escura.
 */
function PontoDaEscala({ grau }: { grau: Confianca }) {
  if (grau === "verificado") {
    return <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-current" />;
  }

  if (grau === "nao-confirmado") {
    return <span aria-hidden className="h-2 w-2 shrink-0 rounded-full ring-1 ring-inset ring-current" />;
  }

  return (
    <span
      aria-hidden
      className="relative block h-2 w-2 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-current"
    >
      <span className="absolute inset-y-0 left-0 w-1/2 bg-current" />
    </span>
  );
}

export function SeloConfianca({ confianca }: { confianca: Confianca }) {
  const cor = {
    verificado: "border-farol/25 bg-farol-claro text-farol",
    parcial: "border-risco bg-papel-fundo text-tinta-2",
    "nao-confirmado": "border-brasa/25 bg-brasa-claro text-brasa",
  }[confianca];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cor}`}
    >
      <PontoDaEscala grau={confianca} />
      {ROTULO_CONFIANCA[confianca].rotulo}
    </span>
  );
}

export function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-3">
      {children}
    </span>
  );
}
