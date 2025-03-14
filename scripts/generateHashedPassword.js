// ======================================================================
// File: generateHashedPassword.js
// Description: This script generates and logs hashed passwords for a set of
//              predefined users. Useful for quickly generating secure passwords.
// Dependencies: bcrypt for hashing functionality.
// Usage: Run the script to output each username with its corresponding hashed password.
// ======================================================================

const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHashedPasswords() {
  // Define an array of users with their plaintext passwords.
  const users = [
    { username: 'manager1', password: 'password1' },
    { username: 'maintenance1', password: 'password2' },
    { username: 'tenant1', password: 'password3' },
  ];

  // Loop through each user, hash their password, and log the username with the hashed password.
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    console.log(
      `Username: ${user.username}, Hashed Password: ${hashedPassword}`
    );
  }
}

generateHashedPasswords();
