/**
 * As perguntas da pesquisa, e a conta que transforma resposta em benchmark.
 *
 * Este arquivo é puro de propósito. Ele é lido pelo formulário, que roda no
 * navegador, e pela agregação, que roda no servidor. Se a leitura do Redis
 * estivesse aqui dentro, o formulário arrastaria credencial e `fetch` de
 * servidor para dentro do pacote do cliente. A parte que fala com o banco mora
 * em `lib/pesquisa.ts`, e só o servidor a importa.
 *
 * Toda pergunta é de escolha única e toda resposta é faixa, nunca número exato.
 * Faixa responde a pergunta que interessa e não guarda nada que identifique
 * quem respondeu. Ninguém precisa confiar na nossa palavra sobre anonimato: não
 * há campo onde caiba um dado pessoal.
 */

export type Opcao = { id: string; rotulo: string };

export type Pergunta = {
  id: string;
  texto: string;
  ajuda?: string;
  opcoes: Opcao[];
};

/**
 * Piso para publicar o resultado.
 *
 * Abaixo disso a página mostra quantas respostas faltam e não mostra
 * porcentagem nenhuma. Publicar percentual de oito respostas é exatamente o que
 * este site acusa os outros de fazer.
 */
export const MIN_RESPOSTAS = 30;

export const PERGUNTAS: Pergunta[] = [
  {
    id: "plataforma",
    texto: "Qual plataforma responde pela maior parte da sua comissão?",
    opcoes: [
      { id: "shopee", rotulo: "Shopee" },
      { id: "mercado-livre", rotulo: "Mercado Livre" },
      { id: "amazon", rotulo: "Amazon" },
      { id: "magalu", rotulo: "Magalu" },
      { id: "outra", rotulo: "Outra" },
    ],
  },
  {
    id: "comissao",
    texto: "Nos últimos 90 dias, qual foi a sua comissão média?",
    ajuda:
      "Comissão recebida dividida pelo valor dos pedidos. A calculadora da página de benchmarks faz essa conta.",
    opcoes: [
      { id: "ate-3", rotulo: "Até 3%" },
      { id: "3-a-6", rotulo: "Entre 3% e 6%" },
      { id: "6-a-10", rotulo: "Entre 6% e 10%" },
      { id: "10-a-15", rotulo: "Entre 10% e 15%" },
      { id: "acima-15", rotulo: "Acima de 15%" },
      { id: "nao-sei", rotulo: "Não tenho esse número" },
    ],
  },
  {
    id: "categoria",
    texto: "Qual categoria paga a maior parte da sua comissão?",
    ajuda: "A que paga, não a que você mais posta. Costumam ser diferentes.",
    opcoes: [
      { id: "casa", rotulo: "Casa e cozinha" },
      { id: "moda", rotulo: "Moda e calçados" },
      { id: "beleza", rotulo: "Beleza" },
      { id: "eletronicos", rotulo: "Eletrônicos" },
      { id: "infantil", rotulo: "Infantil" },
      { id: "pet", rotulo: "Pet" },
      { id: "outra", rotulo: "Outra" },
    ],
  },
  {
    id: "conteudo-proprio",
    texto: "Dos seus últimos 30 posts, quantos são material gravado por você?",
    ajuda: "Conte antes de responder. Quase todo mundo erra essa estimativa para menos.",
    opcoes: [
      { id: "menos-25", rotulo: "Menos de um quarto" },
      { id: "25-a-50", rotulo: "Entre um quarto e metade" },
      { id: "50-a-75", rotulo: "Entre metade e três quartos" },
      { id: "mais-75", rotulo: "Mais de três quartos" },
    ],
  },
  {
    id: "tagueamento",
    texto: "Você usa o tagueamento nativo de produto na publicação?",
    opcoes: [
      { id: "nao-conheco", rotulo: "Não conheço" },
      { id: "nao-bato-requisitos", rotulo: "Não bato os requisitos" },
      { id: "testei-e-mantive", rotulo: "Testei e mantive" },
      { id: "testei-e-abandonei", rotulo: "Testei e abandonei" },
      { id: "uso-sempre", rotulo: "Uso em tudo" },
    ],
  },
  {
    id: "tamanho",
    texto: "Qual o tamanho da sua audiência principal?",
    opcoes: [
      { id: "ate-1k", rotulo: "Até mil" },
      { id: "1k-a-10k", rotulo: "De mil a dez mil" },
      { id: "10k-a-50k", rotulo: "De dez mil a cinquenta mil" },
      { id: "50k-a-200k", rotulo: "De cinquenta mil a duzentos mil" },
      { id: "acima-200k", rotulo: "Acima de duzentos mil" },
    ],
  },
  /**
   * A pergunta que responde a busca com mais procura do assunto, e a mais
   * delicada do conjunto. Fica por último de propósito: quem chegou até aqui já
   * respondeu seis, e pedir o número de dinheiro na primeira tela derrubaria a
   * resposta inteira.
   *
   * Três cuidados que mudam o resultado. "Ainda não recebi nada" existe porque
   * quem ganha zero é parte do retrato, e uma pesquisa que só ouve quem ganha
   * publica um número inflado. "Prefiro não dizer" existe para a pessoa não ter
   * que mentir para conseguir enviar. E a faixa é de comissão recebida, não de
   * faturamento, porque é o que a pessoa consegue responder sem consultar nada.
   */
  {
    id: "ganho",
    texto: "No último mês fechado, quanto de comissão você recebeu?",
    ajuda:
      "A comissão que entrou de verdade, e não a estimada do painel. Faixa larga, sem centavos, e tem opção para quem prefere não responder.",
    opcoes: [
      { id: "nada", rotulo: "Ainda não recebi nada" },
      { id: "ate-100", rotulo: "Até R$ 100" },
      { id: "100-a-500", rotulo: "De R$ 100 a R$ 500" },
      { id: "500-a-2k", rotulo: "De R$ 500 a R$ 2 mil" },
      { id: "2k-a-5k", rotulo: "De R$ 2 mil a R$ 5 mil" },
      { id: "5k-a-20k", rotulo: "De R$ 5 mil a R$ 20 mil" },
      { id: "acima-20k", rotulo: "Acima de R$ 20 mil" },
      { id: "nao-digo", rotulo: "Prefiro não dizer" },
    ],
  },
];

