// routes/users.js

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

// GET all users
router.get('/', getAllUsers);

// GET a single user by ID
router.get('/:id', getUserById);

// POST create a new user
router.post('/', createUser);

// PUT update a user by ID
router.put('/:id', updateUser);

// DELETE a user by ID
router.delete('/:id', deleteUser);

module.exports = router;