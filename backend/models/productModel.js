const getAllProducts = async () => {
  const [rows] = await pool.query("SELECT * FROM t_Product");
  return rows;
};

module.exports = { getAllProducts };