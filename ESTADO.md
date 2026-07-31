# Estado do projeto

Atualizado em 31 de julho de 2026.

## A correção de 30 de julho, e as duas regras que saíram dela

Fomos ler o documento oficial da política de originalidade do Instagram pela primeira
vez, e descobrimos que o acervo citava a política pelo nome sem nunca ter aberto o
documento. O texto publicado dava conselho contrário ao que o documento diz.

A correção teve duas etapas no mesmo dia, e as duas estão registradas no alto do post:
o primeiro documento encontrado era o de 2024, e publicamos o número dele; continuando a
busca, achamos o de 2026, que é o que está em vigor. As duas etapas ficaram públicas.

Duas regras nasceram daí e valem sempre:

1. **Fonte sem endereço não fecha texto.** Se não dá para linkar o documento, o texto diz
   que não achou o documento.
2. **Achar um documento não encerra a busca.** Plataforma atualiza política sem avisar
   quem escreveu antes.

A política de correção pública está em `/sobre`.

## O padrão visual do nicho, medido

Quatro concorrentes que ranqueiam nos termos do site, medidos em 30 de julho de 2026:
achadinhopro (56 gradientes), tactus (24), vendedorlucrativo (17), rallydevendas (7).
Vocabulário de venda nos quatro, botão de WhatsApp em três, e os quatro abrindo com
promessa de benefício. Nenhum abre com um número e a fonte dele. Metade já usa fundo
escuro, então escuro sozinho não diferencia.

É por isso que a faixa do topo abre com um dado e o artigo do contrato, e o site não usa
gradiente nenhum.

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
| os posts | 200, HTML |
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

Tem três partes. A tabela de números, com nove itens, cada um com o documento que o
sustenta, a data do documento, o que fazer com aquilo e o link para o texto que explica. A
calculadora de comissão média, que roda inteira no navegador e não envia nada para lugar
nenhum. E a lista de lacunas, com as sete perguntas que nenhuma fonte pública responde.

Os dados moram em `conteudo/benchmarks.md`, em cabeçalho YAML, para que apurar não exija
mexer em componente. `lib/numeros.ts` valida na leitura e quebra o build quando falta fonte,
data ou quando o número aponta para post que não existe.

## A pesquisa

Em `/pesquisa`. Sete perguntas de escolha única, toda resposta em faixa, nenhum campo
aberto, sem nome e sem e-mail. Não existe campo onde caiba dado pessoal, então o anonimato
não depende de promessa.

As respostas vão para o mesmo Redis da lista, em chave separada (`pesquisa:respostas`), como
lista e não como conjunto: duas pessoas com a mesma resposta são duas respostas.

Em 26 de julho ganhou a sétima pergunta, a faixa de comissão recebida no último mês fechado.
Ela fica por último de propósito, tem "ainda não recebi nada" para não inflar o retrato, e tem
"prefiro não dizer" para ninguém precisar mentir para conseguir enviar. Como ela entrou depois
do início da coleta, o percentual de cada pergunta é calculado sobre o número de quem
respondeu aquela pergunta, e não sobre o total da amostra.

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

**A peça guarda-chuva.** `programa-de-afiliados-shopee-como-funciona`, publicada em 26 de
julho, escrita para a pergunta com mais volume do assunto. Ela não traz apuração nova: reúne
o que os cinco posts anteriores já sustentam, com artigo e data, e amarra tudo com links
internos. Confiança **parcial**, porque mistura cláusula de contrato com leitura de campo, e
o texto diz qual é qual em cada trecho.

Foi montada com orquestração de agentes: um levantou o inventário de afirmações com trecho
literal de apoio, três escreveram estruturas independentes, três juízes com lentes distintas
escolheram uma, e dois refutadores adversariais tentaram derrubar o vencedor. Os refutadores
acharam sete e catorze problemas, todos corrigidos antes de publicar. A escrita final é
humana, sobre esse material.

O que não foi feito, e vale saber: nenhuma página tem imagem de compartilhamento própria além
da home e dos posts.

## Próximo passo decidido: o changelog de plataforma

**É por aqui que a próxima sessão começa.**

A ideia nasceu do erro de 30 de julho. Ninguém no Brasil mantém registro datado de mudança
de política da Shopee e da Meta para quem vive disso, e o mercado inteiro segue citando
versão vencida. A gente descobriu isso na marra.

O que a página é: uma linha do tempo de mudanças de regra de plataforma, cada entrada com
data da mudança, o que mudou, o documento linkado e o que ela quebra na prática de quem
opera. Já temos três entradas para nascer com conteúdo:

- 30/abr/2024, Instagram: originalidade em reels, com limiar de dez repostagens em 30 dias.
- 30/abr/2026, Instagram: expansão a fotos e carrosséis, critério passa a ser proporção.
- 1º/jul/2026, Shopee e Meta: tagueamento nativo disponível no Brasil.

Por que ela vale mais que um post: é defensável, difícil de copiar, cresce sozinha a cada
mudança, e dá motivo real para alguém voltar ao site e para assinar a lista.

Formato provável: mesmo padrão de `conteudo/benchmarks.md`, arquivo de dados com validação
na leitura, para que registrar mudança não exija mexer em componente.

### Depois do changelog, em ordem

1. **Alerta por e-mail quando um número mudar.** A lista existe e não tem uso. O motivo de
   assinar deixa de ser newsletter e passa a ser vigilância.
2. **Página de correções.** Hoje a política está em `/sobre` e a correção está no post.
   Juntar tudo numa página vira prova de honestidade, que é o ativo do site.
3. **Checklist do Status da Conta.** A descoberta de que bio e foto de perfil derrubam
   recomendação é acionável e quase ninguém sabe. Vira ferramenta de uma página.

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
