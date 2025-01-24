const mysql = require('mysql2/promise'); // Using promise-based MySQL2
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '4fGc*sDRYgpKRpDRH^^5',
  database: process.env.DB_DATABASE || 'realtor_website',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
