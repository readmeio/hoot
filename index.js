require('dotenv').config();

if (!process.env.API_KEY) {
  throw new Error('Oops! The ReadMe API key is missing. Check your .env file!');
}

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const utils = require('./lib/utils');

MongoMemoryServer.create().then(mongoServer => {
  const mongoUri = mongoServer.getUri();
  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

require('./lib/hoot.model');

const Hoot = mongoose.model('Hoot');

// Create some test hoots on startup so there's always some data
Hoot.create(require('./lib/fixtures'));

const app = express();

// Get project settings via ReadMe API
require('./lib/readme')(app).catch(err => {
  console.error(err);
  process.exit(1);
});

// Receive JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(cookieParser());

// Serve everything in /public
app.use(express.static('public'));
app.set('views', './public/views');

// Trust x-forwarded-* headers
app.set('trust proxy', true);

// Load middleware from the `/middleware` directory
require('./middleware')(app);

// Load API routes from the `/api` directory
app.use('/api', require('./api'));

// Load standard routes
app.set('view engine', 'pug');
app.get('/', (req, res) => res.redirect('/home'));
app.get('/login', (req, res) => {
  // If they're already logged in, don't show login page
  if (req.user) {
    // if this option is included, send them back to the ReadMe docs!
    if (req.query.readme) return res.redirect(res.locals.jwt);
    return res.redirect('/home');
  }
  return res.render('login');
});

app.get('/logout', (req, res) => {
  delete res.clearCookie('username');
  res.redirect('/');
});
app.get('/home', (req, res) => res.render('home'));

app.get('/hoot/:id', (req, res) => res.render('home', { hoot: req.params.id }));

app.get('/@:user', (req, res) => res.render('home', { username: req.params.user }));

app.listen(utils.getPort(), () => {
  console.log(`Hoot app started at ${utils.getBaseUrl()}`);
  console.log(`Listening on port ${utils.getPort()}`);
});
