const express = require('express');
const mongoose = require('mongoose');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect db
mongoose.connect('mongodb://localhost/smartedu-db').then(() => {
  console.log('MongoDB : Connected');
});

// Template Engines
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', pageRoute);
app.use('/courses', courseRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
