const authorization = require('./authorization');
const jwt = require('./jwt');
const metrics = require('./metrics');
const proxy = require('./proxy');

module.exports = function (app) {
  app.use(proxy);
  app.use(authorization);
  app.use(jwt);
  app.use('/api', metrics);
};
