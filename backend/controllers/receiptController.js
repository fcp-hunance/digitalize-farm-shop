const path = require("path");
const ejs = require("ejs");
const { query } = require("../db"); // your DB helper
const { generateReceiptPDF } = require("../services/pdfService");

async function createReceipt(req, res) {
  try {
    const { idUser, items, total } = req.body;
    let orderId;

    // Validate input
    if (!idUser || !items || !items.length || total == null) {
      return res.status(400).send("idUser, items and total are required");
    }

    // 1. Save the cash desk order
    try {
      const result = await query(
        `INSERT INTO t_CashDeskOrder (fkUser, decTotal) VALUES (?, ?)`,
        [idUser, total]
      );
      orderId = Number(result.insertId);
      console.log("CashDeskOrder inserted, OrderID:", orderId);
    } catch (err) {
      console.error("Error inserting CashDeskOrder:", err);
      return res.status(500).send("Error saving order");
    }

    // 2. Fetch product info from DB
    const productIds = items.map(it => it.idProduct);
    const placeholders = productIds.map(() => "?").join(",");
    const productsFromDb = await query(
      `SELECT idProduct, strProductName AS name, decPrice AS price, fkVAT
       FROM t_Product
       WHERE idProduct IN (${placeholders})`,
      productIds
    );

    const productMap = {};
    productsFromDb.forEach(p => (productMap[p.idProduct] = p));

    // 3. Insert items and enrich them for receipt
    const enrichedItems = [];
    for (const it of items) {
      const product = productMap[it.idProduct];
      if (!product) {
        console.warn(`Product not found in DB: ${it.idProduct}`);
        continue;
      }

      try {
        const r = await query(
          `INSERT INTO t_Product_CashDeskOrder (fkProduct, fkCashDeskOrder, intQuantity)
           VALUES (?, ?, ?)`,
          [it.idProduct, orderId, it.quantity]
        );
        console.log("Inserted ProductCashDeskOrder:", r);
      } catch (err) {
        console.error("Error inserting ProductCashDeskOrder:", err);
      }

      enrichedItems.push({
        idProduct: it.idProduct,
        qty: it.quantity,
        name: product.name,
        price: product.price,
        lineTotal: +(product.price * it.quantity).toFixed(2)
      });
    }

    // 4. Calculate net and tax
    const vatRate = 0.07; // example VAT
    const net = +(total / (1 + vatRate)).toFixed(2);
    const tax = +(total - net).toFixed(2);

    // 5. Prepare receipt data
    invoiceNumber = generateInvoiceNumber(orderId);
    const receiptData = {
      data: {
        invoiceNumber: "BON-" + invoiceNumber,
        date: new Date().toLocaleString("de-DE"),
        seller: {
          name: "Hofladen Hahn",
          address: "Dorfplatz 5, 67890 Kleinstadt",
          vatId: "DE123456789"
        },
        currency: "€",
        notes: "Steuerfreie Rückgabe innerhalb von 14 Tagen mit Bon.",
        taxRate: vatRate
      },
      items: enrichedItems,
      totals: { net, tax, gross: total }
    };

    // 6. Generate PDF
    const pdfBuffer = await generateReceiptPDF(receiptData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=receipt-${orderId}.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating receipt PDF");
  }
}

async function previewReceipt(req, res) {
  try {
    const { idUser, items, total } = req.body;
    let orderId;

    // Validate input
    if (!idUser || !items || !items.length || total == null) {
      return res.status(400).send("idUser, items and total are required");
    }

    // 1. Save the cash desk order (optional in preview, can skip if desired)
    try {
      const result = await query(
        `INSERT INTO t_CashDeskOrder (fkUser, decTotal) VALUES (?, ?)`,
        [idUser, total]
      );
      orderId = Number(result.insertId);
      console.log("Preview CashDeskOrder inserted, OrderID:", orderId);
    } catch (err) {
      console.error("Error inserting CashDeskOrder (preview):", err);
      orderId = "PREVIEW"; // fallback invoice number
    }

    // 2. Fetch product info
    const productIds = items.map(it => it.idProduct);
    const placeholders = productIds.map(() => "?").join(",");
    const productsFromDb = await query(
      `SELECT idProduct, strProductName AS name, decPrice AS price, fkVAT
       FROM t_Product
       WHERE idProduct IN (${placeholders})`,
      productIds
    );
    const productMap = {};
    productsFromDb.forEach(p => (productMap[p.idProduct] = p));

    // 3. Enrich items
    const enrichedItems = items.map(it => {
      const product = productMap[it.idProduct];
      return {
        idProduct: it.idProduct,
        qty: it.quantity,
        unit: it.unit,
        name: product?.name || "Artikel",
        price: product?.price || 0,
        lineTotal: +(product?.price * it.quantity || 0).toFixed(2)
      };
    });

    // 4. Calculate net and tax
    const vatRate = 0.07;
    const net = +(total / (1 + vatRate)).toFixed(2);
    const tax = +(total - net).toFixed(2);

    // 5. Prepare receipt data
    invoiceNumber = generateInvoiceNumber(orderId);
    const receiptData = {
      data: {
        invoiceNumber: "BON-" + invoiceNumber,
        date: new Date().toLocaleString("de-DE"),
        seller: {
          name: "Hofladen Hahn",
          address: "Dorfplatz 5, 67890 Kleinstadt",
          vatId: "DE123456789"
        },
        currency: "€",
        notes: "Steuerfreie Rückgabe innerhalb von 14 Tagen mit Bon.",
        taxRate: vatRate
      },
      items: enrichedItems,
      totals: { net, tax, gross: total }
    };

    // Render EJS template to HTML
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

function generateInvoiceNumber(orderId, date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}${orderId}`;
}

module.exports = { createReceipt, previewReceipt };
