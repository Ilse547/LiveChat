//Pages routes

const express = require('express');
const router = express.Router();
const path = require('path');
const Usermodel = require('../models/user');

router.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', (req, res) =>{
  res.sendFile(path.join(__dirname, '../../dist/home.html'));
});

router.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/chat.html'));
});

router.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '../../dist/login.html'));
});

router.get('/register', (req,res)=>{
  res.sendFile(path.join(__dirname, '../../dist/register.html'));
});

router.get('/creategroup',  (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/creategroup.html'));
});

router.get('/group/:groupname', (req,res)=>{
  res.sendFile(path.join(__dirname, '../../dist/group.html'));
});

router.get('/user/:username', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/profiles.html'));
});

router.get('/user/exists/:username', async (req, res) => {
  try {
    const user = await Usermodel.findOne({ username: req.params.username });
    res.status(200).json({ exists: !!user });
  } catch (err) {
    console.error('error looking if user eistrs', err);
    res.status(500).json({ exists: false });
  }
});

//IDK ROUTES
router.get('/test', (req, res) => {
  res.json({message: "test works"});
});

router.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/favicon.ico'));
});

module.exports = router;