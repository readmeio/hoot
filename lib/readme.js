const tiny = require('tiny-json-http');

const url = 'https://dash.readme.io/api/v1/';
const apiKey = process.env.API_KEY;

module.exports = async app => {
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
    throw new Error('Oops! The ReadMe API key is invalid.');
  }

  app.set('project', response.body);
};
