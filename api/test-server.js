const express = require('express');
const app = express();
const PORT = 3000;

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Test endpoint: http://localhost:3000/test');
});
