const express = require('express');
const router = express.Router();
<<<<<<< HEAD:backend/routes/warehouse.js
const warehouseController = require('../controllers/warehouseController');
=======
const lagerController = require('../controllers/lagerController');
const {createOrderController} = require('../controllers/orderController');
>>>>>>> 29746cae6fbdc9d7f0abf7052315a1f93c3a8c04:backend/routes/lager.js
const verifyToken = require('../services/authMiddleware');
// z.B. GET /lager/bestand
router.get('/bestand', verifyToken, warehouseController.getStock);

// z.B. POST /lager/erfassen
router.post('/erfassen', verifyToken, warehouseController.recordProduct);

router.post('/order', createOrderController);
router.post('/order/delivery.pdf', createDeliveryNote);
router.post('/order/delivery.html', previewDeliveryNote);

module.exports = router;
