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
const GroupModel = require('./models/group')
const helmet = require('helmet');

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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://livechat-qx1k.onrender.com"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/favicon.ico'));
});


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


app.post('/creategroup', VerifyToken, async (req, res) =>{
  const { GroupName, Participants } = req.body;
  if (!GroupName) { return res.status(400).json({message: "No gorup name was given"}); }

  if (!Participants || Participants.length===0) { return res.status(400).json({message:" Group must have at least 2 members"}); }

  try {
    const ExistingGroup = await GroupModel.findOne({ GroupName });
    if (ExistingGroup) { return res.status(400).json({ message : "the chosen name already exists" }); }
    const newGroup = new GroupModel({ 
      GroupName,
      Participants: [...Participants, req.user.username]
    });
    await newGroup.save();
    res.status(201).json({ message: "Group was successfully created" });
  } catch(err){
    console.error('there was an error while creating the group', err);
    res.status(500).json({ message: "There was a problem creating the group"});
  };

});


app.get('/groupinfo/:groupname', VerifyToken, async (req, res) => {
  try {
    const group = await GroupModel.findOne({ GroupName: req.params.groupname });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.Participants.includes(req.user.username)) {
      return res.status(402).json({ message: 'Your are not part of this group' });
    }
    res.status(200).json({ group });
  } catch(err) {
    console.error('Problem etting group info', err);
    res.status(500).json({ message: 'Error getting group info', err});
  }
});


app.get('/creategroup',  (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/creategroup.html'));
})

app.get('/', (req, res) => {
  res.redirect('/home');
});


app.get('/user/exists/:username', async (req, res) => {
  try {
    const user = await Usermodel.findOne({ username: req.params.username });
    res.status(200).json({ exists: !!user });
  } catch (err) {
    console.error('error looking if user eistrs', err);
    res.status(500).json({ exists: false });
  }
});

app.get('/groups', VerifyToken, async (req, res) => {
  try {
    const groups = await GroupModel.find({
      Participants: req.user.username
    });
    res.status(200).json({ groups });
  } catch(err) {
    console.error('problem while fetching groups ', err);
    res.status(400).json({ message: 'problem while fethcing groups'});
  }
});
//GROUPCHaT PAGE


app.get('/group/:groupname', (req,res)=>{
  res.sendFile(path.join(__dirname, '../dist/group.html'));
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
  server.listen(PORT, '0.0.0.0',  () =>{
    console.log(`server runnin on http:://localhost:${PORT}`);
  });
}
module.exports=app