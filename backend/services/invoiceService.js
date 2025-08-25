const { query } = require("../db");

// Calculate invoice totals for a list of items [{id, quantity}]
async function calcInvoice(items, taxRate = 0.07) {
  if (!items.length) return { items: [], totals: { net: 0, tax: 0, gross: 0 } };

  // Get product info from DB for all item IDs
  const ids = items.map(it => it.idProduct);
  const placeholders = ids.map(() => "?").join(",");

  const products = await query(
    `SELECT idProduct, strProductName AS name, Price, fkVAT FROM t_Product WHERE idProduct IN (${placeholders})`,
    ids
  );

  const vatMap = await getVatRatesForDate();

  // Map products by ID for easy lookup
  const productMap = {};
  products.forEach(p => {
    productMap[p.idProduct] = p;
  });

  // Build enriched line items with totals
  const enriched = items.map(it => {
    const prod = productMap[it.id];
    if (!prod) throw new Error(`Unknown product: ${it.id}`);

    const lineNet = +(it.qty * prod.Price).toFixed(2);
    const vatRate = vatMap[prod.fkVAT] || 0;
    const lineTax = +(lineNet * vatRate).toFixed(2);
    const lineGross = +(lineNet + lineTax).toFixed(2);

    return {
      ...prod,
      qty: it.qty,
      lineNet,
      lineTax,
      lineGross,
      vatRate
    };
  });

  const net = enriched.reduce((sum, it) => sum + it.lineNet, 0);
  const tax = enriched.reduce((sum, it) => sum + it.lineTax, 0);
  const gross = enriched.reduce((sum, it) => sum + it.lineGross, 0);

  return { items: enriched, totals: { net, tax, gross } };
}

async function getVatRatesForDate(date = new Date()) {
  const today = date.toISOString().split("T")[0]; // YYYY-MM-DD

  const vats = await query(
    `SELECT idVAT, decTaxRate
     FROM t_Vat
     WHERE dateValidFrom <= ?
       AND (dateValidUntil IS NULL OR dateValidUntil >= ?)`,
    [today, today]
  );

  const vatMap = {};
  vats.forEach(v => {
    vatMap[v.idVAT] = parseFloat(v.decTaxRate) / 100; // z. B. 0.07
  });

  return vatMap;
}

module.exports = { calcInvoice };
