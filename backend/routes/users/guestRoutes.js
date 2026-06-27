import express from 'express';
import guestController from '#controllers/users/guestController.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

const router = express.Router();

// Get all guests with pagination and search
router.get('/', authenticateToken, requireAdmin, guestController.getGuests);

// Get guest details by ID
router.get(
  '/:id',
  authenticateToken,
  requireAdmin,
  guestController.getGuestDetails,
);

export default router;
