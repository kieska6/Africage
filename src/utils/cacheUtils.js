// Utilitaires pour le cache busting côté client

/**
 * Génère une URL avec timestamp pour forcer le rechargement
 * @param {string} url - URL de base
 * @returns {string} URL avec paramètre de version
 */
export const addCacheBusting = (url) => {
  const timestamp = __BUILD_TIMESTAMP__ || Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${timestamp}`;
};

/**
 * Force le rechargement de la page avec cache busting
 */
export const forceReload = () => {
  // Ajouter un timestamp pour forcer le rechargement
  const currentUrl = window.location.href.split('?')[0];
  const separator = currentUrl.includes('?') ? '&' : '?';
  window.location.href = `${currentUrl}${separator}reload=${Date.now()}`;
};

/**
 * Vérifie si une nouvelle version est disponible
 * @returns {Promise<boolean>}
 */
export const checkForUpdates = async () => {
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
export const clearAssetCache = () => {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
};