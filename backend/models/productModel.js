const getAllProducts = async () => {
  const [rows] = await pool.query("SELECT * FROM t_product");
  return rows;
};

module.exports = { getAllProducts };