var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var fs = require('fs');

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

app.get('/avatar/:avatar.svg', function (req, res, next) {

  var colors = [
    ['#f9A02D', '#47AE5F', '#318348', '#184E26'],
    ['#D92D28', '#CAE242', '#656623', '#314E2A'],
    ['#E27E25', '#EDBD7F', '#A6855C', '#6A553D'],
    ['#D92D28', '#BE9F5C', '#D9D593', '#51321C'],
    ['#E89E38', '#ACA07E', '#53493E', '#781353'],
    ['#EEF64A', '#7C7A78', '#C5C6BE', '#D91A1B'],
    ['#E27E25', '#3C312C', '#ACA07E', '#EDBD7F'],
    ['#E89E38', '#A78151', '#664129', '#51321C'],
    ['#D92D28', '#445EA4', '#171417', '#1E1F81'],
    ['#D92D28', '#A5CD43', '#6FAA49', '#314E2A'],
    ['#EEF64A', '#D9D593', '#D12073', '#1E1980'],
    ['#D92D28', '#E6B5AE', '#DB6F90', '#A4121D'],
    ['#E27E25', '#CAE242', '#679F82', '#DB6F90'],
    ['#EEF64A', '#D92D28', '#E89E38', '#A4121D'],
    ['#D92D28', '#679F82', '#E0E1DB', '#344E60'],
    ['#D92D28', '#EDF686', '#B4CB37', '#656623'],
    ['#D92D28', '#6C9FC5', '#1E1F81', '#E89E38'],
    ['#E27E25', '#B6DCCC', '#679F82', '#3A5763'],
    ['#A4121D', '#D15868', '#E4D6A9', '#A54754'],
  ];

  var owlId = (parseInt(require('md5')(req.params.avatar), 16) % 14)+1;
  var colorId = (parseInt(require('md5')(req.params.avatar), 16) % colors.length);

  var color = colors[colorId];

  var avatar = fs.readFileSync('./avatars/owl'+owlId+'.svg').toString();
  avatar = avatar.replace(/\[a\]/g, color[1]);
  avatar = avatar.replace(/\[b\]/g, color[2]);
  avatar = avatar.replace(/\[c\]/g, color[3]);
  avatar = avatar.replace(/\[beak\]/g, color[0]);

  res.setHeader("Content-Type", "image/svg+xml")
  res.send(avatar);
});

var port = process.env.PORT || 4007;
app.listen(port, function () {
  console.log('Whooter app listening on port ' + port + '!');
});
