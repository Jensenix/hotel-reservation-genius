import express from 'express';
const router = express.Router();

import RevenueController from '#controllers/payment/revenue.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Revenue
 *   description: Revenue analytics APIs
 */

/**
 * @swagger
 * /api/revenue/stats:
 *   get:
 *     summary: Get revenue statistics (Admin)
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue statistics returned successfully
 */
router.get(
  '/stats',
  authenticateToken,
  requireAdmin,
  RevenueController.getRevenueStats,
);

export default router;
