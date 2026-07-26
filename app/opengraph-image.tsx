import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { FONTES_OG } from "@/lib/og";

/**
 * Imagem que aparece quando alguém cola o link do site no WhatsApp, no LinkedIn
 * ou no X. Sem ela o link vira uma linha de texto cinza, e link sem imagem
 * perde clique num volume que dá pra sentir.
 *
 * Gerada pelo próprio Next, sem arquivo de imagem no repositório: o texto muda,
 * a arte acompanha.
 */

/**
 * Gerada sob demanda, e não no build, por um motivo prático: o `@vercel/og`
 * falha ao resolver o caminho da fonte quando o build roda no Windows, que é a
 * máquina de desenvolvimento aqui. Como a imagem é servida pela borda com
 * cache, gerar na primeira visita não custa nada.
 */
export const dynamic = "force-dynamic";
export const alt = SITE.nome;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagem() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfaf7",
          padding: "72px 80px",
          fontFamily: "Newsreader",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#1746c4" }} />
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#14100e",
              letterSpacing: -0.4,
            }}
          >
            {SITE.nome}
          </div>
        </div>

        <div
          style={{
            fontSize: 62,
            lineHeight: 1.15,
            color: "#14100e",
            letterSpacing: -1.6,
            maxWidth: 940,
          }}
        >
          O que está funcionando em marketing digital e marketplaces, com a fonte na mesa.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <div style={{ color: "#544c46" }}>{SITE.dominio}</div>
          <div style={{ color: "#1746c4" }}>publicação diária</div>
        </div>
      </div>
    ),
    { ...size, fonts: FONTES_OG() },
  );
}
