const { query } = require("../db");

// Calculate invoice totals for a list of items [{id, qty}]
async function calcInvoice(items, taxRate = 0.19) {
  if (!items.length) return { items: [], totals: { net: 0, tax: 0, gross: 0 } };

  // Get product info from DB for all item IDs
  const ids = items.map(it => it.id);
  const placeholders = ids.map(() => "?").join(",");
  const products = await query(
    `SELECT idProduct, strProductName AS name, Price FROM t_Product WHERE idProduct IN (${placeholders})`,
    ids
  );

  // Map products by ID for easy lookup
  const productMap = {};
  products.forEach(p => {
    productMap[p.idProduct] = p;
  });

  // Build enriched line items with totals
  const enriched = items.map(it => {
    const prod = productMap[it.id];
    if (!prod) throw new Error(`Unknown product: ${it.id}`);
    const lineTotal = +(it.qty * prod.Price).toFixed(2);
    return { ...prod, qty: it.qty, lineTotal };
  });

  const net = enriched.reduce((sum, it) => sum + it.lineTotal, 0);
  const tax = +(net * taxRate).toFixed(2);
  const gross = +(net + tax).toFixed(2);

  return { items: enriched, totals: { net, tax, gross } };
}

module.exports = { calcInvoice };
