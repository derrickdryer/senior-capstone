const express = require('express');
const app = express();

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test Server running on port ${PORT}`));
