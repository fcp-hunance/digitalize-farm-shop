const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const {createOrderController, createDeliveryNote, previewDeliveryNote} = require('../controllers/orderController');
const verifyToken = require('../services/authMiddleware');


// GET Bestand eines Artikels
router.get("/:artikel_id", warehouseController.getIntStock);

// POST Update Bestand
router.post("/update", warehouseController.updateIntStock);

router.post("/add", warehouseController.addProduct);
router.delete("/delete/:artikel_id", warehouseController.deleteProduct);

router.post('/order', createOrderController);
router.post('/order/delivery.pdf', createDeliveryNote);
router.post('/order/delivery.html', previewDeliveryNote);

module.exports = router;
