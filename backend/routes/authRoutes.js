const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth Routes
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));

module.exports = router;
