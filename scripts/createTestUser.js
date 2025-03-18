// ======================================================================
// File: createTestUser.js
// Description: This script creates a test user in the database for testing purposes.
// Dependencies: bcrypt for hashing passwords, connectToDB for database connection.
// Usage: Customize variable values as needed and run the script to create a test user.
// ======================================================================

const bcrypt = require('bcrypt');
const connectToDB = require('./db/db.connect.js');
const saltRounds = 10;

async function createTestUser() {
  // Initialize variables for the test user.
  const property_id = 1; // Example property_id, change as needed
  const role = 'manager'; // User role designation
  const username = 'testuser'; // Predefined username
  const plaintextPassword = 'password123'; // Plaintext password (to be hashed)
  const phone_number = '123-456-7890'; // Example phone number, change as needed
  const mfa_secret = 'example_mfa_secret'; // Example MFA secret, change as needed

  // Hash the plaintext password using bcrypt with defined salt rounds.
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);

  // Connect to the database and insert the new test user.
  let connection;
  try {
    connection = await connectToDB();
    const result = await connection.query(
      'INSERT INTO users (property_id, role, username, password, phone_number, mfa_secret) VALUES (?, ?, ?, ?, ?, ?)',
      [property_id, role, username, hashedPassword, phone_number, mfa_secret]
    );
    console.log('Test user created successfully:', result);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

createTestUser();
