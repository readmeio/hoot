const proxy = require('./proxy');
const authorization = require('./authorization');
const jwt = require('./jwt');
const metrics = require('./metrics');

module.exports = function(app) {
  app.use(proxy);
  app.use(authorization);
  app.use(jwt);
  app.use(metrics);
};
