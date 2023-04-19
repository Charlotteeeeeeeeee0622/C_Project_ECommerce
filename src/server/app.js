// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define flash and session 
const flash = require('connect-flash');
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());


const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
}));


// Connect to MongoDB
const mongoose = require('mongoose');
require('dotenv').config();
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const database = process.env.DATABASE;

// Establish a connection with the Mongo Database
// Get the username, password, host, and databse from the .env file
const mongoDB =
  "mongodb+srv://" +
  username +
  ":" +
  password +
  "@" +
  host +
  "/" +
  database;
mongoose.connect(mongoDB, { useNewUrlParser: true, retryWrites: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected');
});


// Define User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);


// app.use('/', indexRouter);
// app.use('/users', usersRouter);


// // import login from '../server/views/login.ejs'
// app.get('/login', (req, res) => {
//   const message = req.flash('message');
//   res.render('login', { message });
// });


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });



app.get('/', async (req, res) => {
  res.send('hellol world')
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign up endpoint
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in endpoint
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('message', 'Invalid email or password');
      return res.redirect('/signin');
    }

    // Check password
    if (user.password !== password) {
      req.flash('message', 'Invalid email or password');
      return res.redirect('/signin');
    }

    // If authentication is successful, redirect to the home page
    return res.redirect('/');

  } catch (error) {
    console.error(error);
    req.flash('message', 'Internal server error');
    return res.redirect('/signin');
  }
});

// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// app.put('/update-password', async (req, res) => {
//   const { userId, oldPassword, newPassword, confirmPassword } = req.body;
//   console.log(req.body);
//   try {
//     // Check if user exists
//     const user = await User.find({ userId });// findone-->find
//     console.log(user)
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email' });
//     }


//     // Check old password
//     if (user.password !== oldPassword) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();
//     // // Check old password
//     // const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
//     // if (!isPasswordMatch) {
//     //   return res.status(401).json({ message: 'Invalid password' });
//     // }

//     //  // Update password
//     //  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
//     //  user.password = hashedNewPassword;
//     //  await user.save();

//     return res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Update Password Endpoint
app.put('/update-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  console.log(req.body);
  try {
    // Check if user exists
    const user = await User.findOne({ email }); // Use email instead of userId
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Check old password
    if (user.password !== oldPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

module.exports = app;