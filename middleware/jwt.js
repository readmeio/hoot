const { sign } = require('jsonwebtoken');
const tiny = require('tiny-json-http');

const url = 'https://dash.readme.io/api/v1/';
const apiKey = process.env.API_KEY;

module.exports = async (req, res, next) => {
  // We first use the Readme API to obtain ReadMe project metadata
  // such as the project JWT secret and base URL
  // See the docs: https://docs.readme.com/developers/reference/projects#getproject
  // You can also view the the JWT Secret in ReadMe by going to
  // your ReadMe project dashboard and navigating to: Configuration -> Custom Login
  const headers = { authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` };
  let response;

  try {
    response = await tiny.get({ url, headers });
  } catch (err) {
    return res.status(401).json({ error: 'Oops! Looks like the ReadMe API key is invalid.' });
  }

  const project = response.body;

  // This is the user payload that will be securely sent to ReadMe via JWT!
  // You can read more about JWT here: https://jwt.io
  const user = {
    // id is used to identify the user and show their logs in the documentation!
    // See the docs: https://docs.readme.com/metrics/docs/showing-api-logs-to-users#section-enabling-api-logs-in-docs
    id: req.user,
    name: req.user,
    apiKey: req.user,
    // basicAuth is used to log into API Explorer!
    // See the docs: https://docs.readme.com/guides/docs/passing-data-to-jwt#section-basic-auth
    basicAuth: { user: req.user, pass: '' },
  };

  const jwt = sign(user, project.jwtSecret);

  // These local variables are the links that automatically log users into the documentation
  const docsUrl = `${project.baseUrl}reference`;
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

  return next();
};
