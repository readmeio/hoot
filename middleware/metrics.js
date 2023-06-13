const readmeio = require('readmeio');

// This is the middleware for sending request and response data to Readme's API Metrics!
// See the docs: https://docs.readme.com/main/docs/sending-logs-to-readme-with-nodejs

module.exports = (req, res, next) => {
  if (req.user) {
    readmeio.log(process.env.API_KEY, req, res, {
      apiKey: req.user,
      label: req.user,
      email: req.email,
    });
  }

  return next();
};
