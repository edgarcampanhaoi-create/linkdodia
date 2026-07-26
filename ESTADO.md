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

## O que falta

**Ligar a captura de e-mail.** Ver `.env.example`: ou `LISTA_WEBHOOK_URL`, ou um Redis
Upstash conectado pelo painel da Vercel. O formulário só renderiza depois disso.

## Duas armadilhas do domínio, já pagas

Ficam registradas porque custaram três rodadas e voltam em qualquer projeto novo.

O domínio registrado é `linkdodia.com`. Não existe `linkdodia.com.br`, e um domínio não
registrado adicionado ao projeto fica em Invalid Configuration para sempre, sem que a tela
diga que o problema é esse.

E a Vercel recusa marcar o `www` para redirecionar ao domínio seco enquanto o domínio seco
ainda estiver marcado para redirecionar ao `www`, porque os dois juntos formam laço. A recusa
é discreta. Tem que limpar o redirecionamento do domínio seco primeiro, salvar, e só então
configurar o `www`.

## O que fica pendente de produto

- O acervo de pesquisa rende de 10 a 15 posts. Depois disso, publicação diária precisa de
  fonte nova de matéria-prima.
- O produto pago não está definido. A decisão foi adiada de propósito para ser tomada com
  dado de audiência, e o relógio começou agora, com o site no ar e o Analytics ligado.
- Falta a página de benchmarks, que é onde o produto pago vai morar.

## O projeto anterior

A Mesa, gestor de slots pagos, continua em `Desktop\CRM-Startup\mesa`, publicada e
funcional. Foi rejeitada pela usuária-zero em 26 de julho e não é mais a frente principal.
Nada dela foi apagado.
