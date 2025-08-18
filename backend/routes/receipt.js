const express = require("express");
const { createReceipt, previewReceipt } = require("../controllers/receiptController");

const router = express.Router();

router.post("/receipt.pdf", createReceipt);
router.post("/receipt.html", previewReceipt); // preview receipt

module.exports = router;
