// Utilitaires pour le cache busting côté client

/**
 * Génère une URL avec timestamp pour forcer le rechargement
 * @param url - URL de base
 * @returns URL avec paramètre de version
 */
export const addCacheBusting = (url: string): string => {
  const timestamp = (window as any).__BUILD_TIMESTAMP__ || Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${timestamp}`;
};

/**
 * Force le rechargement de la page avec cache busting
 */
export const forceReload = (): void => {
  // Ajouter un timestamp pour forcer le rechargement
  const currentUrl = window.location.href.split('?')[0];
  const separator = currentUrl.includes('?') ? '&' : '?';
  window.location.href = `${currentUrl}${separator}reload=${Date.now()}`;
};

/**
 * Vérifie si une nouvelle version est disponible
 * @returns Promise résolue avec le timestamp ou false
 */
export const checkForUpdates = async (): Promise<string | boolean> => {
  try {
    const response = await fetch('/health');
    const data = await response.json();
    return data.timestamp;
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return false;
  }
};

/**
 * Nettoie le cache du navigateur pour les assets spécifiques
 */
export const clearAssetCache = (): void => {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
};