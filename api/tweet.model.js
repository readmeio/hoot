var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  username: 'string',
  post: 'string',
  replyto: { type: mongoose.Schema.ObjectId, ref: 'Hoot' },
  favorites: ['string'],
});
var Hoot = mongoose.model('Hoot', schema);
