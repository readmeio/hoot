var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/whooter');

var app = express();

// Receive JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Serve everything in /public
app.use(express.static('public'));
app.set('views', './public/views') 

app.post('/api/post', function (req, res) {
  res.send({
    'post': req.body.post,
    'username': 'gkoberger',
  });;
});

app.set('view engine', 'pug');
app.get('/', (req, res) => res.redirect('/home'));
app.get('/:page', function (req, res, next) {
  var page = req.params.page;

  if(['login', 'home'].indexOf(page) < 0) return next();
  
  res.render(page);
});

app.listen(4007, function () {
  console.log('Whooter app listening on port 4007!');
});
