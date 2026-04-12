const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');

// CRUD Routes
router.post('/', facilityController.createFacility.bind(facilityController));
router.get('/', facilityController.getAllFacilities.bind(facilityController));
router.get('/:id', facilityController.getFacilityById.bind(facilityController));
router.put('/:id', facilityController.updateFacility.bind(facilityController));
router.delete('/:id', facilityController.deleteFacility.bind(facilityController));

module.exports = router;
