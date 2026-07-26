# Estado do projeto

Atualizado em 26 de julho de 2026.

## Onde está

O site está pronto e commitado. O repositório é
`github.com/edgarcampanhaoi-create/linkdodia`, branch `master`.

**Ainda não está publicado.** Falta uma única coisa, e ela é de acesso, não de código.

## O bloqueio, e os dois caminhos

A importação na Vercel não completou. O projeto `linkdodia` não existe na conta
(confirmado pela API, na equipe `edgarcampanhaoi-creates-projects`), e o domínio
`linkdodia.com` continua servindo o painel antigo da Mesa, respondendo 401.

Tentar publicar direto pela API também não passou: **403, "You don't have permission to
create a project"**. O token da integração lê projetos e deploys, mas não cria projeto.

**Caminho 1, o preferido.** Em https://vercel.com/new, se o `linkdodia` não aparecer na
lista de repositórios, usar o link *Adjust GitHub App Permissions* e liberar o repositório
novo. O app da Vercel no GitHub costuma estar restrito a repositórios selecionados, e o
`linkdodia` foi criado depois dessa configuração. Esse caminho deixa o projeto conectado ao
git, que é o que faz publicar post virar commit.

**Caminho 2, se o primeiro travar.** Criar um projeto vazio chamado `linkdodia` pelo painel
e então publicar pela API. O 403 foi na criação; publicar dentro de projeto existente pode
passar.

## Depois de publicar, nesta ordem

1. **Mover o domínio.** Tirar `linkdodia.com` e `www.linkdodia.com` do projeto `mesa` e
   adicionar no `linkdodia`. A Mesa continua acessível em `mesa-seven-mocha.vercel.app`.
2. **Ligar a captura de e-mail.** Sem destino configurado o formulário não aparece no site,
   de propósito. Ver `.env.example`: ou `LISTA_WEBHOOK_URL`, ou um Redis Upstash conectado
   pelo painel da Vercel.
3. **Conferir as duas rotas de imagem de compartilhamento**, `/opengraph-image` e
   `/posts/<slug>/opengraph-image`. Elas não puderam ser testadas na máquina de
   desenvolvimento porque o gerador do Next falha no Windows ao resolver a fonte. Devem
   funcionar no Linux da Vercel, mas isso é expectativa, não medição. Se falharem, trocar
   por imagem estática.

## O que fica pendente de produto

- O acervo de pesquisa rende de 10 a 15 posts. Depois disso, publicação diária precisa de
  fonte nova de matéria-prima.
- O produto pago não está definido. A decisão foi adiada de propósito para ser tomada com
  dado de audiência, e o relógio só começa quando analytics e lista estiverem no ar.
- Falta a página de benchmarks, que é onde o produto pago vai morar.

## O projeto anterior

A Mesa, gestor de slots pagos, continua em `Desktop\CRM-Startup\mesa`, publicada e
funcional. Foi rejeitada pela usuária-zero em 26 de julho e não é mais a frente principal.
Nada dela foi apagado.
