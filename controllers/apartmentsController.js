// controllers/apartmentsController.js

const { apartments } = require('../models');

// Get all apartments
exports.getAllApartments = async (req, res) => {
  try {
    const results = await apartments.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single apartment by ID
exports.getApartmentById = async (req, res) => {
  try {
    const apartment = await apartments.findByPk(req.params.id);
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new apartment
exports.createApartment = async (req, res) => {
  try {
    const newApartment = await apartments.create(req.body);
    res.status(201).json(newApartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing apartment by ID
exports.updateApartment = async (req, res) => {
  try {
    const apartment = await apartments.findByPk(req.params.id);
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });

    await apartment.update(req.body);
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an apartment by ID
exports.deleteApartment = async (req, res) => {
  try {
    const apartment = await apartments.findByPk(req.params.id);
    if (!apartment) return res.status(404).json({ error: 'Apartment not found' });

    await apartment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};