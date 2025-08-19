const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db'); // falls die Datei db.js in db-Ordner liegt
require('dotenv').config();



const app = express();
app.use(express.json());

async function login(req, res) {
  const { username, password } = req.body;


  if (!username || !password) {
  return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }
 try {
    // Statt direktem Query -> Model nutzen
    const user = await userModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Benutzer nicht gefunden' });
    }

    // Passwortprüfung
    const isPasswordValid = await bcrypt.compare(password, user.passwort);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Falsches Passwort' });
    }

    // JWT generieren
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    res.status(200).json({
      message: 'Erfolgreich angemeldet',
      token,
      user: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
};




async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username und Passwort erforderlich' });
  }

  const existingUser = await userModel.getUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: 'Benutzername bereits vergeben' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.createUser(username, hashedPassword);

  res.json({ message: 'Benutzer erfolgreich registriert' });
}



module.exports = {
  login,
  register,
};