export type Resposta = Record<string, string>;

/**
 * Aceita só o que está no cardápio.
 *
 * Resposta com pergunta faltando ou com opção inventada é descartada inteira,
 * em vez de guardada pela metade. Linha incompleta no banco vira asterisco na
 * conta seis meses depois, quando ninguém lembra por quê.
 */
export function validarResposta(bruto: Record<string, unknown>): Resposta | null {
  const limpa: Resposta = {};

  for (const pergunta of PERGUNTAS) {
    const valor = bruto[pergunta.id];
    if (typeof valor !== "string") return null;
    if (!pergunta.opcoes.some((o) => o.id === valor)) return null;
    limpa[pergunta.id] = valor;
  }

  return limpa;
}

export type OpcaoContada = {
  id: string;
  rotulo: string;
  quantos: number;
  /** Inteiro de 0 a 100. Casa decimal em amostra pequena é falsa precisão. */
  percentual: number;
};

export type PerguntaContada = {
  id: string;
  texto: string;
  /**
   * Quantas respostas responderam ESTA pergunta.
   *
   * Não é sempre o total da amostra. Pergunta acrescentada depois do começo da
   * coleta só existe nas respostas posteriores, e dividir pelo total faria toda
   * opção dela parecer menor do que é. O percentual desta pergunta se calcula
   * sobre este n, e a página mostra o n de cada uma.
   */
  n: number;
  opcoes: OpcaoContada[];
};

export type Agregado = {
  n: number;
  publicavel: boolean;
  faltam: number;
  perguntas: PerguntaContada[];
};

export function agregar(respostas: Resposta[]): Agregado {
  const n = respostas.length;

  const perguntas = PERGUNTAS.map((pergunta) => {
    const responderam = respostas.filter((r) =>
      pergunta.opcoes.some((o) => o.id === r[pergunta.id]),
    ).length;

    return {
      id: pergunta.id,
      texto: pergunta.texto,
      n: responderam,
      opcoes: pergunta.opcoes.map((opcao) => {
        const quantos = respostas.filter((r) => r[pergunta.id] === opcao.id).length;
        return {
          id: opcao.id,
          rotulo: opcao.rotulo,
          quantos,
          percentual: responderam > 0 ? Math.round((quantos / responderam) * 100) : 0,
        };
      }),
    };
  });

  return {
    n,
    publicavel: n >= MIN_RESPOSTAS,
    faltam: Math.max(0, MIN_RESPOSTAS - n),
    perguntas,
  };
}
