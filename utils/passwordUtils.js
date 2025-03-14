// ======================================================================
// File: passwordUtils.js
// Description: Utility functions for hashing and comparing passwords using bcrypt.
// Dependencies: bcrypt module.
// Usage: Import hashPassword and comparePassword to securely handle user passwords.
// ======================================================================

const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
  // Generate a salt and produce a hash for the provided password.
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  // Compare the plaintext password with the hashed version.
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
