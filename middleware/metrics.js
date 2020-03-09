const readmeio = require('readmeio');

// This is the middleware for sending request and response data to Readme's API Metrics!
// See the docs: https://docs.readme.com/metrics/docs/sending-logs-to-readme-with-nodejs

module.exports = function(app) {
  app.use(
    '/api/*',
    readmeio.metrics(process.env.API_KEY, req => ({
      // In order to let the user view their own logs in the documentation,
      // The id below must correspond to the 'id' that's passed in via JWT
      // when users log into the documentation. See middlewares/jwt.js
      // as well as the documentation: https://docs.readme.com/metrics/docs/showing-api-logs-to-users#section-enabling-api-logs-in-docs
      id: req.user,
      label: req.user,
      email: req.user,
    }))
  );
};
