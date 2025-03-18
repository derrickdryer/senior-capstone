// ======================================================================
// File: database.js
// Description: Creates a pool of MySQL connections using the promise-based mysql2 library.
//              Connection settings are dynamically loaded from environment variables defined
//              in a .env file.
// Dependencies: mysql2/promise, dotenv
// Usage: Import this module to perform database operations using the connection pool.
// ======================================================================

const mysql = require('mysql2/promise'); // Using promise-based MySQL2
require('dotenv').config();

// Create a connection pool using environment variables for configuration.
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Hostname of the database server
  user: process.env.DB_USER, // Username for the database
  password: process.env.DB_PASSWORD, // Password for the database user
  database: process.env.DB_DATABASE, // Name of the database
  port: process.env.DB_PORT, // Database port number
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // No limit on queued connection requests
});

module.exports = pool;
