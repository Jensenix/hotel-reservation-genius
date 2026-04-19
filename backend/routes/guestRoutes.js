const express = require('express');
const router = express.Router();
const { getGuests, getGuestDetails } = require('../controllers/guestController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all guests with pagination and search
router.get('/', authenticateToken, requireAdmin, getGuests);

// Get guest details by ID
router.get('/:id', authenticateToken, requireAdmin, getGuestDetails);

module.exports = router;
