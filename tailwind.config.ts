import type { Config } from "tailwindcss";

/**
 * Link do Dia — identidade.
 *
 * O conceito é **papel de pesquisa que se lê no celular**: tinta quase preta em
 * papel quente, uma cor de destaque só, tipografia editorial. Nada de dashboard
 * colorido — o que se vende aqui é credibilidade, e credibilidade se comunica
 * por sobriedade e por mostrar a fonte, não por gradiente.
 *
 * O contraste de cada par está medido em `scripts/contraste.mjs` (WCAG 2.1,
 * mínimo 4,5:1 para texto normal). Quem mexer na paleta refaz a conta.
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        papel: {
          DEFAULT: "#fbfaf7", // fundo
          alto: "#ffffff", // cartão
          fundo: "#f2efe9", // faixa de realce
        },
        tinta: {
          DEFAULT: "#14100e", // texto
          2: "#544c46", // secundário
          3: "#7a716a", // legenda
        },
        farol: {
          DEFAULT: "#1746c4", // link e ação
          claro: "#e8edfb",
        },
        brasa: {
          DEFAULT: "#a8390f", // sinal de tendência/ressalva
          claro: "#fbeae2",
        },
        risco: "#e4ded4", // linhas
        /**
         * Faixa escura do topo.
         *
         * O nicho inteiro abre com promessa de benefício sobre gradiente. Medimos
         * quatro concorrentes que ranqueiam nos nossos termos: 56, 24, 17 e 7
         * elementos com gradiente, e vocabulário de venda em todos. A saída não é
         * ser mais colorido que eles, é abrir com um número e a fonte dele.
         *
         * Contraste de cada par medido em scripts/contraste.mjs.
         */
        carvao: {
          DEFAULT: "#141110", // fundo da faixa
          2: "#241f1c", // cartão dentro da faixa
        },
        fumaca: "#a49a92", // texto secundário sobre carvão, 6,82:1
        "farol-alto": "#8ea9ff", // ação e link sobre carvão, 8,30:1
      },
      fontFamily: {
        serif: ["var(--fonte-serif)", "Georgia", "serif"],
        sans: ["var(--fonte-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        leitura: "68ch",
      },
    },
  },
  plugins: [],
};
export default config;
