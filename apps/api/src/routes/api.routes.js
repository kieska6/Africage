const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router();

// Middleware pour les données API qui changent fréquemment
const setApiCacheHeaders = (req, res, next) => {
  // Pour les données qui changent fréquemment, utiliser un cache court
  res.set('Cache-Control', 'public, max-age=60, must-revalidate');
  res.set('Vary', 'Authorization'); // Important pour les données utilisateur
  next();
};

// Route pour les données utilisateur (cache 60 secondes)
router.get('/user-data', 
  authenticateToken, 
  setApiCacheHeaders,
  async (req, res, next) => {
    try {
      // Simuler la récupération des données utilisateur
      const userData = {
        id: req.user.id,
        email: req.user.email,
        profile: req.user.profile,
        lastUpdated: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      next(error);
    }
  }
);

// Route pour les statistiques (cache 5 minutes)
router.get('/stats', 
  setApiCacheHeaders,
  (req, res) => {
    // Pour les statistiques, on pourrait utiliser un cache plus long
    res.set('Cache-Control', 'public, max-age=300, must-revalidate');
    
    const stats = {
      totalUsers: 1234,
      totalShipments: 5678,
      activeTrips: 90,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: stats
    });
  }
);

// Route pour les notifications (pas de cache)
router.get('/notifications', 
  authenticateToken,
  (req, res) => {
    // Les notifications ne doivent pas être mises en cache
    res.set('Cache-Control', 'no-cache, max-age=0, must-revalidate');
    res.set('Pragma', 'no-cache');
    
    const notifications = [
      {
        id: '1',
        type: 'new_message',
        message: 'Nouveau message de John',
        read: false,
        timestamp: new Date().toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: notifications
    });
  }
);

module.exports = router;