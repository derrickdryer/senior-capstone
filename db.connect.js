const oracledb = require('oracledb');
const config = require('./configs.json');

async function connectToDB() {
  let connection;

  try {
    console.log('Attempting to connect to Oracle DB...');

    connection = await oracledb.getConnection({
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      connectString: config.DB_CONNECT_STRING
    });

    console.log('Connected to Oracle DB! Connection will remain open.');

  } catch (err) {
    console.error('Error connecting to Oracle DB:', err);
    throw err;
  }

  return connection;
}

module.exports = connectToDB;  // Ensure we are exporting the function
