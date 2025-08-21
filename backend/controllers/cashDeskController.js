const { getAllProducts } = require("../models/productModel");

const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Abrufen der Produkte" });
  }
};

module.exports = { fetchProducts };
