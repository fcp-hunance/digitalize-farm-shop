const { calcInvoice } = require("../services/invoiceService");
const { generateReceiptPDF } = require("../services/pdfService");
const path = require("path");
const ejs = require("ejs");

async function createReceipt(req, res) {
  try {
    const { items } = req.body;
    const invoice = calcInvoice(items);

    const receiptData = {
      data: {
        invoiceNumber: "BON-" + Date.now(),
        date: new Date().toLocaleString("de-DE"),
        seller: { name: "Beispiel GmbH", address: "Musterstr. 1, Berlin", vatId: "DE123456789" },
        taxRate: 0.19,
        currency: "€",
        notes: "Steuerfreie Rückgabe innerhalb von 14 Tagen mit Bon."
      },
      items: invoice.items,
      totals: invoice.totals,
    };

    const pdfBuffer = await generateReceiptPDF(receiptData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=receipt.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating receipt PDF");
  }
}

async function previewReceipt(req, res) {
  try {
    const { items } = req.body;
    const invoice = calcInvoice(items);

    const receiptData = {
      data: {
        invoiceNumber: "BON-" + Date.now(),
        date: new Date().toLocaleString("de-DE"),
        seller: { name: "Beispiel GmbH", address: "Musterstr. 1, Berlin", vatId: "DE123456789" },
        taxRate: 0.19,
        currency: "€",
        notes: "Steuerfreie Rückgabe innerhalb von 14 Tagen mit Bon."
      },
      items: invoice.items,
      totals: invoice.totals,
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/receipt.ejs"),
      receiptData,
      { async: true }
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering receipt HTML");
  }
}

module.exports = { createReceipt, previewReceipt };
