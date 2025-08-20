const pool = require("../db");

// Create an order with products and a delivery note
async function createOrderWithDelivery(customerId, items) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert order
    const orderResult = await conn.query(
      `INSERT INTO t_order (OrderDate, CustomerID) VALUES (CURDATE(), ?)`,
      [customerId]
    );
    const orderId = orderResult.insertId;

    // 2. Add products to the order
    for (const item of items) {
      await conn.query(
        `INSERT INTO t_product_order (ProductID, OrderID, Quantity) VALUES (?, ?, ?)`,
        [item.productId, orderId, item.quantity]
      );
    }

    // 3. Create a delivery note
    const deliveryResult = await conn.query(
      `INSERT INTO t_deliverynote (DeliveryDate, OrderID) VALUES (CURDATE(), ?)`,
      [orderId]
    );
    const deliveryNoteId = deliveryResult.insertId;

    await conn.commit();
    return { orderId, deliveryNoteId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Get all orders including products for a customer in a given month
async function getOrdersByMonth(customerId, month) {
  const conn = await pool.getConnection();
  try {
    const [year, mon] = month.split("-");

    // Select delivery notes + orders + products
    const orders = await conn.query(
      `SELECT o.OrderID, o.OrderDate, dn.DeliveryNoteID, 
              po.ProductID, po.Quantity
       FROM t_order o
       JOIN t_deliverynote dn ON dn.OrderID = o.OrderID
       JOIN t_product_order po ON po.OrderID = o.OrderID
       WHERE o.CustomerID = ? AND YEAR(o.OrderDate) = ? AND MONTH(o.OrderDate) = ?`,
      [customerId, year, mon]
    );

    // Group data by order
    const grouped = {};
    orders.forEach(r => {
      if (!grouped[r.OrderID]) {
        grouped[r.OrderID] = {
          orderId: r.OrderID,
          orderDate: r.OrderDate,
          deliveryNoteId: r.DeliveryNoteID,
          items: [],
        };
      }
      grouped[r.OrderID].items.push({
        productId: r.ProductID,
        quantity: r.Quantity,
      });
    });

    return Object.values(grouped);
  } finally {
    conn.release();
  }
}

// Create an invoice and link it to delivery notes
async function createInvoice(customerId, month, orders) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert invoice
    const invoiceResult = await conn.query(
      `INSERT INTO t_invoice (InvoiceDate) VALUES (CURDATE())`
    );
    const invoiceId = invoiceResult.insertId;

    // Link delivery notes to the invoice
    for (const order of orders) {
      await conn.query(
        `INSERT INTO t_invoice_deliverynote (InvoiceID, DeliveryNoteID) VALUES (?, ?)`,
        [invoiceId, order.deliveryNoteId]
      );
    }

    await conn.commit();
    return invoiceId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Get customer data
async function getCustomer(customerId) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT * FROM t_majorcustomer WHERE CustomerID = ?`,
      [customerId]
    );
    return rows[0];
  } finally {
    conn.release();
  }
}

async function getOrderById(orderId) {
  const conn = await db.getConnection();
  try {
    // 1. Fetch order and customer info
    const [order] = await conn.query(
      `SELECT o.OrderID, o.OrderDate, o.CustomerID, c.Address AS customerAddress, c.Phone AS customerPhone, c.Email AS customerEmail
       FROM t_order o
       JOIN t_majorcustomer c ON o.CustomerID = c.CustomerID
       WHERE o.OrderID = ?`,
      [orderId]
    );

    if (!order) return null;

    // 2. Fetch products for this order
    const products = await conn.query(
      `SELECT p.ProductID, p.Name AS productName, po.Quantity
       FROM t_product_order po
       JOIN t_product p ON po.ProductID = p.ProductID
       WHERE po.OrderID = ?`,
      [orderId]
    );

    // 3. Format the result
    return {
      orderId: order.OrderID,
      orderDate: order.OrderDate,
      customer: {
        name: order.customerAddress, // adjust if you store actual customer name
        address: order.customerAddress,
        phone: order.customerPhone,
        email: order.customerEmail
      },
      items: products.map(p => ({
        productId: p.ProductID,
        productName: p.productName,
        quantity: p.Quantity
      }))
    };
  } finally {
    conn.release();
  }
}

module.exports = {
  createOrderWithDelivery,
  getOrdersByMonth,
  createInvoice,
  getCustomer,
  getOrderById
};