const { calcInvoice } = require("../services/invoiceService");
const { generateInvoicePDF } = require("../services/pdfService");
const { query } = require("../db");
const path = require("path");
const ejs = require("ejs");

// Helper: map unit ids
const mapUnit = (unitId) => {
  switch (unitId) {
    case 1: return "kg";
    case 2: return "Stück";
    case 3: return "l";
    default: return "";
  }
};

// Helper: format numbers with "," and without unnecessary decimals
const formatQuantity = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  const rounded = Math.round(num * 1000) / 1000;
  let str = rounded.toString().replace(".", ",");
  // remove trailing zeros after comma
  str = str.replace(/,?0+$/, "");
  return str;
};

// Helper: merge items with same name + unit
const mergeItems = (products) => {
  const merged = {};
  for (const p of products) {
    const key = `${p.strProductName}_${p.fkUnit}`;
    if (!merged[key]) {
      merged[key] = {
        name: p.strProductName,
        unit: mapUnit(p.fkUnit),
        qty: 0,
        price: parseFloat(p.decPrice),
        lineTotal: 0
      };
    }
    const qty = parseFloat(p.decQuantity);
    merged[key].qty += qty;
    merged[key].lineTotal += parseFloat(p.decPrice) * qty;
  }

  return Object.values(merged).map(i => ({
    ...i,
    qty: formatQuantity(i.qty)
  }));
};

async function createInvoice(req, res) {
  try {
    const { customerId, month } = req.body;
    if (!customerId || !month) {
      return res.status(400).json({ error: "customerId and month required" });
    }

    const [year, mon] = month.split("-");
    const startDate = `${year}-${mon}-01`;
    const endDate = `${year}-${mon}-31`;

    const orders = await query(
      `SELECT o.idOrder, o.dateOrderDate, o.decTotal
       FROM t_Order o
       WHERE o.fkCustomer = ? AND o.dateOrderDate BETWEEN ? AND ?`,
      [customerId, startDate, endDate]
    );

    if (!orders.length) {
      return res.status(404).json({ error: "No orders found for this customer in that month" });
    }

    const orderIds = orders.map(o => o.idOrder);
    const placeholders = orderIds.map(() => "?").join(",");
    const products = await query(
      `SELECT po.fkOrder, po.fkProduct, po.decQuantity, p.strProductName, p.decPrice, p.fkUnit
       FROM t_Product_Order po
       JOIN t_Product p ON po.fkProduct = p.idProduct
       WHERE po.fkOrder IN (${placeholders})`,
      orderIds
    );

    const items = mergeItems(products);

    const totals = {
      net: items.reduce((sum, i) => sum + i.lineTotal, 0),
      tax: items.reduce((sum, i) => sum + i.lineTotal, 0) * 0.07,
      gross: items.reduce((sum, i) => sum + i.lineTotal, 0) * 1.07
    };

    const [customer] = await query(
      `SELECT strName AS name, strAddress AS address FROM t_MajorCustomer WHERE idCustomer = ?`,
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

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

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    res.end(pdfBuffer);
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

    const [year, mon] = month.split("-");
    const startDate = `${year}-${mon}-01`;
    const endDate = `${year}-${mon}-31`;

    const orders = await query(
      `SELECT o.idOrder, o.dateOrderDate, o.decTotal
       FROM t_Order o
       WHERE o.fkCustomer = ? AND o.dateOrderDate BETWEEN ? AND ?`,
      [customerId, startDate, endDate]
    );

    if (!orders.length) {
      return res.status(404).json({ error: "No orders found for this customer in that month" });
    }

    const orderIds = orders.map(o => o.idOrder);
    const placeholders = orderIds.map(() => "?").join(",");
    const products = await query(
      `SELECT po.fkOrder, po.fkProduct, po.decQuantity, p.strProductName, p.decPrice, p.fkUnit
       FROM t_Product_Order po
       JOIN t_Product p ON po.fkProduct = p.idProduct
       WHERE po.fkOrder IN (${placeholders})`,
      orderIds
    );

    const items = mergeItems(products);

    const totals = {
      net: items.reduce((sum, i) => sum + i.lineTotal, 0),
      tax: items.reduce((sum, i) => sum + i.lineTotal, 0) * 0.07,
      gross: items.reduce((sum, i) => sum + i.lineTotal, 0) * 1.07
    };

    const [customer] = await query(
      `SELECT strName AS name, strAddress AS address FROM t_MajorCustomer WHERE idCustomer = ?`,
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

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
