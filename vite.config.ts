import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Générer un timestamp pour le versioning
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
  define: {
    // Exposer le timestamp de build aux composants React
    '__BUILD_TIMESTAMP__': JSON.stringify(buildTimestamp)
  },
  build: {
    // Ajouter des hashes aux noms de fichiers pour le cache busting
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return `assets/[name]-${buildTimestamp}.css`;
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: `assets/[name]-${buildTimestamp}.js`,
        entryFileNames: `assets/[name]-${buildTimestamp}.js`,
      },
    },
  },
});