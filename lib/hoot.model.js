const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: 'string', required: true },
  post: { type: 'string', required: true },
  replyto: { type: mongoose.Schema.ObjectId, ref: 'Hoot' },
  likes: ['string'],
  createdAt: { type: Date, default: Date.now },
});

schema.path('post').validate(post => post.length <= 280, 'Post must be under 280 characters');

module.exports = mongoose.model('Hoot', schema);
