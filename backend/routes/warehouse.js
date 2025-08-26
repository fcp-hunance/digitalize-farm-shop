const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const {createOrderController, createDeliveryNote, previewDeliveryNote} = require('../controllers/orderController');
const verifyToken = require('../services/authMiddleware');


// GET Bestand eines Artikels
router.get("/:artikel_id", warehouseController.getIntStock);

// POST Update Bestand
router.post("/update", warehouseController.updateIntStock);

router.get("/", warehouseController.getAllProducts);          // GET /api/warehouse
router.post("/add", warehouseController.addProduct);          // POST /api/warehouse/add
router.delete("/:artikel_id", warehouseController.deleteProduct); // DELETE /api/warehouse/5



router.post('/order', createOrderController);
router.post('/order/delivery.pdf', createDeliveryNote);
router.post('/order/delivery.html', previewDeliveryNote);

module.exports = router;
