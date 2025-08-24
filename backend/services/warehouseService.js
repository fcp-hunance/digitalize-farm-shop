const db = require("../db");

/**
 * Holt den aktuellen intStock eines Artikels
 */
async function getIntStock(productID) {
  const result = await db.query(
    "SELECT intStock FROM t_product WHERE idProduct = ?",
    [productID]
  );
  
  // Extrahiere rows aus verschiedenen möglichen Formaten
  const rows = 
    Array.isArray(result) && result.length > 0 && Array.isArray(result[0]) ? result[0] : // [rows, fields]
    Array.isArray(result) ? result : // direkt rows
    result.rows ? result.rows : // { rows: [...] }
    result; // fallback
  
  console.log('Extrahiert Rows:', rows);
  
  if (!rows || rows.length === 0 || !rows[0]) {
    throw new Error("Artikel nicht gefunden");
  }
  
  return rows[0].intStock;
}
/**
 * Aktualisiert den intStock eines Artikels
 */
async function updateIntStock(productID, menge, richtung) {
  const intStock = await getIntStock(productID);

  let neueIntStock;
  if (richtung === "eingang") {
    neueIntStock = intStock + menge;
  } else if (richtung === "ausgang") {
    neueIntStock = intStock - menge;
    if (neueIntStock < 0) {
      throw new Error( "intStock darf nicht negativ sein");
    }
  } else {
    throw new Error("Ungültige Richtung");
  }

  await db.query("UPDATE t_product SET intStock = ? WHERE idProduct = ?", [
    neueIntStock,
    productID,
  ]);

  return neueIntStock;
}

module.exports = {
  getIntStock,
  updateIntStock,
};
