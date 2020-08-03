const bent = require('bent');

// Allows for testing against a local instance of ReadMe
const url =
  process.env.NODE_ENV === 'localhost' ? 'http://dash.readme.local:3000/api/v1/' : 'https://dash.readme.io/api/v1/';

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
    response = await bent(url, headers, 'json')();
  } catch (err) {
    const error = await err.json();
    console.error(`Error validating the ReadMe API Key in your .env: ${error.message}`);
    throw new Error(error.suggestion);
  }

  app.set('project', response);
};
