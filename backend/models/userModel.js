const db = require('../db');

async function findByUsername(username) {
  const rows = await db.query('SELECT * FROM benutzer WHERE username = ?', [username]);
  return rows[0]; // erste Zeile zurückgeben
}



async function createUser(username, hashedPassword) {
  const result = await db.query(
    'INSERT INTO benutzer (username, passwort) VALUES (?, ?)',
    [username, hashedPassword]
  );
  return result;
}

async function getUserByUsername(username) {
  const rows = await db.query(
    'SELECT * FROM benutzer WHERE username = ?',
    [username]
  );
  return rows[0];
}

module.exports = {
  createUser,
  getUserByUsername,
  findByUsername,
};


