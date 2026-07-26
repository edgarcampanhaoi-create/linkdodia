import { ROTULO_CONFIANCA, type Confianca } from "@/lib/posts";

/**
 * O selo de confiança é o produto, não enfeite.
 *
 * A promessa do site é que dá pra saber, batendo o olho, se aquilo foi conferido
 * em documento oficial ou é leitura de campo. Um site de benchmark que não
 * distingue as duas coisas é um blog com gráfico.
 */
export function SeloConfianca({ confianca }: { confianca: Confianca }) {
  const cor = {
    verificado: "border-farol/25 bg-farol-claro text-farol",
    parcial: "border-risco bg-papel-fundo text-tinta-2",
    "nao-confirmado": "border-brasa/25 bg-brasa-claro text-brasa",
  }[confianca];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cor}`}
    >
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
