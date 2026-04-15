const express = require('express');
const router = express.Router();
const RevenueController = require('../controllers/revenueController');

// Get revenue statistics
router.get('/stats', RevenueController.getRevenueStats);

module.exports = router;
