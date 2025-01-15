// routes/leases.js

const express = require('express');
const router = express.Router();
const {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  deleteLease
} = require('../controllers/leasesController');

// GET all leases
router.get('/', getAllLeases);

// GET a single lease by ID
router.get('/:id', getLeaseById);

// POST create a new lease
router.post('/', createLease);

// PUT update a lease by ID
router.put('/:id', updateLease);

// DELETE a lease by ID
router.delete('/:id', deleteLease);

module.exports = router;
