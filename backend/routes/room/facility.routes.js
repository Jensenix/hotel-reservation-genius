import express from 'express';
const router = express.Router();

import facilityController from '#controllers/room/facility.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Facilities
 *   description: Facility management APIs
 */

/**
 * @swagger
 * /api/facilities:
 *   get:
 *     summary: Get all facilities
 *     tags: [Facilities]
 *     responses:
 *       200:
 *         description: Facilities returned successfully
 */
router.get('/', facilityController.getAllFacilities);

/**
 * @swagger
 * /api/facilities/{id}:
 *   get:
 *     summary: Get facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Facility returned successfully
 */
router.get('/:id', facilityController.getFacilityById);

/**
 * @swagger
 * /api/facilities:
 *   post:
 *     summary: Create facility (Admin)
 *     tags: [Facilities]
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
 *                 example: Swimming Pool
 *     responses:
 *       201:
 *         description: Facility created successfully
 */
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  facilityController.createFacility,
);

/**
 * @swagger
 * /api/facilities/{id}:
 *   put:
 *     summary: Update facility (Admin)
 *     tags: [Facilities]
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
 *         description: Facility updated successfully
 */
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  facilityController.updateFacility,
);

/**
 * @swagger
 * /api/facilities/{id}:
 *   delete:
 *     summary: Delete facility (Admin)
 *     tags: [Facilities]
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
 *         description: Facility deleted successfully
 */
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  facilityController.deleteFacility,
);

export default router;
