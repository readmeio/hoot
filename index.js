var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

require('./api/tweet.model.js');

var Hoot = mongoose.model('Hoot');

mongoose.connect('mongodb://localhost/whooter');

var app = express();

// Receive JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Serve everything in /public
app.use(express.static('public'));
app.set('views', './public/views') 

app.post('/api/hoot', function (req, res) {
  var tweet = new Hoot({
    'post': req.body.post,
    'replyto': req.body.replyto || undefined,
    'username': 'gkoberger',
  });

  tweet.save(function(err, _tweet) {
    _tweet.populate('replyto', function(err, _tweet) {
      res.json(_tweet);
    });
  });

});

app.get('/api/timeline', function (req, res) {
  Hoot.find({}).populate('replyto').exec(function(err, hoots) {
    res.json(hoots);
  })
});

app.get('/api/timeline/:username', function (req, res) {
  Hoot.find({username: req.params.username}, function(err, hoots) {
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
    remove(hoot.favorites, 'gkoberger');
    if(req.body.favorited === 'true') {
      hoot.favorites.push('gkoberger');
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
app.get('/:page', function (req, res, next) {
  var page = req.params.page;

  if(['login', 'home'].indexOf(page) < 0) return next();
  
  res.render(page);
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

app.listen(4007, function () {
  console.log('Whooter app listening on port 4007!');
});
