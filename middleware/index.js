const proxy = require('./proxy');
const readme = require('./readme');
const authorization = require('./authorization');
const jwt = require('./jwt');
const metrics = require('./metrics');

module.exports = function(app) {
  readme(app);
  proxy(app);
  authorization(app);
  jwt(app);
  metrics(app);
};
