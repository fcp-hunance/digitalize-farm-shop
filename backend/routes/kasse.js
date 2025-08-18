const express = require('express');
const router = express.Router();
const kasseController = require('../controllers/kasseController');

// POST c
router.post('/berechne', kasseController.berechneGesamtbetrag);

module.exports = router;
