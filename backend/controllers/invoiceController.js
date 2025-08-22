const { calcInvoice } = require("../services/invoiceService");
const { generateInvoicePDF } = require("../services/pdfService");
const path = require("path");
const ejs = require("ejs");

async function createInvoice(req, res) {
  try {
    const { items, customer } = req.body;
    const invoice = calcInvoice(items);

    const buyer = customer.reduce((acc, obj) => ({ ...acc, ...obj}), {});

    const invoiceData = {
      data: {
        invoiceNumber: "INV-" + Date.now(),
        date: new Date().toLocaleDateString("de-DE"),
        deliveryDate: new Date().toLocaleDateString("de-DE"),
        seller: { name: "Hofladen Hahn", address: "Dorfplatz 5, 67890 Kleinstadt", vatId: "DE123456789" },
        buyer: { name: buyer.name, address: buyer.address },
        taxRate: 0.07,
        currency: "€",
        notes: "Vielen Dank für Ihren Einkauf!"
      },
      items: invoice.items,
      totals: invoice.totals,
    };

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating invoice");
  }
}

async function previewInvoice(req, res) {
  try {
    const { items, customer } = req.body;
    const invoice = calcInvoice(items);
    const buyer = customer.reduce((acc, obj) => ({ ...acc, ...obj}), {});

    const invoiceData = {
      data: {
        invoiceNumber: "INV-" + Date.now(),
        date: new Date().toLocaleDateString("de-DE"),
        deliveryDate: new Date().toLocaleDateString("de-DE"),
        seller: { name: "Hofladen Hahn", address: "Dorfplatz 5, 67890 Kleinstadt", vatId: "DE123456789" },
        buyer: { name: buyer.name, address: buyer.address },
        taxRate: 0.07,
        currency: "€",
        notes: "Vielen Dank für Ihren Einkauf!"
      },
      items: invoice.items,
      totals: invoice.totals,
    };

    // render plain HTML without PDF
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/invoice.ejs"),
      invoiceData,
      { async: true }
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering invoice HTML");
  }
}

module.exports = { createInvoice, previewInvoice };
