const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Kein Token bereitgestellt' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token fehlt oder ungültig' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Ungültiger oder abgelaufener Token' });
    }

    req.user = user; // Payload in req speichern
    next();
  });
}

module.exports = verifyToken;
