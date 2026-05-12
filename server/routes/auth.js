//Authentication routes
const express = require('express');
const router = express.Router();
const Usermodel = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { VerifyToken } = require('../middleware/verifytoken');
const { sendConfirmationEmail, sendLoginEmail, SendPasswordResetEmail } = require('../service/email');
const { ResponseError } = require('../middleware/responseerror');
const { AsyncHandler } = require('../middleware/async')

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const OTP_MIN = 100000;
const OTP_MAX = 999999;



//LOGIN LOGIC

router.post('/login',AsyncHandler(async (req, res) =>{
    const JWT_KEY = process.env.JWT_KEY;
    const {Username, Password} = req.body;
    const User = await Usermodel.findOne({username: Username});  

    if (!User) throw new ResponseError('No user was found with that username', 401, 'auth.user.not.found');

    const IsValidPassword = await User.ComparePassword(Password);
    if (!IsValidPassword) throw new ResponseError('Password and Username combination not found', 401, 'auth.invalid.credentials');

    if (!User.isConfirmed) throw new ResponseError('Confirm your account before logging in', 403, 'auth.not.confirmed');

    const LoginCode = crypto.randomInt(OTP_MIN, OTP_MAX).toString();
    User.ConfirmationCode = LoginCode;
    User.ConfirmationCodeDate = new Date();
    await User.save();

    await sendLoginEmail(User.email, User.username, LoginCode);
    res.status(200).json({ message: 'Code sent to your email' });
  }));

router.post('/login/verify', AsyncHandler(async (req, res) => {

    const JWT_KEY = process.env.JWT_KEY;
    const { Username, Code } = req.body;

    const User = await Usermodel.findOne({ username: Username });

    if (!User) throw new ResponseError('User not found', 401, 'auth.user.not.found');

    if (User.ConfirmationCode != Code) throw new ResponseError('Wrong code :(', 401, 'auth.code.not.valid');

    const CodeAge = Date.now() - new Date(User.ConfirmationCodeDate).getTime();
    if(CodeAge > OTP_EXPIRY_MS) {
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
      admin: User.isAdmin
    };

    const token = jwt.sign(Payload, JWT_KEY, {expiresIn: '12h'});


    res.status(200).json({message : 'Login successful', token});
}));


//REGISTER LOGIC
router.post('/register', AsyncHandler(async (req, res) => {

  const {Username, Password, Email} = req.body;

    const ExistingUsername = await Usermodel.findOne({username : Username});
    if(ExistingUsername) throw new ResponseError('Username already taken', 400, 'auth.user.already.used');

    const ExistingEmail = await Usermodel.findOne({ email: Email });
    if(ExistingEmail) throw new ResponseError('Email already taken', 400, 'auth.email.already.used');

    const ConfirmationCode = crypto.randomInt(OTP_MIN, OTP_MAX).toString();

    const NewUser = new Usermodel ({
      username : Username,
      password : Password,
      email : Email,
      ConfirmationCode,
      isConfirmed : false,
    });
    await NewUser.save();

    await sendConfirmationEmail(Email, Username, ConfirmationCode);

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
  res.status(200).json({ message : 'Your Token is valid', user: req.user });
});


router.post('/reset-password', AsyncHandler(async (req, res) => {
    const { Username } = req.body;
    const User = await Usermodel.findOne({ username: Username });
    if(!User) throw new ResponseError('User not found', 404, 'auth.user.not.found');

    const ResetCode = crypto.randomInt(OTP_MIN, OTP_MAX).toString();
    User.ConfirmationCode = ResetCode;
    User.ConfirmationCodeDate = new Date();
    await User.save();

    await SendPasswordResetEmail(User.email, User.username, ResetCode);
    res.status(200).json({ message: 'reset code sent to your email'});
}));

router.post('/reset-password/verify', AsyncHandler(async (req,res) => {
    const {Username, Code, NewPassword } = req.body;
    const User = await Usermodel.findOne({ username: Username });
    if(!User) throw new ResponseError('User not found', 404, 'auth.user.not.found');


    if(User.ConfirmationCode !==  Code) throw new ResponseError('Code doesnt match the one we sent', 400, 'auth.code.not.valid');


    const CodeAge = Date.now() - new Date(User.ConfirmationCodeDate).getTime();
    if( CodeAge > OTP_EXPIRY_MS) {
      User.ConfirmationCode = null;
      User.ConfirmationCodeDate = null;
      await User.save();
      throw new ResponseError('the code has expired', 401, 'auth.code.expired');
    }

    if(!NewPassword || NewPassword.length < 8) throw new ResponseError('Password must be at least 8 characters long', 401, 'auth.new.password.too.short');

    User.password = NewPassword;
    User.ConfirmationCode = null;
    User.ConfirmationCodeDate = null;
    await User.save();
    res.status(200).json({ message: 'Your password was reset'});
}));

router.get('/me', VerifyToken, AsyncHandler(async(req, res) => {
  const user = await Usermodel
    .findById(req.user.id)
    .select('username email isAdmin LastOnline');
  if(!user) throw new ResponseError('User not found', 404, 'auth.user.not.found');

  res.status(200).json({
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      admin: user.isAdmin,
      lastOnline: user.LastOnline
    }
  });
}));

router.get('/admin/users', VerifyToken, AsyncHandler(async (req, res) => {
  if(!req.user.admin) throw new ResponseError('Access denied', 403, 'auth.not.admin');
  const users = await Usermodel.find()
    .select('username email isAdmin LastOnline isConfirmed');

  res.status(200).json({ users });
}));

module.exports = router;