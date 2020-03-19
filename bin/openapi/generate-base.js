const fs = require('fs');
const utils = require('../../lib/utils');

const definitionBase = {
  openapi: '3.0.0',
  'x-api-id': `hoot-${process.env.PROJECT_ID || 'test'}`,
  info: {
    version: '1.0',
    title: 'Hoot',
    license: {
      name: 'ISC',
    },
  },
  paths: {},
  servers: [
    {
      url: `${utils.getBaseUrl()}/api`,
    },
  ],
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
      },
    },
    schemas: {
      Hoot: {
        type: 'object',
        required: ['post'],
        properties: {
          post: {
            type: 'string',
            description: 'The under-280-character content you want to hoot',
          },
          replyto: {
            type: 'string',
            description: "Optional id of the hoot you're replying to",
          },
        },
      },
    },
  },
};

fs.writeFileSync('./bin/openapi/openapiBase.json', JSON.stringify(definitionBase, null, 2));
