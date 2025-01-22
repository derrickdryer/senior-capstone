const mariadb = require('mariadb');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

async function connectToDB() {
  let connection;
  try {
    console.log('Attempting to connect to Maria DB...');
    connection = await mariadb.createConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    });

    console.log('Connected to Maria DB!');
    return connection;

  } catch (err) {
    console.error('Error connecting to Maria DB:', err);
    throw err;
  }
}

module.exports = connectToDB;