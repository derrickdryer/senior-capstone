// File purpose: Performs integration tests for the MariaDB connection.
// This file verifies that a database connection can be established and used to run queries.

const connectToDB = require('./db.connect');

describe('Database Connection Tests', () => {
  let connection;

  // Connect to the database before running tests
  beforeAll(async () => {
    connection = await connectToDB();
  });

  // Close the database connection after tests complete
  afterAll(async () => {
    if (connection) {
      await connection.end();
    }
  });

  // Test that fetching users from the database returns an array
  test('Should fetch users from the database', async () => {
    expect(connection).toBeDefined();

    // Execute query to fetch all users
    console.log('Fetching data from users table...');
    const result = await connection.query('SELECT * FROM users');

    console.log('Users table data:', result);
    expect(Array.isArray(result)).toBe(true);
  });
});
