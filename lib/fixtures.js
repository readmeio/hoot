const utils = require('./utils');

module.exports = [
  {
    _id: '5c3e39af342143680d31775c',
    post: 'Hello world!',
    username: 'gkoberger',
    likes: ['gkoberger', 'owlivia'],
    createdAt: utils.minutesAgo(35),
  },
  {
    post: 'Hoot hoot',
    username: 'owlbert',
    createdAt: utils.minutesAgo(27),
  },
  {
    post: "I'm a bit of a night owl!",
    username: 'owlivia',
    likes: ['owlbert'],
    createdAt: utils.minutesAgo(14),
  },
  {
    post: '@gkoberger hello there!',
    username: 'owlbert',
    replyto: '5c3e39af342143680d31775c',
    createdAt: utils.minutesAgo(0),
  },
];
