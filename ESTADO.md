# Estado do projeto

Atualizado em 26 de julho de 2026.

## Onde está

**No ar**, em https://linkdodia.vercel.app.

O projeto na Vercel é `linkdodia`, na equipe `edgarcampanhaoi-creates-projects`, conectado ao
repositório `github.com/edgarcampanhaoi-create/linkdodia`, branch `master`. Conexão de git
significa que publicar post é fazer commit: empurrou, a Vercel constrói e troca o site.

A primeira publicação saiu do commit `9d0c322` e passou pelos dois portões do build, o de
estilo editorial e o de contraste.

## O que foi conferido no ar

Medido no site publicado, não presumido.

| Rota | Resposta |
| --- | --- |
| `/` | 200, HTML |
| `/posts/comissao-shopee-3-por-cento` | 200, HTML |
| `/categoria/afiliados` | 200, HTML |
| `/sobre` | 200, HTML |
| `/opengraph-image` | 200, PNG de 43 KB |
| `/posts/<slug>/opengraph-image` | 200, PNG de 43 KB |
| `/sitemap.xml` | 200, XML |
| `/rss.xml` | 200, RSS |
| `/robots.txt` | 200 |
| `/icon.svg` | 200, SVG |
| rota inexistente | 404 com a página própria |

Nenhum erro de console. O Analytics carrega. O formulário de e-mail não aparece, que é o
comportamento correto enquanto não houver destino configurado.

As duas rotas de imagem de compartilhamento eram a maior dúvida, porque nunca puderam rodar
na máquina de desenvolvimento: o gerador do Next falha no Windows ao resolver o caminho da
fonte. No Linux da Vercel elas respondem. A tipografia da imagem não foi comparada lado a
lado, só a geração foi medida.

## O que falta, nesta ordem

1. **Mover o domínio.** Hoje `linkdodia.com` ainda serve o painel antigo da Mesa. Tirar
   `linkdodia.com` e `www.linkdodia.com` do projeto `mesa` e adicionar no `linkdodia`. Isso
   é trabalho de painel: o token da integração não cria projeto nem administra domínio.
   A Mesa continua acessível em `mesa-seven-mocha.vercel.app`.

   Tem pressa moderada. As tags canônicas do site já apontam para `linkdodia.com`, então
   enquanto o domínio não mudar de dono o buscador recebe uma indicação que não confere com
   o que está publicado.

2. **Ligar a captura de e-mail.** Ver `.env.example`: ou `LISTA_WEBHOOK_URL`, ou um Redis
   Upstash conectado pelo painel da Vercel. O formulário só renderiza depois disso.

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
