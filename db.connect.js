const oracledb = require('oracledb');
const config = require('./configs.json');

async function connectToDB() {
  let connection;

  try {
    console.log('Attempting to connect to Oracle DB...');

    // Establish connection
    connection = await oracledb.getConnection({
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      connectString: config.DB_CONNECT_STRING
    });

    console.log('Connected to Oracle DB!');
    return connection;  // Ensure the connection is returned
    console.log('Connected to Oracle DB! Connection will remain open.');


  } catch (err) {
    console.error('Error connecting to Oracle DB:', err);
    throw err;
  }
}

module.exports = connectToDB;


  return connection;
}

module.exports = connectToDB;  // Ensure we are exporting the function
