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

A tabela acima é a medição de 26 de julho, e as onze URLs do sitemap são as daquele dia. Com
os posts publicados depois e com o registro de mudanças, o sitemap no ar tem dezoito, medido
em 31 de julho.

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

## O registro de mudanças de regra

Em `/mudancas`, feito em 31 de julho, ligado no menu, no rodapé e na lateral da home. É a
página que nasceu do erro de 30 de julho: ninguém mantém em português o registro datado de
mudança de política da Shopee e da Meta, e por isso conselho vencido circula por anos com
cara de novidade.

Nasce com quatro entradas, todas com documento: o tagueamento nativo liberado no Brasil em
1º de julho de 2026, a versão de 30 de junho de 2026 dos termos do programa de afiliados, a
regra de originalidade do Instagram de 30 de abril de 2026, e a versão anterior dela, de 30
de abril de 2024. Cada entrada traz o que mudou, a fonte e o que aquilo quebra na prática de
quem opera.

Duas decisões sustentam a página, e valem para toda entrada nova.

**Regra vencida não é apagada.** Ela fica no ar marcada, com a data em que foi substituída e
um link para a que vale. Quem procura "dez reposts em 30 dias" precisa achar exatamente
isso, e ser levado dali para o critério atual. Apagar seria repetir, do outro lado, o erro
que criou a página.

**O post que explica é opcional.** Registrar a mudança no dia em que ela acontece vale mais
que esperar o texto ficar pronto, porque a velocidade é metade do valor do registro. Quando
o slug existe, ele precisa apontar para post publicado, como no resto do site.

Os dados moram em `conteudo/mudancas.md` e `lib/mudancas.ts` valida na leitura, no mesmo
padrão dos benchmarks. A validação foi provada com controle negativo em 31 de julho: sete
corrupções propositais no arquivo (substituta inexistente, substituta mais antiga que a
substituída, post não publicado, entrada sem fonte, confiança inventada, data fora do
formato e id repetido), e as sete quebraram com a mensagem certa. O arquivo foi restaurado
em seguida. Validação que ninguém tentou furar é decoração.

O arquivo também passou a ser alvo do portão de estilo, junto com os posts e a lista de
benchmarks.

## O alerta por e-mail

Escrito em 31 de julho. O código está pronto e provado; **falta configuração para ligar**, e
o que falta está listado no fim desta seção.

A rota `/api/alerta` roda uma vez por dia, chamada pelo cron da Vercel (`vercel.json`, às 12h
UTC, que é 9h de Brasília). Ela lê o que está publicado, compara com o registro do que já saiu
e manda só a diferença. Três coisas disparam aviso: entrada nova no registro de mudanças,
número do benchmark que mudou de valor, de fonte ou de data, e publicação nova.

`lib/alerta.ts` decide o que é novidade e escreve o texto, sem banco e sem rede, para poder
ser testado. `lib/alerta-envio.ts` é o que fala com o Redis e com o Resend. Onze testes cobrem
a decisão de quem recebe e-mail e por quê.

Quatro armadilhas foram fechadas de propósito, e cada uma custaria caro:

**A primeira rodada não envia nada.** Se o registro `alerta:visto` estiver vazio, ela grava o
que existe e sai calada. Sem isso, ligar o alerta despacharia o acervo inteiro para quem
assinou esperando ser avisado do que muda daqui em diante.

**Acerto de texto não vira e-mail.** A impressão de uma entrada do registro e de um post
ignora o conteúdo. Só o número leva valor, fonte e data na impressão, porque é disso que a
lista quer ser avisada.

**A saída da lista não acontece ao abrir o link.** Programa de e-mail e antivírus visitam
sozinhos os endereços de uma mensagem, então a baixa fica atrás de um botão, em `/sair/<ficha>`.
O caminho de um clique existe pelo cabeçalho `List-Unsubscribe-Post`, que é o botão que o
Gmail mostra, e ele responde em `POST /api/sair`.

**O endereço nunca vai na URL.** O que viaja é uma ficha opaca, guardada em `lista:tokens`, e
a página mostra o endereço encoberto.

