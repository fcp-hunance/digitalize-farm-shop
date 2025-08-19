const express = require("express");
const { createInvoice, previewInvoice } = require("../controllers/invoiceController");
const verifyToken = require('../services/authMiddleware');
const router = express.Router();

router.post("/invoice.pdf",verifyToken, createInvoice);
router.post("/invoice.html",verifyToken, previewInvoice); // preview route

module.exports = router;
