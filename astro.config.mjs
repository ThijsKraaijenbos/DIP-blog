// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` must match SITE.url in src/consts.ts (used for canonical URLs, sitemap, RSS).
export default defineConfig({
  site: 'https://www.kickbacknl.app',
  output: 'static',
  trailingSlash: 'always', // one URL per page: /blog/my-post/ (clean, no duplicates)
  integrations: [
    mdx(),
    react(),
    // Pages marked noindex stay out of the sitemap too.
    // TODO: drop the '/about/' check when noindex is removed from src/pages/about.mdx.
    sitemap({ filter: (page) => !page.includes('/styleguide/') && !page.includes('/subscribe/') && !page.includes('/about/') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
