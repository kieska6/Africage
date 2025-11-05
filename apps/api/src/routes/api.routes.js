const express = require('express');

const router = express.Router();

/**
 * Route API avec cache court pour des données pouvant changer fréquemment
 * Cache-Control: max-age=60 indique que les données sont valides 60 secondes
 * must-revalidate force la revalidation après expiration
 */
router.get('/data', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=60, must-revalidate',
    'ETag': generateETag({ timestamp: new Date().toISOString() })
  });
  
  // Vos données ici
  const data = {
    timestamp: new Date().toISOString(),
    // ... autres données
  };
  
  res.json(data);
});

/**
 * Route API pour des données critiques qui ne doivent pas être mises en cache
 * Utile pour les données sensibles ou très dynamiques
 */
router.get('/user/profile', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  // Données utilisateur
  const userProfile = {
    // ... données utilisateur
  };
  
  res.json(userProfile);
});

/**
 * Route API pour des données statiques avec cache long
 * Pour des données qui changent rarement
 */
router.get('/static/config', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=86400, immutable' // 24 heures
  });
  
  const config = {
    // ... configuration statique
  };
  
  res.json(config);
});

// Fonction utilitaire pour générer un ETag
function generateETag(data) {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

module.exports = router;