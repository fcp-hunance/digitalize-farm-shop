const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../services/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/pin', verifyToken, authController.pinLogin);

module.exports = router;
