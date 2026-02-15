import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SUPPORTED_LOCALES = [
  'en', 'es', 'pt-br', 'fr', 'de', 'it',
  'ar', 'hi', 'ja', 'ko', 'ru', 'tr', 'id', 'zh-hans',
  'pl', 'nl', 'th', 'sv', 'ro', 'el', 'cs', 'hu', 'uk', 'bn', 'vi'
];

export default defineConfig({
  site: 'https://calchub.com',

  integrations: [
    preact({ compat: false }),
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: Object.fromEntries(
          SUPPORTED_LOCALES.map(l => [l, l])
        ),
      },
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: SUPPORTED_LOCALES,
    routing: {
      prefixDefaultLocale: true,
    },
  },

  build: {
    format: 'directory',
  },

  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
});
