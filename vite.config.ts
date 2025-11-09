// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dyadComponentTagger(), 
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        // Nettoie automatiquement les anciens caches
        cleanupOutdatedCaches: true,
        // Prend le contrôle immédiatement des clients
        clientsClaim: true,
        // Augmente la limite de taille des fichiers à pré-cacher de 2 MiB (par défaut) à 5 MiB
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      devOptions: {
        // Désactive complètement le Service Worker en développement pour éviter les problèmes de cache
        enabled: false
      },
      manifest: {
        name: 'Africage',
        short_name: 'Africage',
        description: 'Envoyez et transportez des colis entre continents, en toute confiance.',
        theme_color: '#FF6B35',
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
});