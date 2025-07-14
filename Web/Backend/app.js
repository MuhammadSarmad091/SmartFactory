// File Structure:
// ├── app.js
// ├── routes/
// │   ├── index.js
// │   ├── users.js
// │   └── auth.js     <-- JWT login route here
// ├── models/
// │   └── User.js     <-- Mongoose User model
// ├── middleware/
// │   └── auth.js     <-- JWT auth middleware
// ├── .env            <-- Store MONGO_URI and JWT_SECRET
// ├── package.json

//----------------------------------------
// app.js
//----------------------------------------
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var authRouter = require('./routes/auth');

var app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);


module.exports = app;







//----------------------------------------
// Example usage of auth middleware (in routes/users.js)
//----------------------------------------
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}` });
});

module.exports = router;
