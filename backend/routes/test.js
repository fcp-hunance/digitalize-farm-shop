const express = require('express');
const router = express.Router();
const verifyToken = require('../services/authMiddleware');

// Test-Endpunkt für Token-Überprüfung

router.get('/verify', verifyToken, (req, res) => {
  res.json({
    message: 'Token gültig',
    user: req.user
  });
});

module.exports = router;
