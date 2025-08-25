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
    const { customerId, month } = req.body;
    if (!customerId || !month) {
      return res.status(400).json({ error: "customerId and month required" });
    }

    // Parse month
    const [year, mon] = month.split("-");
    const startDate = `${year}-${mon}-01`;
    const endDate = `${year}-${mon}-31`; // rough end of month

    // Get orders for this customer in the month
    const orders = await db.query(
      `SELECT o.idOrder, o.dateOrderDate, o.decTotal
       FROM t_Order o
       WHERE o.fkCustomer = ? AND o.dateOrderDate BETWEEN ? AND ?`,
      [customerId, startDate, endDate]
    );

    if (!orders.length) {
      return res.status(404).json({ error: "No orders found for this customer in that month" });
    }

    // Get all products for these orders
    const orderIds = orders.map(o => o.idOrder);
    const placeholders = orderIds.map(() => "?").join(",");
    const products = await db.query(
      `SELECT po.fkOrder, po.fkProduct, po.intQuantity, p.strProductName, p.decPrice, p.fkUnit
       FROM t_Product_Order po
       JOIN t_Product p ON po.fkProduct = p.idProduct
       WHERE po.fkOrder IN (${placeholders})`,
      orderIds
    );

    // Map units
    const mapUnit = (unitId) => {
      switch(unitId) {
        case 1: return "kg";
        case 2: return "Stück";
        case 3: return "l";
        default: return "";
      }
    };

    // Build items array
    const items = products.map(p => ({
      name: p.strProductName,
      unit: mapUnit(p.fkUnit),
      qty: p.intQuantity,
      price: parseFloat(p.decPrice),
      lineTotal: parseFloat(p.decPrice) * p.intQuantity
    }));

    // Calculate totals
    const totals = {
      subTotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
      tax: items.reduce((sum, i) => sum + i.lineTotal, 0) * 0.07,
      total: items.reduce((sum, i) => sum + i.lineTotal, 0) * 1.07
    };

    // Get customer info
    const [customer] = await db.query(
      `SELECT strName AS name, strAddress AS address FROM t_Customer WHERE idCustomer = ?`,
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Prepare invoice data
    const invoiceData = {
      data: {
        invoiceNumber: "INV-" + Date.now(),
        date: new Date().toLocaleDateString("de-DE"),
        deliveryDate: new Date().toLocaleDateString("de-DE"),
        seller: {
          name: "Hofladen Hahn",
          address: "Dorfplatz 5, 67890 Kleinstadt",
          vatId: "DE123456789"
        },
        buyer: {
          name: customer.name,
          address: customer.address
        },
        taxRate: 0.07,
        currency: "€",
        notes: "Vielen Dank für Ihren Einkauf!"
      },
      items,
      totals
    };

    // Render HTML
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
