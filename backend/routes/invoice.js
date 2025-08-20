const express = require("express");
const { createInvoice, previewInvoice } = require("../controllers/invoiceController");
const verifyToken = require('../services/authMiddleware');
const router = express.Router();

// router.post("/invoice.pdf",verifyToken, createInvoice);
router.post("/invoice.pdf", createInvoice);
// router.post("/invoice.html",verifyToken, previewInvoice); // preview route
router.post("/invoice.html", previewInvoice);

module.exports = router;
