import express from 'express';
const router = express.Router();

import extraServiceController from '#controllers/room/extraService.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Extra Services
 *   description: Extra service management APIs
 */

/**
 * @swagger
 * /api/extra-services:
 *   get:
 *     summary: Get all extra services
 *     tags: [Extra Services]
 *     responses:
 *       200:
 *         description: Extra services returned successfully
 */
router.get('/', extraServiceController.getAllExtraServices);

/**
 * @swagger
 * /api/extra-services/{id}:
 *   get:
 *     summary: Get extra service by ID
 *     tags: [Extra Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Extra service returned successfully
 */
router.get('/:id', extraServiceController.getExtraServiceById);

/**
 * @swagger
 * /api/extra-services:
 *   post:
 *     summary: Create extra service (Admin)
 *     tags: [Extra Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Breakfast
 *               price:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Extra service created successfully
 */
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  extraServiceController.createExtraService,
);

/**
 * @swagger
 * /api/extra-services/{id}:
 *   put:
 *     summary: Update extra service (Admin)
 *     tags: [Extra Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Extra service updated successfully
 */
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  extraServiceController.updateExtraService,
);

/**
 * @swagger
 * /api/extra-services/{id}:
 *   delete:
 *     summary: Delete extra service (Admin)
 *     tags: [Extra Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Extra service deleted successfully
 */
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  extraServiceController.deleteExtraService,
);

export default router;
