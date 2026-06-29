import express from 'express';
const router = express.Router();
import RevenueController from '#controllers/payment/revenue.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

// Protect revenue endpoints
router.get('/stats', authenticateToken, requireAdmin, RevenueController.getRevenueStats);

export default router;