import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Set SITE_URL when building for another address, such as the Cloudflare one.
  site: process.env.SITE_URL ?? 'https://shashankshirol.github.io',
  integrations: [sitemap()],
});
