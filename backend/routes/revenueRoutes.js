import express from 'express';
const router = express.Router();
import RevenueController from '../controllers/revenueController.js';

// Get revenue statistics
router.get('/stats', RevenueController.getRevenueStats);

export default router;
