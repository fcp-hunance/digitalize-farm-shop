const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const verifyToken = require('../services/authMiddleware');
// z.B. GET /lager/bestand
router.get('/bestand', verifyToken, warehouseController.getStock);

// z.B. POST /lager/erfassen
router.post('/erfassen', verifyToken, warehouseController.recordProduct);

module.exports = router;
