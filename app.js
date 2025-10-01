const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const indexRouter = require('./routes/indexRouter');

// Set view engine to accept ejs files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure app to have access to form inputs
app.use(express.urlencoded({ extended: true }));

// Indicate where to serve static files from
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use((req, res, next) => {
  res.render('404');
});
app.use((err, req, res, next) => {
  res.render('error', { message: err.message, route: err.route });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }

  console.log('App listening for requests on port:', PORT);
});
