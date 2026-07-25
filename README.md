# WindyCity — LP de conversão

Landing page do empreendimento WindyCity (Girassol Incorporações, Curitiba/PR).

- **Stack:** Astro 7 (build estático, zero JS de framework) + CSS puro
- **Conteúdo:** fiel ao wireframe aprovado pelo cliente — nada foi alterado ou inventado
- **Design:** aplicação do `../design-system.md` (paleta, Sora + Times italic, colorblocking)

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera ./dist
npm run preview  # serve o build de produção
```

## Performance (build de produção, medido)

| Métrica | Valor |
|---|---|
| Primeira carga | **129 KB** / 8 requests |
| HTML (comprimido) | 17 KB |
| Fontes (5 woff2 subsetadas) | 68 KB |
| CSS | 7 KB |
| Imagem do hero (AVIF) | 35 KB |
| JS de runtime | ~1,4 KB inline (sem framework) |
| `dist/` total | 5,3 MB |

Decisões que sustentam esses números:

- **Sem GSAP/ScrollTrigger.** As animações usam IntersectionObserver +
  `transform`/`opacity` (só compositor). Custo ~1,4 KB contra ~70 KB do GSAP —
  diferença relevante com 80% de acesso mobile.
- **Fontes subsetadas.** TTF originais (~900 KB) → woff2 com charset PT-BR (67 KB).
- **`fallbackFormat="webp"`.** O padrão do Astro gerava PNGs de fallback de até
  4,6 MB (73 MB no `dist`). Com WebP o build caiu 93%.
- **`prefers-reduced-motion`** respeitado em todas as animações.

## O que falta para publicar

### 1. Dados de negócio — `src/config.ts`

Tudo entre colchetes veio assim do wireframe. Alterar **apenas** nesse arquivo:

| Campo | Situação |
|---|---|
| `CONTATO.whatsapp` | `null` — enquanto não houver número, todo CTA leva ao formulário e o form avisa em vez de abrir link quebrado |
| `CONTATO.cnpj` | `[00.000.000/0000-00]` |
| `CONTATO.email` | placeholder |
| `CONTATO.endereco` | `[Endereço da obra — a confirmar]` |
| `SITE.url` | `https://windycity.com.br` — trocar pelo domínio real (canonical, OG, sitemap) |

Também pendentes no conteúdo da página:

- Faixa de valores (`[R$ valor mínimo]` / `[R$ valor máximo]`) — em `Condicoes.astro`
- `[X anos]` de experiência da equipe técnica — em `Credibilidade.astro`
  (o próprio wireframe marca "confirmar número exato")

### 2. Mídia — imagens provisórias a trocar

Não há mais caixas tracejadas: todos os espaços foram preenchidos com renders
reais do empreendimento. O que ainda precisa ser **substituído** pelo material
definitivo:

| Onde | Hoje | Deve virar |
|---|---|---|
| `Localizacao.astro` | Render noturno da fachada | Mapa do entorno com raio de caminhada |
| `Credibilidade.astro` | `fachada-02` com botão de play | Vídeo institucional real |
| `Credibilidade.astro` | `fachada-03` + `fachada-05` | Fotos da obra e imagens de drone |
| `Credibilidade.astro` | Linhas com ícone de play | Depoimentos em vídeo |

Trocar a imagem = trocar o `import` no topo do componente. Os recortes,
proporções e o parallax continuam funcionando.

### 3. SEO / GEO já configurado

- Metadados completos (title, description, canonical, OG, Twitter)
- JSON-LD: `Organization`, `WebSite`, `ApartmentComplex` — **sem** preço, telefone,
  CNPJ ou endereço enquanto forem placeholder (schema com dado falso é penalizado)
- `sitemap-index.xml` + `robots.txt` gerados no build
- 1 único `<h1>`, hierarquia de headings correta, `alt` em todas as imagens

## Estrutura

```
src/
  config.ts              ← dados de negócio pendentes (fonte única)
  layouts/Base.astro     ← <head>, SEO, JSON-LD, runtime JS
  styles/global.css      ← tokens do design system + animações
  components/
    Header · Hero · Localizacao · Diferenciais · AreasComuns
    Tipologias · Credibilidade · Condicoes · CtaFinal · Footer
    CtaFlutuante · Placeholder · Logo
  assets/images/         ← renders e plantas (otimizados no build)
public/fonts/            ← Sora 400/600/700/800 + Times Italic (woff2)
```
