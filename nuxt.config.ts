// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  app: {
    head: {
      script: [
        {
          type: 'module',
          src: 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'
        }
      ]
    }
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'model-viewer'
    }
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],

  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'VGU Interactive Labs',
      short_name: 'VGU Labs',
      theme_color: '#0F1E36',
      background_color: '#070A12',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,avif,ico,json}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'map-tiles-cache',
            expiration: {
              maxEntries: 150,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
            }
          }
        }
      ]
    }
  }
})
