const db = require('../db');

async function findByUsername(name) {
  const rows = await db.query('SELECT * FROM t_User WHERE strUsername = ?', [name]);
  return rows[0];
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

// NEUE FUNKTIONEN FÜR ADMIN
async function getAllUsers() {
  const rows = await db.query(
    'SELECT idUser, strUsername, strRole FROM t_User WHERE strRole != "admin"'
  );
  return rows;
}

async function getUserByUsername(name) {
  const rows = await db.query(
    'SELECT idUser, strUsername, strRole FROM t_User WHERE strUsername = ?',
    [name]
  );
  return rows[0];
}

async function updateUserPassword(username, hashedPassword) {
  const result = await db.query(
    'UPDATE t_User SET strPasswordHash = ? WHERE strUsername = ?',
    [hashedPassword, username]
  );
  return result;
}

async function updateUserPin(username, hashedPin) {
  const result = await db.query(
    'UPDATE t_User SET strPIN = ? WHERE strUsername = ?',
    [hashedPin, username]
  );
  return result;
}


async function deleteUserByUsername(username) {
  const result = await db.query(
    'DELETE FROM t_User WHERE strUsername = ?',
    [username]
  );
  return result;
}

module.exports = {
  createUser,
  getUserByUsername,
  findByUsername,
  getAllUsers,
  updateUserPassword,
  updateUserPin,
  deleteUserByUsername
};