const express = require('express');
const path = require('path');
const app = express();

// IMPORTANT: Serve static files from dist directory
// This should come BEFORE your routes
app.use(express.static(path.join(__dirname, '../dist')));

// Route for home page
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/home.html'));
});

// Root route redirect to home
app.get('/', (req, res) => {
  res.redirect('/home');
});

// API routes for your backend functionality
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
