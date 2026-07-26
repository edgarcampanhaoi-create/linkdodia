# Estado do projeto

Atualizado em 26 de julho de 2026.

## Onde está

**No ar**, em https://linkdodia.com.

O `www.linkdodia.com` redireciona para o domínio seco com 308, e não o contrário. Isso
importa porque as tags canônicas, o sitemap e o robots declaram o domínio seco: o endereço
que serve e o endereço que o site diz ser precisam ser o mesmo, ou o buscador recebe sinal
trocado.

O projeto na Vercel é `linkdodia`, na equipe `edgarcampanhaoi-creates-projects`, conectado ao
repositório `github.com/edgarcampanhaoi-create/linkdodia`, branch `master`. Conexão de git
significa que publicar post é fazer commit: empurrou, a Vercel constrói e troca o site.

A primeira publicação saiu do commit `9d0c322` e passou pelos dois portões do build, o de
estilo editorial e o de contraste.

## O que foi conferido no ar

Medido em `linkdodia.com`, no site publicado, não presumido.

| Rota | Resposta |
| --- | --- |
| `/` | 200, HTML |
| os cinco posts | 200, HTML |
| as quatro páginas de assunto | 200, HTML |
| `/sobre` | 200, HTML |
| `/opengraph-image` | 200, PNG de 43 KB |
| `/posts/<slug>/opengraph-image` | 200, PNG de 43 KB |
| `/sitemap.xml` | 200, com as onze URLs no domínio certo |
| `/rss.xml` | 200, RSS |
| `/robots.txt` | 200, apontando o host e o sitemap certos |
| `/icon.svg` | 200, SVG |
| rota inexistente | 404 com a página própria |

Tag canônica, `og:url` e `og:image` conferem com o endereço que serve. Nenhum erro de
console. O Analytics carrega. O formulário de e-mail não aparece, que é o comportamento
correto enquanto não houver destino configurado.

As duas rotas de imagem de compartilhamento eram a maior dúvida, porque nunca puderam rodar
na máquina de desenvolvimento: o gerador do Next falha no Windows ao resolver o caminho da
fonte. No Linux da Vercel elas respondem. A tipografia da imagem não foi comparada lado a
lado, só a geração foi medida.

## A captura de e-mail

Ligada. O Redis da Upstash (`upstash-kv-emerald-flame`) foi conectado ao projeto pelo painel
em 26 de julho, e o formulário passou a renderizar no ar, com o campo de e-mail visível e o
campo-armadilha escondido, como projetado.

A gravação foi provada de ponta a ponta, com autorização, usando o endereço fictício
`teste-linkdodia-26jul@example.com`. Ele está na lista e pode ser apagado pelo painel da
Upstash, no conjunto `lista:emails`.

O teste teve controle negativo embutido. O primeiro cadastro respondeu "Pronto! Você recebe
o próximo" e o segundo, com o mesmo endereço, respondeu "Você já estava na lista". Essa
diferença só existe se o `SADD` devolveu 0 na segunda vez, o que exige que a primeira
escrita tenha ficado gravada de verdade no Upstash. Formulário que responde sempre a mesma
coisa não prova nada.

Lembrete de operação: variável de ambiente nova só vale em publicação nova. Conectar
serviço pelo painel não muda o site sozinho.

## Duas armadilhas do domínio, já pagas

Ficam registradas porque custaram três rodadas e voltam em qualquer projeto novo.

O domínio registrado é `linkdodia.com`. Não existe `linkdodia.com.br`, e um domínio não
registrado adicionado ao projeto fica em Invalid Configuration para sempre, sem que a tela
diga que o problema é esse.

E a Vercel recusa marcar o `www` para redirecionar ao domínio seco enquanto o domínio seco
ainda estiver marcado para redirecionar ao `www`, porque os dois juntos formam laço. A recusa
é discreta. Tem que limpar o redirecionamento do domínio seco primeiro, salvar, e só então
configurar o `www`.

## A página de benchmarks

Em `/benchmarks`, ligada no menu e na lateral da home. É a página de consulta, e é onde o
produto pago vai morar.

