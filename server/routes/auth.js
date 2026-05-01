//Authentication routes
const express = require('express');
const router = express.Router();
const Usermodel = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { VerifyToken } = require('../middleware/verifytoken');
const { SendConfirmationEmail, SendLoginEmail } = require('../service/email');


//LOGIN LOGIC

router.post('/login',async (req, res) =>{
  try{
    const JWT_KEY = process.env.JWT_KEY;
    const {Username, Password} = req.body;
    const User = await Usermodel.findOne({username: Username});  

    if(!User) return res.status(401).json({message : 'There Is no user with that username'});

    const IsValidPassword = await User.ComparePassword(Password);
    if(!IsValidPassword) return res.status(401).json({message : 'Password and Username combination not found'});

    if (!User.isConfirmed) {
      return res.status(403).json({ message:'Confirm your account before login in'});
    }

    const LoginCode = crypto.randomInt(100000, 999999).toString();
    User.ConfirmationCode = LoginCode;
    User.ConfirmationCodeDate = new Date();
    await User.save();

    await SendLoginEmail(User.email, User.username, LoginCode);
    res.status(200).json({ message: 'Code sent to your email' });


  } catch(err){
    console.error('There was aproblem while logging in', err);
    res.status(500).json({message : 'There was a problem during the login process'})
  }
});

router.post('/login/verify', async (req, res) => {
  try{
    const JWT_KEY = process.env.JWT_KEY;
    const { Username, Code } = req.body;

    const User = await Usermodel.findOne({ username: Username });
    if(!User) { return res.status(401).json ({ message: 'User not found'}); }
    if(User.ConfirmationCode != Code) {return res.status(401).json({ message: 'Wrong code :('});}

    const CodeAge = Date.now() - new Date(User.ConfirmationCodeDate).getTime();
    if(CodeAge > 10*60*1000) {
      User.ConfirmationCode = null;
      User.ConfirmationCodeDate = null;
      await User.save();
      return res.status(401).json({ message: 'the code has expired'});
    }

    User.ConfirmationCode = null;
    User.LastOnline = new Date();
    await User.save();

    const Payload = {
      username : User.username,
      id : User._id,
      admin: User.admin
    };

    const token = jwt.sign(Payload, JWT_KEY, {expiresIn: '12h'});


    console.log(`The user: ${User.username} logged in`);
    res.status(200).json({message : 'Login successful', token});

  } catch(err){
    console.error('There was a proböem verfying the code ', err);
    res.status(404).json({ message: 'There was a problem verifying the code'});
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

    const ConfirmationCode = crypto.randomInt(100000, 999999).toString();

    const NewUser = new Usermodel ({
      username : Username,
      password : Password,
      email : Email,
      ConfirmationCode,
      isConfirmed : false,
    });
    await NewUser.save();

    await SendConfirmationEmail(Email, Username, ConfirmationCode);

    console.log('The user was saved to the DB');
    res.status(200).json({message : 'Worked'})
  }catch(err){
    console.log('error while saving suer to db', err)
    res.status(400).json({error: "There was an error creating the user"});
  }
});


router.post('/confirm', async (req, res) => {
  const { Username, Code } = req.body;

  try {
    const User = await Usermodel.findOne({ username: Username });

    if(!User) {
      return res.status(400).json({ message: 'User not found' });
    }

    if(User.isConfirmed) {
      return res.status(400).json({ message : 'Account already confirmed' });
    }

    if(User.ConfirmationCode !== Code) {
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }

    User.isConfirmed = true;
    User.ConfirmationCode = null;
    await User.save();

    res.status(200).json({ message : 'Account confirmed, you can log in now'})
  } catch(err) {
    console.error('Error confirming account', err);
    res.status(500).json({ error : 'There was an error confirming the account'});
  }
})


router.get('/verify', VerifyToken, (req, res) => {
  console.log('req.user:', req.user); 
  res.status(200).json({ message : 'Your Token is invalid', user: req.user });
})

module.exports = router;