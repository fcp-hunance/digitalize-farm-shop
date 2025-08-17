const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' });
  }

  try {
    const user = await userModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Benutzer nicht gefunden' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwort);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Falsches Passwort' });
    }

    return res.json({ message: 'Erfolgreich angemeldet', user: { id: user.id, username: user.username } });

  } catch (err) {
    console.error('Login-Fehler:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}


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
