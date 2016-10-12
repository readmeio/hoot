var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  username: 'string',
  post: 'string',
  replyto: 'string',
  favorites: ['string'],
});
var Hoot = mongoose.model('Hoot', schema);
