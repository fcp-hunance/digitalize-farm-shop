const express = require("express");
const { createReceipt, previewReceipt } = require("../controllers/receiptController");
const verifyToken = require('../services/authMiddleware');
const router = express.Router();

router.post("/receipt.pdf", verifyToken, createReceipt);
router.post("/receipt.html", verifyToken, previewReceipt); // preview receipt

module.exports = router;
