const db = require('../db');

async function getProduktById(id) {
  const rows = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
}

module.exports = {
  getProduktById,
};
