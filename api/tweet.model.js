const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: 'string', required: true },
  post: { type: 'string', required: true },
  replyto: { type: mongoose.Schema.ObjectId, ref: 'Hoot' },
  favorites: ['string'],
  createdAt: { type: Date, default: Date.now },
});

schema.path('post').validate(post => post.length <= 140, 'Post must be under 140 characters');

module.exports = mongoose.model('Hoot', schema);
