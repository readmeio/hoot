require('dotenv').config();

if (!process.env.API_KEY) {
  throw new Error('Missing `API_KEY` env variable');
}

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const utils = require('./lib/utils');
const MongoMemoryServer = require('mongodb-memory-server').default;

const mongoServer = new MongoMemoryServer();

mongoServer
  .getConnectionString()
  .then(mongoUri => mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }));

require('./bin/hoot.model.js');

const Hoot = mongoose.model('Hoot');

// Create some test hoots on startup so there's always some data
Hoot.create(require('./lib/fixtures'));

const app = express();

// Get project settings via ReadMe API
require('./bin/readme.js')(app).catch(err => {
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
app.get('/logout', (req, res) => {
  delete res.clearCookie('username');
  res.redirect('/');
});
app.get('/:page', (req, res, next) => {
  const { page } = req.params;

  if (['login', 'home'].indexOf(page) < 0) return next();

  return res.render(page, {});
});

app.get('/hoot/:id', (req, res) => res.render('home', { hoot: req.params.id }));

app.get('/@:user', (req, res) => res.render('home', { username: req.params.user }));

app.listen(utils.getPort(), () => {
  console.log(`hoot.at app started at ${utils.getBaseUrl()}`);
});
