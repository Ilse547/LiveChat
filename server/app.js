const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/home', (req, res) =>{
  res.sendFile(path.join(__dirname, '../dist/home.html'));
});

app.get('/', (req, res) => {
  res.redirect('/login');
});
app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '../dist/login.html'));
});

app.get('/test', (req, res) => {
  res.json({message: "test works"});
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/chat.html'));
});

app.listen(PORT, () =>{
  console.log(`server running on http://localhost:${PORT}`);
});