const express = require('express');
const path = require('path');
const Usermodel = require('./models/user');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Gun = require('gun');
const http = require('http');
const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');

const { RateLimiter, AuthRateLimiter } = require('./middleware/ratelimiter')
const { logger } = require('./middleware/logger');
const { VerifyToken } = require('./middleware/verifytoken');
const GroupModel = require('./models/group')
const { ErrorHandler } = require('./middleware/errors');


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
    `${process.env.APP_URL}/gun`,
  ]
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to mongodb db'))
  .catch((err) => console.log('Could not connect to the mongodb', err));


app.use(express.json({ limit: '50kb'}));
app.use(express.urlencoded({ extended : true }));
app.use(logger);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      connectSrc: ["'self'", process.env.APP_URL, process.env.APP_URL.replace('https', 'wss'),],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    }
  }
}));

app.use(express.static(path.join(__dirname, '../dist')));
app.use(RateLimiter);

app.use('/login', AuthRateLimiter);
app.use('/register', AuthRateLimiter);
app.use('/login/verify', AuthRateLimiter);
app.use('/confirm', AuthRateLimiter);
app.use('/reset-password/verify', AuthRateLimiter);


app.use(AuthRoutes);
app.use(GroupRoutes);
app.use(PageRoutes);

app.use(ErrorHandler);
  
if(require.main == module) {
  server.listen(PORT, '0.0.0.0',  () =>{
    console.log(`server runnin on ${process.env.APP_URL}:${PORT}`);
  });
}
module.exports=app