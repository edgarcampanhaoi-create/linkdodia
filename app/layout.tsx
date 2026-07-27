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
            <nav className="flex items-center gap-5 text-sm font-medium text-fumaca">
              <Link href="/" className="transition hover:text-papel">
                Publicações
              </Link>
              <Link href="/benchmarks" className="transition hover:text-papel">
                Benchmarks
              </Link>
              <Link href="/pesquisa" className="transition hover:text-papel">
                Pesquisa
              </Link>
              <Link href="/sobre" className="transition hover:text-papel">
                Método
              </Link>
              <a href="/rss.xml" className="transition hover:text-papel">
                RSS
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-20 bg-carvao text-papel">
          <div className="mx-auto max-w-5xl px-5 py-12">
            <p className="max-w-leitura font-serif text-lg leading-snug">{SITE.promessa}</p>
            <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-fumaca">
              <Link href="/benchmarks" className="transition hover:text-papel">
                Os números
              </Link>
              <Link href="/pesquisa" className="transition hover:text-papel">
                A pesquisa
              </Link>
              <Link href="/sobre" className="transition hover:text-papel">
                O método
              </Link>
              <a href="/rss.xml" className="transition hover:text-papel">
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
