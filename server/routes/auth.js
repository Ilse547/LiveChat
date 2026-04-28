//Authentication routes
const express = require('express');
const router = express.Router();
const Usermodel = require('../models/user');
const jwt = require('jsonwebtoken');
const { VerifyToken } = require('../middleware/verifytoken');


//LOGIN LOGIC

router.post('/login',async (req, res) =>{
  try{
    const JWT_KEY = process.env.JWT_KEY;
    const {Username, Password, Email} = req.body;
    const User = await Usermodel.findOne({username: Username, email: Email});  

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
router.post('/register', async (req, res) => {

  const {Username, Password, Email} = req.body;
  try {

    const ExistingUsername = await Usermodel.findOne({username : Username});
    if(ExistingUsername) {return res.status(400).json({message : 'This Username is already taken'});}

    const ExistingEmail = await Usermodel.findOne({ email: Email });
    if(ExistingEmail) { return res.status(400).json({message : 'Email is already in use'});}

    const NewUser = new Usermodel ({
      username : Username,
      password : Password,
      email : Email
    });
    await NewUser.save();
    console.log('The user was saved to the DB');
    res.status(200).json({message : 'Worked'})
  }catch(err){
    console.log('error while saving suer to db', err)
    res.status(400).json({error: "There was an error creating the user"});
  }
});

router.get('/verify', VerifyToken, (req, res) => {
  console.log('req.user:', req.user); 
  res.status(200).json({ message : 'Your Token is invalid', user: req.user });
})

module.exports = router;