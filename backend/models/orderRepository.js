const { query } = require("../db");

// Create an order with products and a delivery note
async function createOrderWithDelivery(idCustomer, items, decTotal) {
  // 1. Insert order
  const total = parseFloat(decTotal);
  const orderResult = await query(
    `INSERT INTO t_Order (dateOrderDate, fkCustomer, decTotal) VALUES (CURDATE(), ?, ?)`,
    [idCustomer, total]
  );
  const idOrder = Number(orderResult.insertId);

  // 2. Add products to the order
  for (const item of items) {
    await query(
      `INSERT INTO t_Product_Order (fkProduct, fkOrder, intQuantity) VALUES (?, ?, ?)`,
      [item.idProduct, idOrder, item.quantity]
    );
  }

  // 3. Create a delivery note
  const deliveryResult = await query(
    `INSERT INTO t_DeliveryNote (dateDeliveryDate, fkOrder) VALUES (CURDATE(), ?)`,
    [idOrder]
  );
  const idDeliveryNote = Number(deliveryResult.insertId);

  return { idOrder, idDeliveryNote };
}

// Get all orders including products for a customer in a given month
async function getOrdersByMonth(idCustomer, month) {
  const [year, mon] = month.split("-");

  const orders = await query(
    `SELECT o.idOrder, o.dateOrderDate, dn.idDeliveryNote, 
            po.fkProduct, po.intQuantity
     FROM t_Order o
     JOIN t_DeliveryNote dn ON dn.fkOrder = o.idOrder
     JOIN t_Product_Order po ON po.fkOrder = o.idOrder
     WHERE o.fkCustomer = ? AND YEAR(o.dateOrderDate) = ? AND MONTH(o.dateOrderDate) = ?`,
    [idCustomer, year, mon]
  );

  // Group data by order
  const grouped = {};
  orders.forEach(r => {
    if (!grouped[r.idOrder]) {
      grouped[r.idOrder] = {
        idOrder: r.idOrder,
        orderDate: r.dateOrderDate,
        idDeliveryNote: r.idDeliveryNote,
        items: [],
      };
    }
    grouped[r.idOrder].items.push({
      productId: r.fkProduct,
      quantity: r.intQuantity,
    });
  });

  return Object.values(grouped);
}

// Create an invoice and link it to delivery notes
async function createInvoice(orders) {
  // Insert invoice
  const invoiceResult = await query(
    `INSERT INTO t_Invoice (dateInvoiceDate, boolIsPaid) VALUES (CURDATE(), 0)`
  );
  const idInvoice = Number(invoiceResult.insertId);

  // Link delivery notes to the invoice
  for (const order of orders) {
    await query(
      `INSERT INTO t_Invoice_DeliveryNote (fkInvoice, fkDeliveryNote) VALUES (?, ?)`,
      [idInvoice, order.idDeliveryNote]
    );
  }

  return idInvoice;
}

// Get customer data
async function getCustomer(idCustomer) {
  const rows = await query(
    `SELECT * FROM t_MajorCustomer WHERE idCustomer = ?`,
    [idCustomer]
  );
  return rows[0];
}

// Get one order with details
async function getOrderById(idOrder) {
  // 1. Fetch order and customer info
  const rows = await query(
    `SELECT o.idOrder, o.dateOrderDate, o.fkCustomer, 
            c.strName AS customerName,
            c.strAddress AS customerAddress,
            c.strPhone AS customerPhone,
            c.strEmail AS customerEmail,
            dn.dateDeliveryDate
     FROM t_Order o
     JOIN t_MajorCustomer c ON o.fkCustomer = c.idCustomer
     LEFT JOIN t_DeliveryNote dn ON dn.fkOrder = o.idOrder
     WHERE o.idOrder = ?`,
    [idOrder]
  );

  const order = rows[0];
  if (!order) return null;

  // 2. Fetch products for this order
  const products = await query(
    `SELECT p.idProduct, p.strProductName AS productName, po.intQuantity, u.strUnit AS unit
     FROM t_Product_Order po
     JOIN t_Product p ON po.fkProduct = p.idProduct
     LEFT JOIN t_Unit u ON p.fkUnit = u.idUnit
     WHERE po.fkOrder = ?`,
    [idOrder]
  );

  return {
    idOrder: order.idOrder,
    orderDate: formatDate(order.dateOrderDate),
    deliveryDate: formatDate(order.dateDeliveryDate),
    customer: {
      name: order.customerName,
      address: order.customerAddress,
      phone: order.customerPhone,
      email: order.customerEmail
    },
    items: products.map(p => ({
      productId: p.idProduct,
      productName: p.productName,
      quantity: p.intQuantity,
      unit: p.unit
    }))
  };
}

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

module.exports = {
  createOrderWithDelivery,
  getOrdersByMonth,
  createInvoice,
  getCustomer,
  getOrderById
};