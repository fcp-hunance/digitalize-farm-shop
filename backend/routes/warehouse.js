const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const lagerController = require('../controllers/lagerController');
const {createOrderController} = require('../controllers/orderController');
const verifyToken = require('../services/authMiddleware');
// z.B. GET /lager/bestand
router.get('/bestand', verifyToken, warehouseController.getStock);

// z.B. POST /lager/erfassen
router.post('/erfassen', verifyToken, warehouseController.recordProduct);

router.post('/order', createOrderController);
router.post('/order/delivery.pdf', createDeliveryNote);
router.post('/order/delivery.html', previewDeliveryNote);

module.exports = router;
