const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

async function getAllUsers(req, res) {
  try {
    // Admin-Berechtigung prüfen
    //if (req.user.role !== 'admin') {
    //  return res.status(403).json({ error: 'Zugriff verweigert' });
    //}

    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

async function resetUserPassword(req, res) {
  try {
    const { username, newPassword } = req.body;

    // Admin-Berechtigung prüfen
   // if (req.user.role !== 'admin') {
   //   return res.status(403).json({ error: 'Zugriff verweigert' });
    //}

    if (!username || !newPassword) {
      return res.status(400).json({ error: 'Benutzername und neues Passwort erforderlich' });
    }

    // Benutzer existenz prüfen
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Passwort in Datenbank aktualisieren
    await userModel.updateUserPassword(username, hashedPassword);

    res.json({ 
      success: true, 
      message: 'Passwort erfolgreich zurückgesetzt',
      username: username 
    });
  } catch (error) {
    console.error('Fehler beim Zurücksetzen des Passworts:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

async function resetUserPin(req, res) {
  try {
    const { username, newPin } = req.body;

    // Admin-Berechtigung prüfen
   // if (req.user.role !== 'admin') {
   //   return res.status(403).json({ error: 'Zugriff verweigert' });
    //}

    if (!username || !newPin) {
      return res.status(400).json({ error: 'Benutzername und neue PIN erforderlich' });
    }

    // Benutzer existenz prüfen
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // PIN hashen
    const hashedPin = await bcrypt.hash(newPin, 10);
    
    // PIN in Datenbank aktualisieren
    await userModel.updateUserPin(username, hashedPin);

    res.json({ 
      success: true, 
      message: 'PIN erfolgreich zurückgesetzt',
      username: username 
    });
  } catch (error) {
    console.error('Fehler beim Zurücksetzen der PIN:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

// adminController.js - füge diese Funktion hinzu
async function deleteUser(req, res) {
  try {
    const { username } = req.body;

    // Admin-Berechtigung prüfen
    //if (req.user.role !== 'admin') {
    //  return res.status(403).json({ error: 'Zugriff verweigert' });
    //}

    if (!username) {
      return res.status(400).json({ error: 'Benutzername erforderlich' });
    }

    // Benutzer existenz prüfen
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // Benutzer löschen
    await userModel.deleteUserByUsername(username);

    res.json({ 
      success: true, 
      message: 'Benutzer erfolgreich gelöscht',
      username: username 
    });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}

module.exports = {
  getAllUsers,
  resetUserPassword,
  resetUserPin,
  deleteUser
};