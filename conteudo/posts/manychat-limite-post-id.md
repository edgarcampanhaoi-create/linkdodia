---
titulo: "O limite do ManyChat que quebra automação de comentário"
resumo: "A ferramenta não entrega ao fluxo qual publicação gerou o comentário. Sem isso, responder o link certo vira trabalho manual, e a saída técnica esbarra num portão da Meta que exige CNPJ."
data: 2026-07-26
categoria: "Automação"
tags: ["manychat", "instagram", "automação"]
confianca: "verificado"
ressalva: "A limitação foi confirmada por moderador da própria ManyChat na comunidade oficial. Prazo e critério de aprovação da Meta não são públicos."
fontes:
  - texto: "Comunidade oficial ManyChat, resposta de moderador sobre obter o post ID no gatilho de comentários"
    url: "https://community.manychat.com/ideas/get-post-id-for-comments-trigger-3752"
  - texto: "Documentação da Meta para webhooks de comentários do Instagram (campo comments, objeto media.id) e requisitos de Advanced Access"
---

Automação de comentário virou espinha de muita operação de venda no Instagram. A pessoa comenta uma palavra, o robô manda o link. Simples de descrever, e tem uma pedra no meio que quase ninguém menciona antes de você já ter montado tudo.

## A pedra

O ManyChat não entrega ao fluxo qual publicação gerou o comentário. Quem confirma é a própria empresa, na comunidade oficial:

> "there's no way to receive this information within ManyChat as a data field"

Sem o identificador da publicação, o fluxo sabe que alguém comentou alguma coisa em algum lugar. Não sabe em qual post.

Para quem publica um produto por dia, isso significa que o robô não consegue mandar o link certo sozinho. Alguém precisa reapontar a automação a cada publicação, na mão. Que é exatamente o trabalho que a automação existia para eliminar.

## O plano B também não fecha

A saída óbvia é buscar o dado em outro lugar e cruzar numa planilha. Não funciona. Os campos de sistema do Instagram disponíveis nesses fluxos não trazem o texto do comentário nem o identificador da publicação. Não há o que cruzar.

## A via que funciona, e o portão que ela tem

Existe caminho técnico. O webhook de comentários direto da Meta entrega o `media.id`, que é o identificador da publicação. Com ele dá para responder o link certo, automaticamente, por post.

O preço é institucional, não técnico. A corrente é esta:

1. O webhook de comentários exige Advanced Access.
2. Advanced Access exige verificação de negócio.
3. A verificação exige pessoa jurídica registrada, com documento batendo com os dados informados, e um site em HTTPS.
4. A análise leva até 14 dias úteis, segundo a documentação oficial.

Traduzindo: a automação que manda o link do post certo não é um problema de ferramenta. É um problema de CNPJ. Quem opera como pessoa física não passa desse portão, por mais que troque de plataforma.

## O que dá para fazer enquanto isso

Duas saídas funcionam sem Advanced Access.

A primeira é ter um endereço fixo que sempre mostra o conteúdo do dia. Em vez de a automação apontar para o link do post, que muda, ela aponta para um endereço que não muda, e é esse endereço que passa a exibir a oferta atual. O robô responde sempre a mesma coisa e o trabalho manual sai do fluxo.

A segunda é aceitar o cadastro manual e medir quanto ele custa de verdade. Se são dois minutos por dia, o problema é irritante e barato. Muita operação gasta semanas tentando automatizar o que consome dez minutos por semana.

## O que não é público

Não há prazo divulgado nem critério objetivo de aprovação para o Advanced Access além dos requisitos formais. Quem promete aprovação em tantos dias está estimando. Planeje como fila sem previsão, e entre nela cedo se for depender dela.
