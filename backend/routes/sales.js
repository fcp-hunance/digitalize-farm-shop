const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.idProduct AS productId,
        p.strProductName AS productName,
        SUM(po.decQuantity) AS count
      FROM t_Product_Order po
      JOIN t_Product p ON po.fkProduct = p.idProduct
      GROUP BY p.idProduct, p.strProductName
      ORDER BY count DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;