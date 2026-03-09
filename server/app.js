const express = require('express');
const path = require('path');
const {logger} = require('./middleware/logger');
const Usermodel = require('./models/user');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dad

const app = express();

dotenv.config();
const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to mongodb db'))
  .catch((err) => console.log('Couldnt connect to mongodb db', err));

app.use(logger);
app.use(express.static(path.join(__dirname, '../dist')));


app.post('/login',async (req, res) =>{
  try {
      const NewUser = new Usermodel({
      username: 'test',
      password: 'test'
  });
    await NewUser.save();
    console.log("User created and saved to db");
    res.redirect('/home');
  }catch(err){console.log("Error creating user", err)
      res.status(400).json({error: "Error creating user"});
  };

});



app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/home', (req, res) =>{
  res.sendFile(path.join(__dirname, '../dist/home.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/chat.html'));
});

app.get('/group', (req,res)=>{
  res.sendFile(path.join(__dirname, '../dist/group.html'));
});

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '../dist/login.html'));
});
app.get('/register', (req,res)=>{
  res.sendFile(path.join(__dirname, '../dist/register.html'));
});

app.get('/test', (req, res) => {
  res.json({message: "test works"});
});




app.listen(PORT, () =>{
  console.log(`server running on http://localhost:${PORT}`);
});