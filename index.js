var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

require('./api/tweet.model.js');

var Hoot = mongoose.model('Hoot');

mongoose.connect('mongodb://hootr:hootr123@aws-us-east-1-portal.15.dblayer.com:15594/hootr?ssl=true'); //mongodb://localhost/whooter');

var app = express();

// Receive JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())

// Serve everything in /public
app.use(express.static('public'));
app.set('views', './public/views') 

app.use(function(req, res, next) {
  req.user = req.cookies.whooter_username;
  res.locals.user = req.user;
  next();
});

/*
 * @api [post] /api/hoot
 * parameters:
 *   -testsaksdfj
 */

app.post('/api/hoot', function (req, res) {
  var tweet = new Hoot({
    'post': req.body.post,
    'replyto': req.body.replyto || undefined,
    'username': req.user,
  });

  tweet.save(function(err, _tweet) {
    _tweet.populate('replyto', function(err, _tweet) {
      res.json(_tweet);
    });
  });

});

app.get('/api/timeline', function (req, res) {
  Hoot.find({}).sort('-createdAt').populate('replyto').exec(function(err, hoots) {
    res.json(hoots);
  })
});

app.get('/api/timeline/:username', function (req, res) {
  Hoot.find({username: req.params.username}).sort('-createdAt').populate('replyto').exec(function(err, hoots) {
    res.json(hoots);
  })
});

app.get('/api/hoot/:id', function (req, res) {
  Hoot.find({_id: req.params.id}, function(err, hoots) {
    res.json(hoots);
  })
});

app.post('/api/hoot/:id/favorite', function (req, res) {
  Hoot.findOne({_id: req.params.id}, function(err, hoot) {
    remove(hoot.favorites, req.user);
    if(req.body.favorited === 'true') {
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
