import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE } from "@/lib/site";
import "./globals.css";

/** Newsreader: serifada com itálico, ar de publicação. Inter: corpo e dados. */
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--fonte-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--fonte-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome}: benchmark e referência para quem vende online`,
    template: `%s · ${SITE.nome}`,
  },
  description: SITE.descricaoCurta,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    url: SITE.url,
    title: SITE.nome,
    description: SITE.descricao,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE.url}/rss.xml` },
  },
  robots: { index: true, follow: true },
};

/**
 * O link de navegação, com área de toque maior que o desenho.
 *
 * Medido em 31 de julho: os links do menu tinham 20 pixels de altura, e a régua
 * de alvo de toque pede perto de 44. Num polegar, fileira de alvo de 20 pixels é
 * campo minado, e menu é controle, não texto corrido.
 *
 * O conserto é `-my-2.5 py-2.5`: a margem negativa devolve o espaço que o
 * preenchimento tomou, então a área sensível vai a 40 pixels e o desenho na tela
 * continua igual ao que era. Ninguém vê a diferença, e o dedo acerta.
 */
const LINK_MENU = "-my-2.5 py-2.5 transition hover:text-papel";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        {/* O cabeçalho é escuro para emendar na faixa do topo sem costura. Sem
            borda embaixo pelo mesmo motivo: as duas peças formam uma região só. */}
        <header className="bg-carvao text-papel">
          <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-5 py-4">
            <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
              Link do Dia
            </Link>
            {/* Quatro itens, e não seis.

                "Publicações" saiu porque levava para a home, que é onde o nome do
                site ao lado já leva, e "RSS" saiu porque serve a um público
                pequeno e continua no rodapé, além de ser anunciado no cabeçalho
                da página para quem usa leitor de feed. Menu de telefone que
                quebra em duas linhas cobra atenção de todo mundo para servir a
                poucos.

                `flex-wrap` fica mesmo assim, como rede de proteção para tela
                muito estreita ou letra aumentada. */}
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-medium text-fumaca">
              <Link href="/benchmarks" className={LINK_MENU}>
                Benchmarks
              </Link>
              <Link href="/mudancas" className={LINK_MENU}>
                Mudanças
              </Link>
              <Link href="/pesquisa" className={LINK_MENU}>
                Pesquisa
              </Link>
              <Link href="/sobre" className={LINK_MENU}>
                Método
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-20 bg-carvao text-papel">
          <div className="mx-auto max-w-5xl px-5 py-12">
            <p className="max-w-leitura font-serif text-lg leading-snug">{SITE.promessa}</p>
            <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-fumaca">
              <Link href="/benchmarks" className={LINK_MENU}>
                Os números
              </Link>
              <Link href="/mudancas" className={LINK_MENU}>
                O que mudou
              </Link>
              <Link href="/pesquisa" className={LINK_MENU}>
                A pesquisa
              </Link>
              <Link href="/sobre" className={LINK_MENU}>
                O método
              </Link>
              <a href="/rss.xml" className={LINK_MENU}>
                RSS
              </a>
            </nav>
            <p className="mt-8 max-w-leitura text-xs leading-relaxed text-fumaca">
              {SITE.nome} · {SITE.dominio} · publicação independente. Não somos afiliados,
              parceiros nem representantes das plataformas citadas. Marcas e documentos
              aparecem aqui apenas como objeto de análise.
            </p>
          </div>
        </footer>

        {/* Medição de audiência da Vercel: sem cookie e sem identificar
            visitante, então não puxa banner de consentimento. É o dado que vai
            decidir o que essa audiência quer comprar. */}
        <Analytics />
      </body>
    </html>
  );
}
