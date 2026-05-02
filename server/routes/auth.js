//Authentication routes
const express = require('express');
const router = express.Router();
const Usermodel = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { VerifyToken } = require('../middleware/verifytoken');
const { SendConfirmationEmail, SendLoginEmail, SendPasswordResetEmail } = require('../service/email');
const { ResponseError } = require('../middleware/responseerror');
const { AsyncHandler } = require('../middleware/async')


//LOGIN LOGIC

router.post('/login',AsyncHandler(async (req, res) =>{
    const JWT_KEY = process.env.JWT_KEY;
    const {Username, Password} = req.body;
    const User = await Usermodel.findOne({username: Username});  

    if (!User) throw new ResponseError('No user was found with that username', 401, 'auth.user.not.found');

    const IsValidPassword = await User.ComparePassword(Password);
    if (!IsValidPassword) throw new ResponseError('Password and Username combination not found', 401, 'auth.invalid.credentials');

    if (!User.isConfirmed) throw new ResponseError('Confirm your account before logging in', 403, 'auth.not.confirmed');

    const LoginCode = crypto.randomInt(100000, 999999).toString();
    User.ConfirmationCode = LoginCode;
    User.ConfirmationCodeDate = new Date();
    await User.save();

    await SendLoginEmail(User.email, User.username, LoginCode);
    res.status(200).json({ message: 'Code sent to your email' });
  }));

router.post('/login/verify', AsyncHandler(async (req, res) => {

    const JWT_KEY = process.env.JWT_KEY;
    const { Username, Code } = req.body;

    const User = await Usermodel.findOne({ username: Username });

    if (!User) throw new ResponseError('User not found', 401, 'auth.user.not.found');

    if (User.ConfirmationCode != Code) throw new ResponseError('Wrong code :(', 401, 'auth.code.not.valid');

    const CodeAge = Date.now() - new Date(User.ConfirmationCodeDate).getTime();
    if(CodeAge > 10*60*1000) {
      User.ConfirmationCode = null;
      User.ConfirmationCodeDate = null;
      await User.save();
      throw new ResponseError('the code has expired', 401, 'auth.code.expired');
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
}));


//REGISTER LOGIC
router.post('/register', AsyncHandler(async (req, res) => {

  const {Username, Password, Email} = req.body;

    const ExistingUsername = await Usermodel.findOne({username : Username});
    if(ExistingUsername) throw new ResponseError('Username already taken', 400, 'auth.user.already.used');

    const ExistingEmail = await Usermodel.findOne({ email: Email });
    if(ExistingEmail) throw new ResponseError('Email already taken', 400, 'auth.email.already.used');

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
}));


router.post('/confirm', AsyncHandler(async (req, res) => {
  const { Username, Code } = req.body;

    const User = await Usermodel.findOne({ username: Username });

    if(!User) throw new ResponseError('User not found', 401, 'auth.user.not.found');

    if(User.isConfirmed) throw new ResponseError('Acount already confirmed', 400, 'auth.user.already.confirmed');

    if(User.ConfirmationCode !== Code) throw new ResponseError('Code doesnt match the one we sent', 400, 'auth.code.not.valid');

    User.isConfirmed = true;
    User.ConfirmationCode = null;
    await User.save();

    res.status(200).json({ message : 'Account confirmed, you can log in now'})
}));


router.get('/verify', VerifyToken, (req, res) => {
  console.log('req.user:', req.user); 
  res.status(200).json({ message : 'Your Token is invalid', user: req.user });
});


router.post('/reset-password', async (req, res) => {
  try {
    const { Username } = req.body;
    const User = await Usermodel.findOne({ username: Username });
    if(!User) return res.status(404).json({ message: 'User not found' });

    const ResetCode = crypto.randomInt(100000, 999999).toString();
    User.ConfirmationCode = ResetCode;
    User.ConfirmationCodeDate = new Date();
    await User.save();

    await SendPasswordResetEmail(User.email, User.username, ResetCode);
    res.status(200).json({ message: 'reset code sent to your email'});
  }catch (err) {
    console.error('Error sending code', err);
    res.status(500).json({ message: 'Error sending reset code'});
  }
});

router.post('/reset-password/verify', async (req,res) => {
  try {  
    const {Username, Code, NewPassword } = req.body;
    const User = await Usermodel.findOne({ username: Username });
    if(!User) return res.status(404).json({ message: 'User not found' });

    if(User.ConfirmationCode !==  Code) return res.status(404).json({message: 'Not the right code'});
    const CodeAge = Date.now() - new Date(User.ConfirmationCodeDate).getTime();
    if( CodeAge > 10*60*1000) {
      User.ConfirmationCode = null;
      User.ConfirmationCodeDate = null;
      await User.save();
      return res.status(401).json({ message: 'The code has expired ' });
    }

    if(!NewPassword || NewPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters long'});

    User.password = NewPassword;
    User.ConfirmationCode = null;
    User.ConfirmationCodeDate = null;
    await User.save();
    res.status(200).json({ message: 'Your pssword was reset'});
  } catch(err) {
    console.error('Error while resetting the password', err);
    res.status(500).json({ message: 'there was an error resetting the password'});
  }
})

module.exports = router;