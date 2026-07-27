/**
 * A faixa escura do topo, agora em todas as páginas.
 *
 * Ela nasceu na home por medição do nicho: os quatro sites que ranqueiam nos
 * nossos termos abrem com promessa de benefício sobre gradiente, e nenhum abre
 * com um dado. Repetir a faixa no resto do site é o que transforma uma boa
 * primeira tela em identidade, porque a maior parte de quem chega por busca
 * entra por um post, e não pela home.
 *
 * A faixa sangra de ponta a ponta, então a página que a usa não pode estar
 * dentro de um container com largura máxima. O padrão é `main` solto, faixa
 * primeiro, e o resto do conteúdo dentro do container de leitura.
 *
 * O rótulo de cima é escrito aqui em vez de usar o componente Etiqueta: aquele
 * usa tinta-3, que foi medida para papel e não tem contraste suficiente sobre
 * carvão.
 */
export function Faixa({
  etiqueta,
  titulo,
  texto,
  acima,
  abaixo,
}: {
  etiqueta?: string;
  titulo: React.ReactNode;
  texto?: React.ReactNode;
  /** Selos e categoria, quando a página tem. Fica acima do título. */
  acima?: React.ReactNode;
  /** Data, contagem, ações. Fica abaixo do texto. */
  abaixo?: React.ReactNode;
}) {
  return (
    <section className="bg-carvao text-papel">
      <div className="entra mx-auto max-w-5xl px-5 py-10 sm:py-14">
        {acima && <div className="mb-4 flex flex-wrap items-center gap-3">{acima}</div>}

        {etiqueta && !acima && (
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-fumaca">
            {etiqueta}
          </p>
        )}

        <h1 className="mt-3 max-w-leitura font-serif text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
          {titulo}
        </h1>

        {texto && (
          <div className="mt-4 max-w-leitura text-[15px] leading-relaxed text-fumaca">
            {texto}
          </div>
        )}

        {abaixo && <div className="mt-5 text-sm text-fumaca">{abaixo}</div>}
      </div>
    </section>
  );
}
