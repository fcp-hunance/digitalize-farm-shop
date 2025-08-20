async function getStock(req, res) {
  // hier würdest du z.B. alle Produkte aus der DB holen
  res.json({ message: 'Bestand kommt noch...' });
}

async function recordProduct(req, res) {
  // hier würdest du neue Produkte in die DB einfügen
  const name = req.body.name;
  res.json({ message: `Produkt "${name}" wurde erfasst (bald)!` });
}

module.exports = {
  getStock,
  recordProduct,
};
