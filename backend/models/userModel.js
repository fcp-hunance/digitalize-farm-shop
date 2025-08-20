const db = require('../db');

async function findByUsername(name) {
  const rows = await db.query('SELECT * FROM t_user WHERE Username = ?', [name]);
  return rows[0]; // erste Zeile zurückgeben
}



async function createUser(name, hashedPassword, hashedPin, role) {
  const result = await db.query(
    'INSERT INTO t_user (Username, PasswordHash, PIN, Role) VALUES (?, ?, ?, ?)',
    [name, hashedPassword, hashedPin, role]
  );
  return result;
}

async function getUserByUsername(name) {
  const rows = await db.query(
    'SELECT * FROM t_user WHERE Username = ?',
    [name]
  );
  return rows[0];
}

module.exports = {
  createUser,
  getUserByUsername,
  findByUsername,
};


