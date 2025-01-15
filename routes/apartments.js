// routes/apartments.js

const express = require('express');
const router = express.Router();
const {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment
} = require('../controllers/apartmentsController');

// GET all apartments
router.get('/', getAllApartments);

// GET a single apartment by ID
router.get('/:id', getApartmentById);

// POST create a new apartment
router.post('/', createApartment);

// PUT update an apartment by ID
router.put('/:id', updateApartment);

// DELETE an apartment by ID
router.delete('/:id', deleteApartment);

module.exports = router;
