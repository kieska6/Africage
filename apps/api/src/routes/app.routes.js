const express = require('express');
const path = require('path');
const { noCacheHTML, defaultCacheControl } = require('../middleware/cache-control.middleware');

const router = express.Router();

// Route pour servir le fichier HTML principal avec contrôle de cache strict
router.get('/', noCacheHTML, (req, res) => {
  res.sendFile('index.html', { 
    root: path.join(__dirname, '../../../dist'),
    headers: {
      'Cache-Control': 'no-cache, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
});

// Route pour les autres pages HTML
router.get('*', noCacheHTML, (req, res, next) => {
  // Vérifie si la requête concerne un fichier HTML
  if (req.path.endsWith('.html')) {
    res.sendFile(req.path, { 
      root: path.join(__dirname, '../../../dist'),
      headers: {
        'Cache-Control': 'no-cache, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } else {
    next();
  }
});

module.exports = router;