const readmeio = require('readmeio');

module.exports = function(app) {
  app.use(
    '/api/*',
    readmeio.metrics(process.env.API_KEY, req => ({
      id: req.user,
      label: req.user,
      email: req.user,
    }))
  );
};
