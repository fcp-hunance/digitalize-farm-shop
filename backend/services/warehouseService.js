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

async function addProduct(productData) {
  const {  name, preis, intStock, fkUnit } = productData;

  // Prüfen ob Artikelnummer bereits existiert
  //const existingProduct = await db.query(
  //  "SELECT idProduct FROM t_product WHERE artikelnummer = ?",
  //  [artikelnummer]
  //);

  // const rows = extractRows(existingProduct);
  
  // if (rows && rows.length > 0) {
  //   throw new Error("Artikelnummer ist bereits vorhanden");
  // }

  // Artikel einfügen
  const result = await db.query(
    "INSERT INTO t_product (strProductName, decPrice, intStock, fkUnit) VALUES (?, ?, ?, ?)",
    [ name, preis, intStock,fkUnit]
  );

  // Neuen Artikel mit ID abrufen
  const newProduct = await db.query(
    "SELECT idProduct, strProductName, decPrice, intStock, fkUnit FROM t_product WHERE idProduct = ?",
    [result.insertId]
  );

  const newRows = extractRows(newProduct);
  
  if (!newRows || newRows.length === 0) {
    throw new Error("Fehler beim Erstellen des Artikels");
  }

  return newRows[0];
}

/**
 * Löscht einen Artikel
 */
async function deleteProduct(productID) {
  // Prüfen ob Artikel existiert
  const existingProduct = await db.query(
    "SELECT idProduct FROM t_product WHERE idProduct = ?",
    [productID]
  );

  const rows = extractRows(existingProduct);
  
  if (!rows || rows.length === 0) {
    throw new Error("Artikel nicht gefunden");
  }

  // Artikel löschen
  await db.query(
    "DELETE FROM t_product WHERE idProduct = ?",
    [productID]
  );
}

/**
 * Hilfsfunktion zum Extrahieren von Rows aus verschiedenen DB-Result-Formaten
 */
function extractRows(result) {
  return Array.isArray(result) && result.length > 0 && Array.isArray(result[0]) ? result[0] :
         Array.isArray(result) ? result :
         result.rows ? result.rows :
         result;
}

async function getAllProducts() {
  // Beispiel mit SQL: passe es an dein DB-Layer an
  const rows = await db.query("SELECT idProduct, strProductName, decPrice, intStock, fkUnit FROM t_product");
  return rows;
}

module.exports = {
  getAllProducts,
  getIntStock,
  updateIntStock,
  addProduct,
  deleteProduct,
  extractRows // für Wiederverwendung exportieren
};