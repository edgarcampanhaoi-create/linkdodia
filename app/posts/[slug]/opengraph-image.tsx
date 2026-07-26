import { ImageResponse } from "next/og";
import { postPorSlug, formatarData, ROTULO_CONFIANCA } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { opcoesDeFonte } from "@/lib/og";

/**
 * Cada post tem a sua imagem de compartilhamento, com o título dentro. Quem vê
 * o link no WhatsApp já lê o achado antes de clicar, e o selo de confiança
 * aparece ali também: é o que diferencia a gente de qualquer outro link.
 */

/** Sob demanda pelo mesmo motivo da imagem da home. */
export const dynamic = "force-dynamic";
export const alt = "Publicação do Link do Dia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagem({ params }: { params: { slug: string } }) {
  const post = postPorSlug(params.slug);
  const fontes = opcoesDeFonte();
  const familia = "fonts" in fontes ? "Newsreader" : "serif";
  const titulo = post?.titulo ?? SITE.nome;
  const tamanhoTitulo = titulo.length > 90 ? 46 : titulo.length > 60 ? 54 : 62;

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
          padding: "68px 80px",
          fontFamily: familia,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#1746c4" }} />
          <div style={{ fontSize: 26, fontWeight: 600, color: "#14100e" }}>{SITE.nome}</div>
          {post && (
            <div style={{ fontSize: 22, color: "#7a716a", marginLeft: 10 }}>
              {post.categoria}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: tamanhoTitulo,
            lineHeight: 1.14,
            color: "#14100e",
            letterSpacing: -1.4,
            maxWidth: 1000,
          }}
        >
          {titulo}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, color: "#544c46" }}>
            {post ? formatarData(post.data) : SITE.dominio}
          </div>
          {post && (
            <div
              style={{
                display: "flex",
                fontSize: 21,
                color: post.confianca === "nao-confirmado" ? "#a8390f" : "#1746c4",
                background: post.confianca === "nao-confirmado" ? "#fbeae2" : "#e8edfb",
                padding: "8px 18px",
                borderRadius: 99,
              }}
            >
              {ROTULO_CONFIANCA[post.confianca].rotulo}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, ...fontes },
  );
}
