const products = require("../data/products");

function calcInvoice(items, taxRate = 0.19) {
  const enriched = items.map((it) => {
    const prod = products[it.id];
    if (!prod) throw new Error(`Unknown product: ${it.id}`);
    const lineTotal = +(it.qty * prod.price).toFixed(2);
    return { ...prod, qty: it.qty, lineTotal };
  });

  const net = enriched.reduce((s, it) => s + it.lineTotal, 0);
  const tax = +(net * taxRate).toFixed(2);
  const gross = +(net + tax).toFixed(2);

  return { items: enriched, totals: { net, tax, gross } };
}

module.exports = { calcInvoice };
