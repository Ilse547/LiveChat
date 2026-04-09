const express = require('express');
const path = require('path');
const {logger} = require('./middleware/logger');
const Usermodel = require('./models/user');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { VerifyToken } = require('./middleware/verifytoken');
const Gun = require('gun');
const http = require('http');

dotenv.config();


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const JWT_KEY = process.env.JWT_KEY;

const gun = Gun({
  web : server,
  file: 'data',
  peers : [
    'https://livechat-qx1k.onrender.com/gun',
  ]
});



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to mongodb db'))
  .catch((err) => console.log('Could not connect to the mongodb', err));


app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(logger);
app.use(express.static(path.join(__dirname, '../dist')));

 
//LOGIN LOGIC

app.post('/login',async (req, res) =>{
  try{
    const {Username, Password} = req.body;
    const User = await Usermodel.findOne({username: Username});  

    if(!User) return res.status(401).json({message : 'There Is no user with that username'});

    const IsValidPassword = await User.ComparePassword(Password);
    if(!IsValidPassword) return res.status(401).json({message : 'Password and Username combination not found'});

    const Payload = {
      username : User.username,
      id : User._id,
      admin: User.admin
    };

    const token = jwt.sign(Payload, JWT_KEY, {expiresIn: '12h'});


    console.log(`The user: ${User.username} logged in`);
    res.status(200).json({message : 'Login successful', token});

  } catch(err){
    console.error('There was aproblem while logging in', err);
    res.status(500).json({message : 'There was a problem during the login process'})
  }

});



//REGISTER LOGIC
app.post('/register', async (req, res) => {

  const {Username, Password} = req.body;
  try {

    const ExistingUsername = await Usermodel.findOne({username : Username});
    if(ExistingUsername) {return res.status(400).json({message : 'This Username is already taken'});}

    const NewUser = new Usermodel ({
      username : Username,
      password : Password
    });
    await NewUser.save();
    console.log('The user was saved to the DB');
    res.status(200).json({message : 'Worked'})
  }catch(err){
    console.log('error while saving suer to db', err)
    res.status(400).json({error: "There was an error creating the user"});
  }
})

app.get('/verify', VerifyToken, (req, res) => {
  console.log('req.user:', req.user); 
  res.status(200).json({ message : 'Your Token is invalid', user: req.user });
})




app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/user/:username', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/profiles.html'));
})

app.get('/home', (req, res) =>{
  res.sendFile(path.join(__dirname, '../dist/home.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/chat.html'));
});

app.get('/group', VerifyToken, (req,res)=>{
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


if(require.main == module) {
  server.listen(PORT, () =>{
    console.log(`server runnin on http:://localhost:${PORT}`);
  });
}
module.exports=app