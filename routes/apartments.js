const express = require('express');
const router = express.Router();
const apartmentsController = require('../controllers/apartmentsController');

// Define CRUD routes for apartments
router.get('/', apartmentsController.getAllApartments);
router.get('/:id', apartmentsController.getApartmentById);
router.post('/', apartmentsController.createApartment);
router.put('/:id', apartmentsController.updateApartment);
router.delete('/:id', apartmentsController.deleteApartment);

module.exports = router;
