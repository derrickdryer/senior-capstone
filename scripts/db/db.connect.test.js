const connectToDB = require('./db.connect');

describe('Database Connection Tests', () => {
  let connection;

  beforeAll(async () => {
    connection = await connectToDB();
  });

  afterAll(async () => {
    if (connection) {
      await connection.end();
    }
  });

  test('Should fetch users from the database', async () => {
    expect(connection).toBeDefined();

    console.log('Fetching data from users table...');
    const result = await connection.query('SELECT * FROM users');

    console.log('Users table data:', result);
    expect(Array.isArray(result)).toBe(true);
  });
});
