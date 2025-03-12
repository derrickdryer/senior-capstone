const bcrypt = require('bcrypt');
const connectToDB = require('./db/db.connect.js');
const saltRounds = 10;

async function createTestUser() {
  const property_id = 1; // Example property_id, change as needed
  const role = 'manager';
  const username = 'testuser';
  const plaintextPassword = 'password123';
  const phone_number = '123-456-7890'; // Example phone number, change as needed
  const mfa_secret = 'example_mfa_secret'; // Example MFA secret, change as needed
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);

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
