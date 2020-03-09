const proxy = require('./proxy');
const authorization = require('./authorization');
const jwt = require('./jwt');
const metrics = require('./metrics');

module.exports = function(app) {
  proxy(app);
  authorization(app);
  jwt(app);
  metrics(app);
};
