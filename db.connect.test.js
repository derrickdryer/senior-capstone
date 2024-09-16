const connectToDB = require('./db.connect');

async function fetchUsers() {
  let connection;

  try {
    connection = await connectToDB();

    if (!connection) {
      throw new Error('No connection returned');
    }

    console.log('Fetching data from users table...');
    const result = await connection.execute('SELECT * FROM users');
    return result.rows;

  } catch (err) {
    console.error('Error fetching data from users table:', err);
    throw err;
  } finally {
    if (connection && typeof connection.close === 'function') {
      try {
        await connection.close();
        console.log('Connection closed');
      } catch (err) {
        console.error('Error closing the connection:', err);
      }
    } else {
      console.error('Invalid connection object. Cannot close.');
    }
  }
}

(async () => {
  try {
    console.log('Attempting to connect to the database...');
    const users = await fetchUsers();
    console.log('Users table data:', users);

    console.log('Starting test...');
    await connectToDB();
    console.log('Test completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
