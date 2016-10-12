var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  username: 'string',
  post: 'string',
  replyto: { type: mongoose.Schema.ObjectId, ref: 'Hoot' },
  favorites: ['string'],
  createdAt: { type: Date, default: Date.now },
});
var Hoot = mongoose.model('Hoot', schema);
