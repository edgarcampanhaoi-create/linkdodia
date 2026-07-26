# Guia editorial do Link do Dia

Regra canônica. Vale para todo texto publicado no site, para o que vai por e-mail e para o
que for gerado com ajuda de máquina.

O objetivo é simples: quem lê precisa sentir que tem um jornalista do outro lado, alguém que
apurou e escreveu. Texto que cheira a máquina derruba a percepção de valor antes mesmo do
argumento chegar. E a credibilidade é o produto que este site vende.

## A regra número um

**Nada de travessão.** Nem `—`, nem `–`. É a marca mais reconhecível de texto automático em
português. Onde ele apareceria, use vírgula, ponto final, dois-pontos ou parênteses.

Antes: `A comissão base é 3% — o resto vem do vendedor.`
Depois: `A comissão base é 3%. O resto vem do vendedor.`

Quase sempre a frase melhora, porque o travessão costuma esconder duas ideias que mereciam
duas frases.

## O que mais entrega a máquina

**A antítese em série.** "Não é sobre X, é sobre Y." Uma vez por texto passa. Três vezes vira
tique. Escreva a afirmação direta e siga.

**Negrito no meio do parágrafo.** Use negrito no máximo uma vez a cada dois ou três
parágrafos, para o dado que a pessoa vai querer copiar. Quando tudo está em negrito, nada
está.

**Trinca decorativa.** "Rápido, barato e confiável." A terceira palavra quase sempre entrou
só pelo ritmo. Corte.

**Frase de abertura genérica.** "No mundo dinâmico do marketing digital..." Comece pelo fato.
Se o texto é sobre a janela de sete dias, a primeira frase fala da janela de sete dias.

**Muleta de transição.** "Em suma", "por fim", "vale ressaltar", "é importante notar". Se a
informação é importante, escreva a informação.

**Simetria demais.** Parágrafos todos do mesmo tamanho, todos com a mesma estrutura. Texto
humano tem frase de três palavras e frase de trinta.

**Emoji e reticências.** Não neste site.

## O que fazer no lugar

**Escreva como coluna de jornal.** Abertura com o fato concreto, contexto no segundo
parágrafo, a implicação prática logo depois. Quem parar de ler no terceiro parágrafo já
levou o essencial.

**Cite o documento com o nome dele.** "O artigo 124094 dos termos do programa, atualizado em
30 de junho" vale mais que "segundo a plataforma".

**Números com origem, sempre.** Se não dá para dizer de onde veio, não entra.

**Frase curta manda.** Média de 15 a 20 palavras. Uma frase longa aqui e ali dá ritmo, desde
que a próxima seja curta.

**Voz ativa e sujeito claro.** "A Shopee revogou a regra" e não "a regra foi revogada".

**Português do Brasil, falado.** "Dá para", "acaba que", "na prática". Sem gerundismo e sem
jargão de consultoria.

## Estrutura padrão de um post

1. **Título** que diz o achado, não o assunto. "A comissão é 3%, e não 15%" em vez de "Sobre
   comissões de afiliado".
2. **Resumo** de uma ou duas frases, com o achado inteiro. Muita gente lê só isso.
3. **Abertura** com o fato, em até três frases.
4. **A citação do documento**, quando existir, em bloco.
5. **O que muda na prática**, com exemplo concreto de quem vive daquilo.
6. **O que não sabemos**, com todas as letras. Esta seção é obrigatória quando há lacuna.
7. **Fontes** no rodapé, com data.

## Antes de publicar

```bash
npm run estilo
```

O verificador quebra se achar travessão ou muleta de transição, e avisa sobre negrito demais
e frases longas demais. Ele não substitui leitura humana. Passar no verificador é o piso,
não o objetivo.