Tem três partes. A tabela de números, com oito itens, cada um com o documento que o
sustenta, a data do documento, o que fazer com aquilo e o link para o texto que explica. A
calculadora de comissão média, que roda inteira no navegador e não envia nada para lugar
nenhum. E a lista de lacunas, com as seis perguntas que nenhuma fonte pública responde.

Os dados moram em `conteudo/benchmarks.md`, em cabeçalho YAML, para que apurar não exija
mexer em componente. `lib/numeros.ts` valida na leitura e quebra o build quando falta fonte,
data ou quando o número aponta para post que não existe.

## A pesquisa

Em `/pesquisa`. Seis perguntas de escolha única, toda resposta em faixa, nenhum campo
aberto, sem nome e sem e-mail. Não existe campo onde caiba dado pessoal, então o anonimato
não depende de promessa.

As respostas vão para o mesmo Redis da lista, em chave separada (`pesquisa:respostas`), como
lista e não como conjunto: duas pessoas com a mesma resposta são duas respostas.

O resultado aparece na página de benchmarks, e só a partir de **30 respostas**
(`MIN_RESPOSTAS`, em `lib/pesquisa-perguntas.ts`). Abaixo disso a página mostra quantas
faltam e nenhuma porcentagem. Publicar percentual de amostra pequena é o que este site acusa
os outros de fazer.

Quando publica, vai junto o que a amostra não permite dizer: leitor deste site não é amostra
aleatória do mercado, tudo é autodeclarado, e resposta anônima não dá para impedir de
repetir.

Provada de ponta a ponta em 26 de julho, com a primeira resposta real. O contador saiu de
zero para um nas duas páginas, o que confirma escrita e leitura contra o Redis de produção,
e descarta gravação duplicada. **Faltam 29 respostas** para o primeiro resultado sair.

## Busca

Passada feita em 26 de julho. O que mudou:

**Título de busca separado da manchete.** O buscador corta perto de 60 caracteres e manchete
boa passa disso. Cada post agora pode declarar `tituloSeo` e `descricaoSeo` no cabeçalho, que
valem para a aba e para o resultado de busca. A manchete inteira continua no `h1` e no
compartilhamento, que é onde ela rende. Sem esses campos, vale o título de sempre, e isso foi
testado tirando o campo de um post.

**Dado estruturado.** `lib/schema.ts` monta `WebSite` na home, `BreadcrumbList` em post,
assunto, benchmarks, pesquisa e método, e o `Article` dos posts ganhou autor, seção e
palavras-chave. O autor é a publicação, e não uma pessoa: inventar nome de autor para agradar
buscador seria mentira num site que vende conferência de fonte.

**Texto de link interno.** Na página de benchmarks, o link para o post que explica passou a
ser o título do post. "O texto que explica" não diz nada nem para quem lê nem para quem
indexa.

**Search Console.** Propriedade `https://linkdodia.com` verificada em 26 de julho, pelo
método de arquivo HTML. O arquivo é `public/google6ec048a3dfe6fea8.html` e **não pode ser
apagado**: o Google refaz essa checagem de tempos em tempos, e sem o arquivo a propriedade
cai. Está versionado, então some só se alguém apagar de propósito.

O que não foi feito, e vale saber: nenhuma página tem imagem de compartilhamento própria além
da home e dos posts, e não existe conteúdo escrito para pergunta de volume alto. Isso é
estratégia de pauta, não de código.

### O que fica pendente de produto

- O acervo de pesquisa rende de 10 a 15 posts. Depois disso, publicação diária precisa de
  fonte nova de matéria-prima.
- O produto pago não está definido. A decisão foi adiada de propósito para ser tomada com
  dado de audiência, e o relógio começou agora, com o site no ar e o Analytics ligado.
- As seis lacunas são a matéria-prima do benchmark próprio. Nenhuma se resolve lendo
  documento: só juntando medição de muita gente que opera. Esse levantamento não existe
  ainda, e a página diz isso com todas as letras.

## O projeto anterior

A Mesa, gestor de slots pagos, continua em `Desktop\CRM-Startup\mesa`, publicada e
funcional. Foi rejeitada pela usuária-zero em 26 de julho e não é mais a frente principal.
Nada dela foi apagado.
