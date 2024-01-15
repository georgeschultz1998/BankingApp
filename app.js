// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the main Express application. It sets up middleware,
// view engine configuration, and routing. The application includes routes for views,
// users, and loans. Additionally, it includes session handling and a middleware to
// set the user object in the request based on the session.


const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');

const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');
const loanRouter = require('./routes/loanRoutes');
const User = require('./models/userModel'); // Import the User model

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'ASU Rules!',
  resave: true,
  saveUninitialized: false
}));

// Add the middleware to set the user object in the request
app.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).exec();
      if (user) {
        req.user = user; // Set the user object in the request
      }
    } catch (error) {
      console.error(error);
    }
  }
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/loans', loanRouter);

module.exports = app;
