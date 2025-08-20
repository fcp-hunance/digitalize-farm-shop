const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
<<<<<<< HEAD
const lagerController = require('../controllers/warehouseController');
const {createOrderController} = require('../controllers/orderController');
const {createDeliveryNote} = require ('../controllers/orderController');
=======
const {createOrderController, createDeliveryNote, previewDeliveryNote} = require('../controllers/orderController');

>>>>>>> 43b52d01b09e4db6cf038382051f52e89d8a27a5
const verifyToken = require('../services/authMiddleware');
const {previewDeliveryNote} = require ('../controllers/orderController');
// z.B. GET /lager/bestand
router.get('/bestand', verifyToken, warehouseController.getStock);

// z.B. POST /lager/erfassen
router.post('/erfassen', verifyToken, warehouseController.recordProduct);

router.post('/order', createOrderController);
router.post('/order/delivery.pdf', createDeliveryNote);
router.post('/order/delivery.html', previewDeliveryNote);

module.exports = router;
