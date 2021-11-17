/* eslint-disable no-param-reassign */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();
const dbUri = process.env.SERVER_DB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};

mongoose.connect(dbUri, options, (err) => {
  console.log(err? err : 'Established connection with mongodb!');
});

const app = express();
app.set('port', (process.env.PORT || 3001));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const user_route = require('./user_management/user_route')

app.use('/api/user', user_route);

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
