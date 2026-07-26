---
# Os números da página /benchmarks.
#
# Regra desta lista: só entra número que tenha documento por trás, com nome e data.
# Estimativa de mercado, print de grupo e "ouvi dizer" não entram. O que não deu para
# confirmar vai para a lista de lacunas, no fim do arquivo, que é publicada junto.
#
# Todo item aponta para o post que explica. O leitor de `lib/numeros.ts` quebra o build
# se o post não existir, então benchmark órfão não chega ao ar.

numeros:
  - id: "comissao-base-shopee"
    valor: "3%"
    titulo: "Comissão base do afiliado Shopee"
    oQueE: "É o piso que a plataforma paga. Tudo que passa disso é Comissão Extra, bancada pelo vendedor e variável por produto. A faixa de 15% a 30% que circula em blog é o teto, não a regra."
    oQueFazer: "Calcule a sua comissão média dos últimos 90 dias. Se ela está perto de 3%, o gargalo é categoria, e trocar de categoria não custa audiência nova."
    categoria: "Afiliados"
    confianca: "verificado"
    fonte: "Termos e Condições do Programa de Afiliados Shopee, artigos 124094 e 124095"
    desde: "2026-06-30"
    post: "comissao-shopee-3-por-cento"

  - id: "janela-atribuicao-shopee"
    valor: "7 dias"
    titulo: "Janela de atribuição, por último clique"
    oQueE: "O clique marca a sessão como sua por sete dias, e vale para qualquer produto, não só o que você divulgou. Quem clicar depois de você, dentro da janela, leva a comissão inteira, e isso não aparece em relatório nenhum."
    oQueFazer: "Trate a sua comissão medida como piso. Compare posts por pedido de link, não por visualização, e teste horário perto da hora de comprar."
    categoria: "Afiliados"
    confianca: "verificado"
    fonte: "Termos e Condições do Programa de Afiliados Shopee, artigo 124094"
    desde: "2026-06-30"
    post: "shopee-janela-7-dias-ultimo-clique"

  - id: "base-de-calculo-comissao"
    valor: "Valor líquido"
    titulo: "Base de cálculo da comissão"
    oQueE: "A conta não usa o total que o cliente pagou. Sai imposto, sai cupom, sai frete. E a comissão só vale depois da entrega e da confirmação do pagamento."
    oQueFazer: "Planeje pelo validado, nunca pelo estimado do painel. Em categoria com muita devolução, como roupa e calçado, a diferença entre os dois é grande."
    categoria: "Afiliados"
    confianca: "verificado"
    fonte: "Termos e Condições do Programa de Afiliados Shopee, artigo 124094"
    desde: "2026-06-30"
    post: "comissao-shopee-3-por-cento"

  - id: "teto-por-pedido"
    valor: "Revogável"
    titulo: "A ausência de teto de comissão por pedido"
    oQueE: "O contrato descreve a ausência de teto como ação por tempo limitado. É benefício que a plataforma pode encerrar, não regra estável."
    oQueFazer: "Não use isso como premissa de plano anual. Se a sua projeção de receita depende de não haver teto, ela depende de uma decisão que não é sua."
    categoria: "Afiliados"
    confianca: "verificado"
    fonte: "Termos e Condições do Programa de Afiliados Shopee, artigo 124095"
    desde: "2026-06-30"
    post: "comissao-shopee-3-por-cento"

  - id: "tagueamento-requisitos"
    valor: "1.000 seguidores"
    titulo: "Porta de entrada do tagueamento nativo Shopee e Meta"
    oQueE: "São quatro requisitos, todos na conta: ter 18 anos ou mais, estar em Modo Profissional, ter perfil público e ter mil seguidores ou mais. Quem não bate os quatro não vê o recurso. Liberado no Brasil em 1º de julho de 2026."
    oQueFazer: "Se você bate os quatro, use etiqueta em conteúdo de decisão rápida e mantenha o pedido de link onde precisa de conversa. Os dois convivem."
    categoria: "Marketplace"
    confianca: "verificado"
    fonte: "Central de Ajuda Shopee, artigo 223917, sobre tagueamento de produtos em conteúdo Meta"
    desde: "2026-07-01"
    post: "tagueamento-nativo-shopee-meta"

  - id: "conta-agregadora-criterio"
    valor: "Proporção"
    titulo: "O critério da política de contas agregadoras do Instagram"
    oQueE: "Perfil predominantemente feito de conteúdo de terceiro perde a recomendação para quem ainda não segue. O critério é a proporção entre próprio e alheio, não a quantidade de repostagem."
    oQueFazer: "Conte quantos dos seus últimos 30 posts são material seu antes de opinar sobre a sua proporção. E aumente o numerador: postar menos repost não muda nada se o conteúdo próprio não subir."
    categoria: "Algoritmo"
    confianca: "verificado"
    fonte: "Política do Instagram sobre contas agregadoras"
    desde: "2026-04-30"
    post: "instagram-conta-agregadora"

  - id: "verificacao-negocio-meta"
    valor: "14 dias úteis"
    titulo: "Prazo de análise da verificação de negócio da Meta"
    oQueE: "É o prazo que a documentação oficial informa para a análise. A verificação é o degrau anterior ao Advanced Access, que é o que libera o webhook de comentários."
    oQueFazer: "Se a sua operação vai depender disso, entre na fila cedo. Planeje como fila sem previsão, porque o prazo é informado e o critério de aprovação não."
    categoria: "Automação"
    confianca: "verificado"
    fonte: "Documentação da Meta sobre requisitos de Advanced Access e verificação de negócio"
    desde: "2026-07-26"
    post: "manychat-limite-post-id"

  - id: "advanced-access-cnpj"
    valor: "CNPJ"
    titulo: "O que o webhook de comentários exige de verdade"
    oQueE: "Responder o link certo por publicação exige o identificador do post, que só vem pelo webhook da Meta. O webhook exige Advanced Access, que exige verificação de negócio, que exige pessoa jurídica registrada e site em HTTPS."
    oQueFazer: "Quem opera como pessoa física não passa desse portão, por mais que troque de ferramenta. Enquanto isso, aponte a automação para um endereço fixo que exibe a oferta do dia."
    categoria: "Automação"
    confianca: "verificado"
    fonte: "Documentação da Meta para webhooks de comentários do Instagram, campo comments, objeto media.id"
    desde: "2026-07-26"
    post: "manychat-limite-post-id"

