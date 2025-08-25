const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
  host: "localhost",
  user: "dein_db_user",
  password: "dein_db_passwort",
  database: "deine_datenbank"
});

async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (err) {
    console.error("DB query error:", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { query, pool };