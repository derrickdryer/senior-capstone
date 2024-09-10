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
