const db = require('../db');

async function findByUsername(name) {
  const rows = await db.query('SELECT * FROM cashiers WHERE name = ?', [name]);
  return rows[0]; // erste Zeile zurückgeben
}



async function createUser(name, hashedPassword, hashedPin) {
  const result = await db.query(
    'INSERT INTO cashiers (name, passwort, pin) VALUES (?, ?, ?)',
    [name, hashedPassword, hashedPin]
  );
  return result;
}

async function getUserByUsername(name) {
  const rows = await db.query(
    'SELECT * FROM cashiers WHERE name = ?',
    [name]
  );
  return rows[0];
}

module.exports = {
  createUser,
  getUserByUsername,
  findByUsername,
};


