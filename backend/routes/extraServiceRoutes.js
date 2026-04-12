const express = require('express');
const router = express.Router();
const extraServiceController = require('../controllers/extraServiceController');

// CRUD Routes
router.post('/', extraServiceController.createExtraService.bind(extraServiceController));
router.get('/', extraServiceController.getAllExtraServices.bind(extraServiceController));
router.get('/:id', extraServiceController.getExtraServiceById.bind(extraServiceController));
router.put('/:id', extraServiceController.updateExtraService.bind(extraServiceController));
router.delete('/:id', extraServiceController.deleteExtraService.bind(extraServiceController));

module.exports = router;
