var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var atob = require('atob');
var cors = require('cors')

var Filter = require('bad-words'),
    filter = new Filter({
      placeHolder: 'X',
    });

require('./api/tweet.model.js');

var Hoot = mongoose.model('Hoot');

mongoose.connect('mongodb://hootr:hootr123@aws-us-east-1-portal.15.dblayer.com:15594/hootr?ssl=true'); //mongodb://localhost/whooter');

var app = express();

// Receive JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.use(cookieParser())

// Serve everything in /public
app.use(express.static('public'));
app.set('views', './public/views')

app.use(function(req, res, next) {
  if(req.headers.authorization) {
    try {
      var b64 = req.headers.authorization.split(' ')[1];
      var user = atob(b64).split(':');
      req.user = user[0];
    } catch(e) { }
  } else {
    req.user = req.cookies.whooter_username;
  }
  res.locals.user = req.user;
  next();
});

/*
 * @api [post] /hoot
 * description: Post a new hoot to the site
 * parameters:
 *   - in: body
 *     name: body
 *     description: The hoot you want to post
 *     required: true
 *     schema:
 *       $ref: '#/definitions/Hoot'
 */

app.post('/api/hoot', function (req, res) {
  if (!req.body.post) return res.status(500).send("You need to include a body");
  var tweet = new Hoot({
    'post': filter.clean(req.body.post),
    'replyto': req.body.replyto || undefined,
    'username': req.user,
  });

  tweet.save(function(err, _tweet) {
    if (err) {
      var errors = [];
      Object.keys(err.errors).forEach(function(key) {
        errors.push(err.errors[key].message);
      });
      return res.status(500).send(errors[0]);
    }

    _tweet.populate('replyto', function(err, _tweet) {
      res.json(_tweet);
    });
  });

});

/*
 * @api [post] /hoot/:category
 * description: Post a hoot to a category
 * parameters:
 *   - in: body
 *     name: body
 *     description: The hoot you want to post
 *     required: true
 *     schema:
 *       $ref: '#/definitions/Hoot'
 */

app.post('/api/hoot/:category', function (req, res) {
  if (!req.body.post) return res.status(500).json({"error": "You need to include a post"});
  var tweet = new Hoot({
    'post': req.body.post,
    'category': req.params.category,
    'username': req.user,
    //'replyto': req.query.replyto || undefined,
  });

  tweet.save(function(err, _tweet) {
    if (err) {
      var errors = [];
      Object.keys(err.errors).forEach(function(key) {
        errors.push(err.errors[key].message);
      });
      return res.status(500).send(errors[0]);
    }

    _tweet.populate('replyto', function(err, _tweet) {
      res.json(_tweet);
    });
  });

});

/*
 * @api [get] /timeline
 * description: Get a list of all tweets in reverse chronological order
 * responses:
 *   '200':
 *     description: successful operation
 *     schema:
 *       type: array
 *       items:
 *         $ref: '#/definitions/Hoot'
 */

app.get('/api/timeline', function (req, res) {
  Hoot.find({}).sort('-createdAt').limit(500).populate('replyto').exec(function(err, hoots) {
    res.json(hoots);
  })
});

/*
 * @api [get] /timeline/{username}
 * description: Get a list of all tweets from a user
 * parameters:
 *   - (path) username* {string} The username you want to see hoots for
 * responses:
 *   '200':
 *     description: successful operation
 *     schema:
 *       type: array
 *       items:
 *         $ref: '#/definitions/Hoot'
 */

app.get('/api/timeline/:username', function (req, res) {
  Hoot.find({username: req.params.username}).sort('-createdAt').populate('replyto').exec(function(err, hoots) {
    res.json(hoots);
  })
});

/*
 * @api [get] /hoot/{id}
 * description: Get a specific hoot
 * parameters:
 *   - (path) id* {string} The id of the hoot you want
 * responses:
 *   '200':
 *     description: successful operation
 *     schema:
 *       $ref: '#/definitions/Hoot'
 */

app.get('/api/hoot/:id', function (req, res) {
  Hoot.findOne({_id: req.params.id}, function(err, hoot) {
    res.json(hoot);
  })
});

/*
 * @api [post] /hoot/{id}/favorite
 * description: Favorite a hoot
 * parameters:
 *   - (path) id* {string} The id of the hoot you want
 *   - in: body
 *     name: body
 *     required: true
 *     schema:
 *       type: object
 *       required: ['favorited']
 *       properties:
 *         favorited:
 *           type: boolean
 *           description: Should we add or remove a favorite?
 * responses:
 *   '200':
 *     description: successful operation
 *     schema:
 *       $ref: '#/definitions/Hoot'
 */

app.post('/api/hoot/:id/favorite', function (req, res) {
  Hoot.findOne({_id: req.params.id}, function(err, hoot) {
    remove(hoot.favorites, req.user);
    if(req.body.favorited === true || req.body.favorited === 'true') {
      hoot.favorites.push(req.user);
    }
    hoot.save(function(err, _hoot) {
      res.json(_hoot);
    });
  })

  function remove(arr, item) {
    for(var i = arr.length; i--;) {
      if(arr[i] === item) {
        arr.splice(i, 1);
      }
    }
  }
});


app.set('view engine', 'pug');
app.get('/', (req, res) => res.redirect('/home'));
app.get('/logout', function (req, res, next) {
  delete res.clearCookie('whooter_username');
  res.redirect('/');
});
app.get('/:page', function (req, res, next) {
  var page = req.params.page;

  if(['login', 'home'].indexOf(page) < 0) return next();

  res.render(page, {});
});

app.get('/hoot/:id', function (req, res, next) {
  res.render('home', {
    'hoot': req.params.id,
  });
});

app.get('/@:user', function (req, res, next) {
  res.render('home', {
    'username': req.params.user,
  });
});

var port = process.env.PORT || 4007;
app.listen(port, function () {
  console.log('Whooter app listening on port ' + port + '!');
});
