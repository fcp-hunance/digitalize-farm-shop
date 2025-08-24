const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
//const verifyToken = require('../middleware/authMiddleware');

//router.use(verifyToken);

router.get('/users', adminController.getAllUsers);
router.post('/reset-password', adminController.resetUserPassword);
router.post('/reset-pin', adminController.resetUserPin);

module.exports = router;