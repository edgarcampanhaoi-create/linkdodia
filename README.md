# Link do Dia

Publicação de referência e benchmark sobre marketing digital, marketplaces e redes sociais.
`linkdodia.com`.

**A promessa editorial é o produto:** toda afirmação vem com a fonte, e o que não deu pra
confirmar é publicado dizendo que não deu. É isso que separa este site do resto do nicho, e
é a única coisa aqui que não se negocia.

## Publicar

Um arquivo Markdown em `conteudo/posts/`. Publicar = commit.

```markdown
---
titulo: "Título do post"
resumo: "Uma frase que explica o achado."
data: 2026-07-26
categoria: "Afiliados"
tags: ["shopee", "atribuição"]
confianca: "verificado"        # verificado | parcial | nao-confirmado
ressalva: "O que exatamente não está confirmado."
fontes:
  - texto: "Nome do documento oficial, com data"
    url: "https://..."          # opcional
---

O texto, em Markdown.
```

- `rascunho: true` no cabeçalho tira o post do ar, do RSS e do sitemap.
- Sem `data` válida ou sem `titulo`, o build **falha de propósito** — melhor quebrar no
  deploy que publicar torto.
- O selo de confiança aparece **antes** do texto. Quem lê tem direito de saber o peso do que
  vai ler antes de ler.

## Rodar

```bash
npm install
npm run dev                   # http://localhost:3000
npm run build                 # gera as páginas estáticas dos posts
node scripts/contraste.mjs    # confere a paleta em WCAG AA (falha se reprovar)
```

## Decisões que valem registro

- **Conteúdo em Markdown no repositório**, sem banco e sem CMS. Publicar vira commit: texto
  versionado, revisável, com histórico de quem mudou o quê — que é o que um site vendido
  como referência precisa poder provar. Sem banco não há o que cair. CMS por cima destes
  mesmos arquivos, quando alguém de fora precisar publicar; não antes.
- **Páginas de post são estáticas** (`generateStaticParams`): rápidas, baratas e boas de
  indexar.
- **SEO desde o primeiro dia** — sitemap, robots, RSS, canonical e JSON-LD de artigo.
  Indexação leva meses; por isso começa no dia 1, não quando "o site estiver pronto".
- **Contraste medido, não estimado.** `scripts/contraste.mjs` falha se algum par de texto
  cair abaixo de 4,5:1.
- **Nada de raspagem de plataforma.** O que se ganharia em volume se perde em risco de
  termos de uso — e em credibilidade, que aqui é o ativo.

## O que NÃO entra no site

- Número sem origem.
- Tabela sem data (comissão e regra de plataforma mudam; tabela sem data vira desinformação).
- Dado privado de operação real identificável — faturamento, custo e margem de pessoas ou
  empresas, mesmo com autorização informal.
