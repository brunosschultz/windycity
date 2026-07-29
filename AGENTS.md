## Deploy

Fluxo fixo pra qualquer alteração pedida:

1. Fazer a mudança, testar localmente (`npm run build` limpo + navegador)
   e sempre subir o preview em localhost, passando o link pro Bruno
   testar. **Nunca** fazer `git add`/`commit`/`push` sozinho, sem ele
   pedir — isso vale mesmo que a mudança pareça pronta/aprovada.
2. Só quando o Bruno mandar um comando explícito tipo "sobe", "pode
   subir", "pode subir pro Git" — aí sim fazer commit/push pra
   `origin main` **imediatamente, sem pedir confirmação de novo** (nada
   de "tem certeza?" ou re-perguntar) — o Vercel publica sozinho a
   partir do push.

Continuar perguntando antes de agir quando: (a) a mudança envolve uma
decisão de arquitetura/conteúdo com mais de um caminho razoável, (b)
o pedido for ambíguo o suficiente pra eu não ter certeza do que fazer,
ou (c) a operação for destrutiva/difícil de reverter (force-push,
apagar branch, reset --hard, etc.) — isso nunca é automático, mesmo
depois de um "sobe".

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
