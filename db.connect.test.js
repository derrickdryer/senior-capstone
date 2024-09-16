const connectToDB = require('./db.connect');

// Define the fetchUsers function
async function fetchUsers() {
  let connection;

  try {
    // Await the connection from connectToDB
    connection = await connectToDB();  // Make sure this resolves to a valid connection object
    
    if (!connection) {
      throw new Error('No connection returned');
    }

    console.log('Fetching data from users table...');

    // Define and execute the query
    const result = await connection.execute('SELECT * FROM users');

    // Return the fetched data
    return result.rows;

  } catch (err) {
    console.error('Error fetching data from users table:', err);
    throw err;  // Propagate the error
  } finally {
    if (connection && typeof connection.close === 'function') {
      try {
        // Always close the connection after fetching data
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

// Main execution block
(async () => {
  try {
    console.log('Attempting to connect to the database...');
    
    // Call fetchUsers after connection
    const users = await fetchUsers();
    
    console.log('Users table data:', users);  // Log the fetched data
console.log('Starting test...'); 
const connectToDB = require('./db.connect');
 // Add this line to check if the script starts

(async () => {
  try {
    console.log('Attempting to connect to the database...');  // Add this line
    await connectToDB();
    console.log('Test completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
