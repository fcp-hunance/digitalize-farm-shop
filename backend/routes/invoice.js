const express = require("express");
const { createInvoice, previewInvoice } = require("../controllers/invoiceController");

const router = express.Router();

router.post("/invoice.pdf", createInvoice);
router.post("/invoice.html", previewInvoice); // preview route

module.exports = router;
