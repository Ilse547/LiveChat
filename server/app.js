const express = require('express');
const path = require('path');
const Usermodel = require('./models/user');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Gun = require('gun');
const http = require('http');
const helmet = require('helmet');

const { RateLimiter, AuthRateLimiter } = require('./middleware/ratelimiter')
const { logger } = require('./middleware/logger');
const { VerifyToken } = require('./middleware/verifytoken');
const GroupModel = require('./models/group')

//ROUTES
const AuthRoutes = require('./routes/auth');
const GroupRoutes = require('./routes/group');
const PageRoutes = require('./routes/pages');


dotenv.config();


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

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
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    }
  }
}));

app.use(express.static(path.join(__dirname, '../dist')));
app.use(RateLimiter);

app.use('/login', AuthRateLimiter);
app.use('/register', AuthRateLimiter);


app.use(AuthRoutes);
app.use(GroupRoutes);
app.use(PageRoutes);
  
if(require.main == module) {
  server.listen(PORT, '0.0.0.0',  () =>{
    console.log(`server runnin on http://localhost:${PORT}`);
  });
}
module.exports=app