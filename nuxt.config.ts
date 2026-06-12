// https://nuxt.com/docs/api/configuration/nuxt-config
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Helper to recursively find markdown files in content/labs
function getLabRoutes() {
  const routes: string[] = []
  const labsDir = path.resolve(__dirname, 'content/labs')
  if (!fs.existsSync(labsDir)) return routes

  function traverse(dir: string) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (file.endsWith('.md')) {
        const id = file.replace(/\.md$/, '')
        routes.push(`/tour/${id}`)
      }
    }
  }
  
  traverse(labsDir)
  return routes
}

// Helper to find equipment markdown files
function getEquipmentRoutes() {
  const routes: string[] = []
  const equipDir = path.resolve(__dirname, 'content/equipment')
  if (!fs.existsSync(equipDir)) return routes

  const files = fs.readdirSync(equipDir)
  for (const file of files) {
    if (file.endsWith('.md') && file !== 'schema-guide.md') {
      const id = file.replace(/\.md$/, '')
      routes.push(`/equipment/${id}`)
    }
  }
  return routes
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700;800&display=swap'
        }
      ],
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

  runtimeConfig: {
    public: {
      // Set to true to filter map and sidebar to only show laboratory rooms that have machines
      displayOnlyRoomsWithMachines: true,
      mapZoomedInThreshold: 17.4,
      defaultZoomLevel: 17.5
    }
  },

  devtools: { enabled: true },

  hooks: {
    'build:before'() {
      console.log('Nuxt Hook: Regenerating floorplan GeoJSON files from CAD CSV sources...')
      try {
        execSync('node scripts/parse-floorplans.js', { stdio: 'inherit' })
      } catch (err) {
        console.error('Failed to run floorplans parser script', err)
      }
    }
  },

  css: [
    'maplibre-gl/dist/maplibre-gl.css',
    '~/assets/css/main.css'
  ],

  pwa: {
    // 1. Serve PWA manifest statically for Cloudflare Pages static hosting compatibility
    registerWebManifestInRouteRules: false,

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
      // 2. Explicitly hide Cloudflare's edge worker from Workbox
      globIgnores: [
        '**/_worker.js',
        '**/_worker.js/**/*'
      ],
      // 3. Prevent the Service Worker from intercepting API or SSR requests
      navigateFallbackDenylist: [
        /^\/api\//,
        /^\/_nitro\//
      ],
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
        },
        {
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 Year
            }
          }
        },
        {
          urlPattern: /^https:\/\/ajax\.googleapis\.com\/ajax\/libs\/model-viewer\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'model-viewer-assets-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
            }
          }
        },
        {
          urlPattern: /^\/data\/floorplans\/.*\.json$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'floorplans-data-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 Days
            }
          }
        },
        {
          urlPattern: /^\/images\/.*\.(?:png|jpg|jpeg|svg|avif|webp|gif)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'local-images-cache',
            expiration: {
              maxEntries: 80,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
            }
          }
        }
      ]
    }
  },

  image: {
    // Use 'ipx' in all environments to support static image prerendering at build/generation time.
    // This enables image optimization on Cloudflare Pages free tier without paid Cloudflare resizing.
    provider: 'ipx'
  },

  nitro: {
    // 4. Align Nuxt's routing with Cloudflare's strict URL matching
    prerender: {
      autoSubfolderIndex: false,
      routes: [
        ...getLabRoutes(),
        ...getEquipmentRoutes()
      ]
    }
  }
})
