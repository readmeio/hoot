const { sign } = require('jsonwebtoken');

module.exports = function(app) {
  app.use(async (req, res, next) => {
    const user = {
      // id is used to show logs in the documentation! See: https://docs.readme.com/metrics/docs/showing-api-logs-to-users#section-enabling-api-logs-in-docs
      id: req.user,
      name: req.user,
      apiKey: req.user,
      // basicAuth is used to log into API Explorer! See: https://docs.readme.com/guides/docs/passing-data-to-jwt#section-basic-auth
      basicAuth: { user: req.user, pass: '' },
    };

    // The JWT secret was retrieved using the ReadMe API (see `middleware/readme.js`)
    // You can also view the the JWT Secret in ReadMe by going to
    // your ReadMe project dashboard and navigating to: Configuration -> Custom Login

    const jwt = sign(user, req.project.jwtSecret);
    const docsUrl = `${req.project.baseUrl}reference`;
    res.locals.docsUrl = docsUrl;
    res.locals.jwt = `${docsUrl}?auth_token=${jwt}`;

    if (req.user) {
      // If you're connecting to metrics via our Cloudflare worker,
      // you'll want to set response headers as shown below.
      // More info: https://docs.readme.com/metrics/docs/sending-logs-to-readme-with-cloudflare
      res.set('x-readme-id', req.user);
      res.set('x-readme-label', req.user);
      res.set('x-readme-email', req.user);
    }

    next();
  });
};
