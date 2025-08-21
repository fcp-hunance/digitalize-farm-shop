const db = require('../db');

const getAllProducts = async () => {
  const rows = await db.query("SELECT * FROM t_Product"); 
  return rows;
};

module.exports = { getAllProducts };