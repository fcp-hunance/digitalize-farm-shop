const db = require('../db');

const getAllProducts = async () => {
<<<<<<< HEAD
  const rows = await db.query("SELECT * FROM t_product"); 
=======
  const [rows] = await pool.query("SELECT * FROM t_Product");
>>>>>>> 8079393ae86cf0f1cf6ca356aaaaf10bf8853e4f
  return rows;
};

module.exports = { getAllProducts };