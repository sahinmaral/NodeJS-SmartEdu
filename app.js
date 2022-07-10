const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
require('dotenv').config();
const toastr = require('express-toastr');
const methodOverride = require('method-override');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();
const port = 3000;

// Connect db
mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
  console.log('MongoDB : Connected');
});

// Template Engines
app.set('view engine', 'ejs');

// Global Variable

global.userIN = null;

// Middlewares

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_STRING,
    }),
  })
);
app.use(flash());
app.use(toastr());
app.use((req, res, next) => {
  res.locals.toasts = req.toastr.render();
  next();
});
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

// Routes

app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
