// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://girassolinc.com.br',
  /* A LP vive numa SUBPASTA do WordPress do cliente (Hostinger): o build
     inteiro assume /windycity como raiz. Deploy = subir o conteúdo de dist/
     para public_html/windycity/ no servidor deles. Todo caminho absoluto
     para public/ precisa do prefixo — via import.meta.env.BASE_URL nos
     componentes e literal no global.css (CSS não lê env). */
  base: '/windycity',
  integrations: [sitemap()],
  build: {
    // CSS pequeno é embutido no HTML → remove request bloqueante no first paint
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: false,
});
