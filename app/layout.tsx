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
    default: `${SITE.nome} — benchmark e referência para quem vende online`,
    template: `%s · ${SITE.nome}`,
  },
  description: SITE.descricao,
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
        <header className="border-b border-risco">
          <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-4 px-5 py-4">
            <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
              Link do Dia
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-tinta-2">
              <Link href="/" className="hover:text-tinta">
                Publicações
              </Link>
              <Link href="/sobre" className="hover:text-tinta">
                Método
              </Link>
              <a href="/rss.xml" className="hover:text-tinta">
                RSS
              </a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-20 border-t border-risco">
          <div className="mx-auto max-w-5xl px-5 py-10">
            <p className="max-w-leitura text-sm leading-relaxed text-tinta-2">
              {SITE.promessa}
            </p>
            <p className="mt-4 text-xs text-tinta-3">
              {SITE.nome} · {SITE.dominio} · publicação independente. Não somos afiliados,
              parceiros nem representantes das plataformas citadas; marcas e documentos são
              referenciados apenas para análise.
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
