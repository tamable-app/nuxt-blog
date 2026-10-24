import site from './site.config'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/eslint', '@nuxt/fonts', './modules/redirects'],
  devtools: { enabled: true },

  css: ['~/assets/css/tokens.css', '~/assets/css/base.css', '~/assets/css/prose.css'],

  app: {
    head: {
      htmlAttrs: { lang: site.locale },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      // Applies a saved theme before first paint, so a light-theme visitor never sees a dark flash.
      script: [{
        innerHTML: 'try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}',
        tagPosition: 'head',
      }],
    },
  },

  // Server only. Set at runtime with NUXT_TAMABLE_API_URL, NUXT_TAMABLE_READ_KEY,
  // NUXT_TAMABLE_WEBHOOK_SECRET and NUXT_DEPLOY_HOOK_URL, never baked into the build.
  runtimeConfig: {
    tamableApiUrl: 'https://api.tamable.app/api/v1',
    tamableReadKey: '',
    tamableWebhookSecret: '',
    deployHookUrl: '',
    public: {
      siteUrl: site.url,
    },
  },

  fonts: {
    families: [
      { name: 'Inter', weights: [400, 500, 600], styles: ['normal', 'italic'] },
      { name: 'JetBrains Mono', weights: [400, 500] },
    ],
  },

  typescript: {
    strict: true,
  },

  nitro: {
    // Lets a deploy script build into a fresh folder and swap it in only when the build succeeded.
    output: { dir: process.env.NUXT_OUTPUT_DIR || '.output' },
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog', '/rss.xml', '/sitemap.xml', '/robots.txt'],
      failOnError: true,
    },
  },

  routeRules: {
    '/api/content/**': { prerender: false },
    // Drafts are rendered on each request and must never be cached or indexed.
    '/preview/**': { prerender: false, headers: { 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } },
    '/api/preview': { prerender: false, headers: { 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } },
  },

  $production: {
    hooks: {
      'pages:extend'(pages) {
        const dev = pages.filter(page => page.path.startsWith('/dev'))
        dev.forEach(page => pages.splice(pages.indexOf(page), 1))
      },
    },
  },
})
