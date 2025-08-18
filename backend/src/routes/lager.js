const express = require('express');
const router = express.Router();
const lagerController = require('../controllers/lagerController');

// z.B. GET /lager/bestand
router.get('/bestand', lagerController.getBestand);

// z.B. POST /lager/erfassen
router.post('/erfassen', lagerController.produktErfassen);

module.exports = router;