Medido em 31 de julho, no servidor rodando: sem `CRON_SECRET` a rota responde 503 e fica
fechada; com segredo configurado, chamada sem cabeçalho e com segredo errado respondem 401; com
o segredo certo responde 200 dizendo o que falta para enviar. Ficha malformada em `/api/sair`
responde 404 sem tocar no banco, e só POST é aceito, com 405 no GET. Uma amostra do e-mail foi
gerada com o conteúdo real, sem enviar para ninguém.

`/sair` e `/api` saíram do índice, no `robots.txt`.

### Por que o Resend não veio pelo Marketplace

A descoberta de 31 de julho: pelo Marketplace da Vercel, o Resend só tem plano Pro, a US$ 20
por mês, e Scale, a US$ 90. Não existe faixa gratuita por esse caminho. Direto no Resend
existe: 3.000 e-mails por mês e 100 por dia, com um domínio.

A lista de hoje tem poucos endereços e o alerta só dispara quando algo muda, então a faixa
gratuita sobra com folga. A decisão foi conta direta, e o que se perde é a cobrança unificada
e o provisionamento automático da chave, que não valem US$ 240 por ano nesta etapa.

Se um dia o volume justificar, migrar é trocar o valor de uma variável.

### O que já está configurado

`ALERTA_DE` e `CRON_SECRET` foram criadas em 31 de julho, **só no ambiente de produção**. Isso
é de propósito: deploy de pré-visualização não pode ter segredo válido, ou qualquer
pré-visualização vira um botão de disparar e-mail para a lista real.

Também ficou confirmado que a produção usa os nomes `KV_REST_API_URL` e `KV_REST_API_TOKEN`,
e não `UPSTASH_REDIS_REST_*`. Ler as duas grafias em `lib/redis.ts` não era precaução vazia.

### A armadilha do PowerShell, já paga

Criar variável de ambiente mandando o valor por cano no PowerShell acrescenta um retorno de
carro invisível no fim. A Vercel recusa a publicação inteira com "contains leading or trailing
whitespace, which is not allowed in HTTP header values", e a mensagem não diz que o culpado é
o terminal. Custou uma publicação quebrada em 31 de julho.

O jeito certo, no Git Bash:

```
printf '%s' "$VALOR" | vercel env add NOME production
```

O `printf` sem `\n` é o detalhe que importa. `echo` do PowerShell manda `\r\n`, e a Vercel
apara o `\n` e deixa o `\r`.

### O que falta para ligar

1. **Criar a conta no Resend**, em resend.com, na faixa gratuita.
2. **Adicionar e verificar o domínio `linkdodia.com`**, com os registros de DNS que o painel
   do Resend indicar. Sem domínio verificado o envio é recusado.
3. **Gerar a chave de API e colocá-la no projeto**, como `RESEND_API_KEY`, em produção.
   Credencial não passa por conversa nem por commit.
4. **Publicar depois disso.** Variável de ambiente nova só vale em publicação nova.

Antes do primeiro envio de verdade, chamar `/api/alerta?ensaio=1` com o segredo no cabeçalho
`Authorization: Bearer`. O ensaio faz a rodada inteira sem enviar e sem gravar, e devolve o
que sairia. É a única forma de conferir isto em produção sem usar a caixa de e-mail de gente
real como ambiente de teste.

Medido em produção em 31 de julho, com as duas variáveis já no ar: sem cabeçalho a rota
responde 401, e com o segredo responde 200 dizendo que falta apenas `RESEND_API_KEY`. O Redis
não aparece na lista de faltas, o que confirma que a rota alcança o banco de produção.

## Próximo passo, em ordem

**É por aqui que a próxima sessão começa.**

1. **Página de correções.** Hoje a política está em `/sobre` e a correção está no post.
   Juntar tudo numa página vira prova de honestidade, que é o ativo do site.
2. **Checklist do Status da Conta.** A descoberta de que bio e foto de perfil derrubam
   recomendação é acionável e quase ninguém sabe. Vira ferramenta de uma página.
3. **Imagem de compartilhamento própria** para `/mudancas` e `/benchmarks`. Hoje só a home e
   os posts têm.

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
