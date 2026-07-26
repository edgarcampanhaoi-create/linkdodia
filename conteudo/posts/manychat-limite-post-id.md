---
titulo: "O limite do ManyChat que quebra automação de comentário — e por que o plano B também morre"
resumo: "A ferramenta não entrega o identificador da publicação para o fluxo. Sem isso, responder \"o link do post certo\" vira cadastro manual — e a saída passa por um portão da Meta que exige CNPJ."
data: 2026-07-26
categoria: "Automação"
tags: ["manychat", "instagram", "automação"]
confianca: "verificado"
ressalva: "A limitação foi confirmada por moderador da própria ManyChat na comunidade oficial. Prazos e critérios de aprovação da Meta não são públicos."
fontes:
  - texto: "Comunidade oficial ManyChat — resposta de moderador sobre obter o post ID no gatilho de comentários"
    url: "https://community.manychat.com/ideas/get-post-id-for-comments-trigger-3752"
  - texto: "Documentação da Meta para webhooks de comentários do Instagram (campo comments, objeto media.id) e requisitos de Advanced Access"
---

Automação de comentário é a espinha de muita operação de vendas no Instagram: a pessoa comenta uma palavra, o robô manda o link. Simples de descrever, e tem uma pedra no meio que quase ninguém menciona antes de você já ter montado tudo.

## A pedra

O ManyChat **não entrega ao fluxo qual publicação gerou o comentário**. A confirmação é da própria empresa, na comunidade oficial:

> "there's no way to receive this information within ManyChat as a data field"

Sem o identificador da publicação, o fluxo sabe que **alguém comentou algo em algum lugar** — e não sabe em qual post. Se você publica um produto por dia, isso significa que o robô não consegue mandar o link certo sozinho: alguém tem que reapontar a automação a cada publicação, na mão.

Que é exatamente o trabalho que a automação existia para eliminar.

## O plano B também não fecha

A saída óbvia é procurar o dado em outro lugar: guardar numa planilha e cruzar. Não funciona — os campos de sistema do Instagram disponíveis nesses fluxos **não trazem nem o texto do comentário nem o identificador da publicação**. Não há o que cruzar.

## A via que funciona (e o portão que ela tem)

Existe caminho técnico: o **webhook de comentários direto da Meta**, que entrega o `media.id` — o identificador da publicação. Com ele, dá para responder com o link certo, automaticamente, por post.

O preço é institucional, não técnico:

- o webhook de comentários exige **Advanced Access**;
- Advanced Access exige **verificação de negócio**;
- verificação de negócio exige **pessoa jurídica registrada**, com documento (contrato social ou alvará) batendo com os dados informados, e um site em HTTPS;
- a análise leva **até 14 dias úteis**, segundo a documentação oficial.

Ou seja: a automação "manda o link do post certo" **não é um problema de ferramenta — é um problema de CNPJ**. Quem opera como pessoa física não passa desse portão, por mais que troque de plataforma.

## O que fazer enquanto isso

Duas saídas que funcionam sem Advanced Access:

1. **Um endereço fixo que sempre mostra o conteúdo do dia.** Em vez de a automação apontar para o link do post (que muda), ela aponta para um endereço que não muda — e é esse endereço que passa a mostrar a oferta atual. O robô responde sempre a mesma coisa, e o trabalho manual sai do fluxo.
2. **Aceitar o cadastro manual, mas medir quanto ele custa.** Se são dois minutos por dia, o problema é irritante e barato. Boa parte das operações gasta semanas tentando automatizar algo que custa dez minutos por semana.

## O que não é público

Não há prazo divulgado nem critério objetivo de aprovação para Advanced Access além dos requisitos formais. Quem promete "aprovação em X dias" está estimando. Planeje como fila sem previsão — e comece por ela cedo, se for depender dela.
