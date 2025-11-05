const express = require('express');

/**
 * Middleware pour forcer la non-mise en cache du fichier HTML principal
 * Ce middleware s'assure que le navigateur ne met jamais en cache le fichier index.html
 */
const noCacheHTML = (req, res, next) => {
  // Ne s'applique qu'aux requêtes pour le fichier HTML principal
  if (req.path === '/' || req.path.endsWith('.html')) {
    res.set({
      'Cache-Control': 'no-cache, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }
  next();
};

/**
 * Middleware pour définir des en-têtes de cache par défaut
 * S'applique à toutes les autres ressources statiques
 */
const defaultCacheControl = (req, res, next) => {
  // Pour les fichiers statiques (JS, CSS, images)
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
    res.set({
      'Cache-Control': 'public, max-age=31536000, immutable' // 1 an pour les assets
    });
  }
  next();
};

module.exports = {
  noCacheHTML,
  defaultCacheControl
};