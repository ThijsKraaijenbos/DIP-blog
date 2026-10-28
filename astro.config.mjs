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
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
