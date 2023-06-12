const { sign } = require('jsonwebtoken');

// This middleware demonstrates how to use Hoot login credentials to log users
// into the Hoot ReadMe documentation using Custom Login and JWT (JSON Web Token)
// Read our docs to learn more: https://docs.readme.com/guides/docs/custom-login-with-readme

module.exports = async (req, res, next) => {
  // The ReadMe project data is obtained via API in bin/readme.js
  const project = req.app.get('project');

  // If the user is not logged in, we give them a standard link to the API Docs (see public/views/template.pug)
  const docsUrl = `${project.baseUrl}/reference`;
  res.locals.docsUrl = docsUrl;

  if (req.user) {
    // The user is logged in, so we construct the JWT payload. This is sent to ReadMe to log them into the docs!
    // You can read more about JWT (JSON Web Token) here: https://jwt.io
    const user = {
      // The 'id' field below is used in the payload to identify the user and show their logs in the documentation!
      // See the docs: https://docs.readme.com/metrics/docs/showing-api-logs-to-users#section-enabling-api-logs-in-docs
      id: req.user,
      name: req.user,
      email: `${req.user}@hoot.at`,
      apiKey: req.user,
      // The basicAuth object below contains the 'user' and 'pass' fields needed to log the user into API Explorer!
      // See the docs: https://docs.readme.com/guides/docs/passing-data-to-jwt#section-basic-auth
      basicAuth: { user: req.user, pass: '' },
    };

    const jwt = sign(user, project.jwtSecret);

    // Instead of giving the user the standard link to the API docs we created in res.locals.docsUrl,
    // we construct a "magic" link that contains the JWT. This link will automatically log the user into the docs!
    res.locals.jwt = `${docsUrl}?auth_token=${jwt}`;

    // If you're connecting to API Metrics via our Cloudflare worker,
    // you'll want to set response headers as shown below.
    // More info: https://docs.readme.com/metrics/docs/sending-logs-to-readme-with-cloudflare
    res.set('x-readme-id', req.user);
    res.set('x-readme-label', req.user);
    res.set('x-readme-email', req.user);
  }

  return next();
};