lacunas:
  - pergunta: "Quanta comissão migra para outro afiliado por último clique?"
    porque: "A Shopee não reporta a venda que deixou de ser sua. Não existe forma pública de medir isso, e qualquer porcentagem que apareça por aí é chute, inclusive quando vem com gráfico."
    post: "shopee-janela-7-dias-ultimo-clique"

  - pergunta: "Quanto alcance uma conta agregadora perde?"
    porque: "A política descreve o mecanismo e o critério. A magnitude varia por conta e não é divulgada. Desconfie de quem publicar uma porcentagem exata de queda."
    post: "instagram-conta-agregadora"

  - pergunta: "A comissão do tagueamento nativo é igual à do link manual?"
    porque: "Não encontramos resposta oficial. Dá para responder sozinho comparando: uma publicação por semana com etiqueta, o resto no fluxo de sempre, comissão por publicação medida durante um mês."
    post: "tagueamento-nativo-shopee-meta"

  - pergunta: "O sub_id sobrevive ao tagueamento nativo?"
    porque: "Sem confirmação oficial. Pesa para quem compra mídia ou divide receita, porque a conversão vem e a origem se perde. É um preço alto e silencioso."
    post: "tagueamento-nativo-shopee-meta"

  - pergunta: "Qual o critério de aprovação do Advanced Access?"
    porque: "Além dos requisitos formais, não há critério objetivo nem prazo divulgado para a decisão. Quem promete aprovação em tantos dias está estimando."
    post: "manychat-limite-post-id"

  - pergunta: "Quanto cada categoria da Shopee paga hoje?"
    porque: "Muda por campanha, por vendedor e por período. Tabela publicada sem data envelhece em semanas e vira desinformação com cara de referência. Esse número está certo no seu painel."
    post: "comissao-shopee-3-por-cento"
---
