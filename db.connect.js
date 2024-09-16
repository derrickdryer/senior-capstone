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
    console.log('Connected to Oracle DB!');
    return connection;

  } catch (err) {
    console.error('Error connecting to Oracle DB:', err);
    throw err;
  }
}

module.exports = connectToDB;