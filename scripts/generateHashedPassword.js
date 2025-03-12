const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHashedPasswords() {
  const users = [
    { username: 'manager1', password: 'password1' },
    { username: 'maintenance1', password: 'password2' },
    { username: 'tenant1', password: 'password3' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    console.log(
      `Username: ${user.username}, Hashed Password: ${hashedPassword}`
    );
  }
}

generateHashedPasswords();
