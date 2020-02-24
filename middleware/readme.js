// This obtains ReadMe project metadata such as your project base URL and JWT secret!
// You can also view your JWT
// See the docs: https://docs.readme.com/developers/reference/projects#getproject

// TODO: should this set .env variables instead of loading this every time?
const tiny = require('tiny-json-http');

const url = 'https://dash.readme.io/api/v1/';

const apiKey = process.env.API_KEY;

module.exports = function(app) {
  app.use(async (req, res, next) => {
    const headers = { authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` };
    let response;

    try {
      response = await tiny.get({ url, headers });
    } catch (err) {
      return res.json(401, { error: 'Oops! Looks like the ReadMe API key is invalid.' });
    }

    req.project = response.body;

    return next();
  });
};
