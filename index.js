require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('Missing `JWT_SECRET` env variable');
}

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const atob = require('atob');
const cors = require('cors');
const { sign } = require('jsonwebtoken');

const MongoMemoryServer = require('mongodb-memory-server').default;

const mongoServer = new MongoMemoryServer();

mongoServer.getConnectionString().then(mongoUri =>
  mongoose.connect(
    mongoUri,
    { useNewUrlParser: true },
  ),
);

const Filter = require('bad-words');

const filter = new Filter({
  placeHolder: 'X',
});

require('./api/tweet.model.js');

const Hoot = mongoose.model('Hoot');

const app = express();

// Receive JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(cookieParser());

// Serve everything in /public
app.use(express.static('public'));
app.set('views', './public/views');

app.use((req, res, next) => {
  if (req.headers.authorization) {
    try {
      const b64 = req.headers.authorization.split(' ')[1];
      const [user] = atob(b64).split(':');
      req.user = user;
    } catch (e) {} // eslint-disable-line no-empty
  } else {
    req.user = req.cookies.username;
  }
  res.locals.user = req.user;
  next();
});

app.use((req, res, next) => {
  const user = {
    name: req.user,
    apiKey: req.user,
  };

  const jwt = sign(user, process.env.JWT_SECRET);
  res.locals.jwt = `http://developers.hoot.at/v2.0.0?auth_token=${jwt}`;
  next();
});

/*
 * @oas [post] /hoot
 * description: Post a new hoot to the site
 * requestBody:
 *   description: The hoot you want to post
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/Hoot'
 * security:
 *   - basicAuth: []
 */

app.post('/api/hoot', (req, res) => {
  if (!req.body.post) return res.status(500).send('You need to include a body');
  const tweet = new Hoot({
    post: filter.clean(req.body.post),
    replyto: req.body.replyto || undefined,
    username: req.user,
  });

  return tweet.save((err, _tweet) => {
    if (err) {
      const errors = [];
      Object.keys(err.errors).forEach(key => {
        errors.push(err.errors[key].message);
      });
      return res.status(500).send(errors[0]);
    }

    return _tweet.populate('replyto', (_err, __tweet) => {
      res.json(__tweet);
    });
  });
});

/*
 * @oas [get] /timeline
 * description: Get a list of all tweets in reverse chronological order
 * responses:
 *   '200':
 *     description: successful operation
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Hoot'
 * security:
 *   - basicAuth: []
 */

app.get('/api/timeline', (req, res) => {
  Hoot.find({})
    .sort('-createdAt')
    .limit(500)
    .populate('replyto')
    .exec((err, hoots) => {
      res.json(hoots);
    });
});

/*
 * @oas [get] /timeline/{username}
 * description: Get a list of all tweets from a user
 * parameters:
 *   - (path) username* {string} The username you want to see hoots for
 * responses:
 *   '200':
 *     description: successful operation
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Hoot'
 * security:
 *   - basicAuth: []
 */

app.get('/api/timeline/:username', (req, res) => {
  Hoot.find({ username: req.params.username })
    .sort('-createdAt')
    .populate('replyto')
    .exec((err, hoots) => {
      res.json(hoots);
    });
});

/*
 * @oas [get] /hoot/{id}
 * description: Get a specific hoot
 * parameters:
 *   - (path) id* {string} The id of the hoot you want
 * responses:
 *   '200':
 *     description: successful operation
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Hoot'
 * security:
 *   - basicAuth: []
 */

app.get('/api/hoot/:id', (req, res) => {
  Hoot.findOne({ _id: req.params.id }, (err, hoot) => {
    res.json(hoot);
  });
});

/*
 * @oas [post] /hoot/{id}/favorite
 * description: Favorite a hoot
 * requestBody:
 *   description: The hoot you want to post
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/Hoot'
 * parameters:
 *   - (path) id* {string} The id of the hoot you want
 * responses:
 *   '200':
 *     description: successful operation
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Hoot'
 * security:
 *   - basicAuth: []
 */

app.post('/api/hoot/:id/favorite', (req, res) => {
  Hoot.findOne({ _id: req.params.id }, (err, hoot) => {
    hoot.favorites = hoot.favorites.filter(favorite => favorite !== req.user);

    if (req.body.favorited === true || req.body.favorited === 'true') {
      hoot.favorites.push(req.user);
    }
    hoot.save((_err, _hoot) => {
      res.json(_hoot);
    });
  });
});

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

const port = process.env.PORT || 4007;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`hoot.at app started at http://localhost:${port}`);
});
