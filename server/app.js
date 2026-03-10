const express = require('express');
const path = require('path');
const {logger} = require('./middleware/logger');
const Usermodel = require('./models/user');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to mongodb db'))
  .catch((err) => console.log('Couldnt connect to mongodb db', err));


app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(logger);
app.use(express.static(path.join(__dirname, '../dist')));

 
  
app.post('/login',async (req, res) =>{
  const {Username, Password} = req.body;  
  try {
      const NewUser = new Usermodel({
      username: Username,
      password: Password
  });
    await NewUser.save();
    console.log("User created and saved to db");
    res.redirect('/home');
  }catch(err){console.log("Error creating user", err)
      res.status(400).json({error: "Error creating user"});
  };

});


app.post('/register', async (req, res) => {

  const {Username, Password} = req.body;
  try {
    const NewUser = new Usermodel ({
      username : Username,
      password : Password
    });
    await NewUser.save();
    console.log('User was saved to db');
    res.status(200).json({message : 'Woked'})
  }catch(err){
    console.log('error while saving suer to db'), err
    res.status(400).json({error: "error creating user"});
  }
})




app.get('/', (req, res) => {
  res.redirect('/home');
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