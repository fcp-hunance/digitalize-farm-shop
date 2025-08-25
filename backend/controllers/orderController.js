const orderRepo = require("../models/orderRepository");
const { generateDeliveryNotePDF, generateInvoicePDF } = require("../services/pdfService");
const { calcInvoice } = require("../services/invoiceService");
const { json } = require("express");
const path = require("path");
const ejs = require("ejs");

// Controller to create an order and its delivery note
async function createOrderController(req, res) {
  try {
    const { idCustomer, items, decTotal } = req.body;

    // Create order, add products, and generate delivery note
    const { idOrder, idDeliveryNote } = await orderRepo.createOrderWithDelivery(idCustomer, items, decTotal);
    res.status(201).json({success: true, idOrder, idDeliveryNote})
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
}

async function createDeliveryNote(req, res) {
  try {
    const { idOrder } = req.body;

   // Fetch order info from DB
    const order = await orderRepo.getOrderById(idOrder);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const pdfBuffer = await generateDeliveryNotePDF(order);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=lieferschein-${idOrder}.pdf`);
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate delivery note PDF" });
  }
}

// Generate delivery note HTML preview
async function previewDeliveryNote(req, res) {
  try {
     const { idOrder } = req.body;

   // Fetch order info from DB
    const order = await orderRepo.getOrderById(idOrder);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // render plain HTML without PDF
      const html = await ejs.renderFile(
        path.join(__dirname, "../views/deliveryNote.ejs"),
        { order },
        { async: true }
      );

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate delivery note HTML preview" });
  }
}

// Controller to generate a monthly invoice PDF for a customer
async function createMonthlyInvoiceController(req, res) {
  try {
    const { customerId, month } = req.body; // month format: YYYY-MM

    // 1. Get all orders (with products) for this customer in the given month
    const orders = await orderRepo.getOrdersByMonth(customerId, month);

    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this customer in the given month" });
    }

    // 2. Calculate invoice totals
    const invoiceDataCalc = calcInvoice(
      orders.flatMap(order => order.items)
    );

    // 3. Prepare invoice data for PDF
    const customer = await orderRepo.getCustomer(customerId);
    const invoiceData = {
      data: {
        invoiceNumber: `INV-${month}-${customerId}`,
        date: new Date().toLocaleDateString("de-DE"),
        deliveryDate: `01.${month} - ${lastDayOfMonth(month)}`,
        seller: {
          name: "Your Company Name",
          address: "Your Address",
          vatId: "DE123456789",
        },
        buyer: {
          name: customer.Address,
          address: customer.Address,
          phone: customer.Phone,
          email: customer.Email,
        },
        taxRate: 0.19,
        currency: "€",
        notes: "Monthly invoice for your deliveries",
      },
      items: invoiceDataCalc.items,
      totals: invoiceDataCalc.totals,
    };

    // 4. Create invoice in DB and link delivery notes
    const invoiceId = await orderRepo.createInvoice(customerId, month, orders);

    // 5. Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoiceData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice-${month}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate invoice" });
  }
}

// Helper function to get last day of month
function lastDayOfMonth(month) {
  const [year, mon] = month.split("-");
  return new Date(year, mon, 0).getDate();
}

module.exports = {
  createOrderController,
  createMonthlyInvoiceController,
  createDeliveryNote,
  previewDeliveryNote
};
