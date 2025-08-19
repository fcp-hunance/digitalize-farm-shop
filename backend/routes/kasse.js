const express = require('express');
const router = express.Router();
const kasseController = require('../controllers/kasseController');
const verifyToken = require('../services/authMiddleware'); // Token-Middleware importieren

// POST geschützter Endpunkt
router.post('/berechne', verifyToken, kasseController.berechneGesamtbetrag);

module.exports = router;
