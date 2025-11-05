import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Générer un timestamp de build pour le versioning
const buildTimestamp = Date.now();

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Africage',
        short_name: 'Africage',
        description: 'Envoyez et transportez des colis entre continents, en toute confiance.',
        theme_color: '#FF9900',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    // Générer des noms de fichiers avec hash pour le cache busting
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${buildTimestamp}.js`,
        chunkFileNames: `assets/[name]-${buildTimestamp}.js`,
        assetFileNames: `assets/[name]-${buildTimestamp}.[ext]`
      }
    },
    // Configurer le répertoire de build
    outDir: 'dist',
    // Configurer le chemin de base pour les assets
    assetsDir: 'assets'
  },
  define: {
    // Exposer le timestamp de build aux composants React
    '__BUILD_VERSION__': JSON.stringify(buildTimestamp.toString())
  }
});