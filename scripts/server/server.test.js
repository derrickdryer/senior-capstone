// ======================================================================
// File: server.test.js
// Description: Sets up a simple Express server for testing API endpoints.
//              This test server exposes a single endpoint to verify that the
//              API is reachable and functioning correctly.
// Dependencies: Express
// Usage: Run this file to start the test server and access the endpoint at /api/test.
// ======================================================================

const express = require('express');
const app = express();

// Define a test API endpoint that returns a JSON message.
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test Server running on port ${PORT}`));
