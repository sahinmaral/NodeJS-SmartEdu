const express = require('express');
const app = express();
const port = 3000;

// Template Engines
app.set('view engine', 'ejs')

// Middlewares
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.status(200).render('index',{page_name:'index'});
});

app.get('/about', (req, res) => {
  res.status(200).render('about',{page_name:'about'});
});

app.get('/contact', (req, res) => {
  res.status(200).render('contact',{page_name:'contact'});
});

app.get('/courses', (req, res) => {
  res.status(200).render('courses',{page_name:'courses'});
});

app.get('/login', (req, res) => {
  res.status(200).render('login');
});

app.get('/register', (req, res) => {
  res.status(200).render('register');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
