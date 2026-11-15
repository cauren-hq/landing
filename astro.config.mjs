// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// El dominio propio es la única URL canónica del sitio (dequien.app).
export default defineConfig({
  site: 'https://dequien.app',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
