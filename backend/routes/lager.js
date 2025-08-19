const express = require('express');
const router = express.Router();
const lagerController = require('../controllers/lagerController');
const verifyToken = require('../services/authMiddleware');
// z.B. GET /lager/bestand
router.get('/bestand', verifyToken, lagerController.getBestand);

// z.B. POST /lager/erfassen
router.post('/erfassen', verifyToken, lagerController.produktErfassen);

module.exports = router;
