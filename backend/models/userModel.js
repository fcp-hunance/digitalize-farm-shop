const db = require('../db');

async function findByUsername(name) {
  const rows = await db.query('SELECT * FROM t_User WHERE strUsername = ?', [name]);
  return rows[0]; // erste Zeile zurückgeben
}



async function createUser(name, hashedPassword, hashedPin, role) {
  const result = await db.query(
    'INSERT INTO t_User (strUsername, strPasswordHash, strPIN, strRole) VALUES (?, ?, ?, ?)',
    [name, hashedPassword, hashedPin, role]
  );
  return result;
}

async function getUserByUsername(name) {
  const rows = await db.query(
    'SELECT * FROM t_User WHERE strUsername = ?',
    [name]
  );
  return rows[0];
}

module.exports = {
  createUser,
  getUserByUsername,
  findByUsername,
};


