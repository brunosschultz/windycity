// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://windycity.com.br', // TODO: domínio real antes do deploy
  integrations: [sitemap()],
  build: {
    // CSS pequeno é embutido no HTML → remove request bloqueante no first paint
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: false,
});
