const fs = require('fs');

const utils = require('../../lib/utils');

const definitionBase = {
  openapi: '3.0.0',
  // The CORS proxy should be disabled if Hoot is running on localhost!
  // Docs: https://docs.readme.com/guides/docs/openapi-extensions#section-cors-proxy-enabled
  'x-proxy-enabled': !utils.getBaseUrl().includes('localhost'),
  info: {
    version: '1.0',
    title: 'Hoot',
    license: {
      name: 'ISC',
    },
  },
  paths: {},
  tags: [
    {
      name: 'Hoots',
      description: 'This endpoint is for individual Hoots.',
    },
    {
      name: 'Timeline',
      description: 'This endpoint is for Hoot timelines.',
    },
  ],
  servers: [
    {
      url: 'https://{customDomain}/api',
      variables: {
        customDomain: {
          default: 'hoot.at',
        },
      },
    },
    {
      url: 'https://{subdomain}.glitch.me/api',
      variables: {
        subdomain: {
          default: 'hoot',
        },
      },
    },
    {
      url: 'http://localhost:4007/api',
    },
  ],
  components: {
    parameters: {
      id: {
        name: 'id',
        in: 'path',
        schema: { type: 'string' },
        description: 'The id of the hoot you want',
        required: true,
        example: '5c3e39af342143680d31775c',
      },
    },
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
      },
    },
    schemas: {
      HootPost: {
        type: 'object',
        required: ['post'],
        properties: {
          post: {
            type: 'string',
            description: 'The under-280-character content you want to hoot',
            example: 'just setting up my hoot',
            maxLength: 280,
          },
        },
      },
      ReplyToString: {
        type: 'object',
        properties: {
          replyto: {
            type: 'string',
            description: 'Optional id of the hoot being replied to',
            example: '5c3e39af342143680d31775c',
          },
        },
      },
      NewHoot: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/HootPost',
          },
          {
            $ref: '#/components/schemas/ReplyToString',
          },
        ],
      },
      AdditionalHootProperties: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'The unique, auto-generated ID for the hoot',
            example: '5c3e39af342143680d31775c',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          likes: {
            type: 'array',
            description: 'An array containing usernames of the users that liked this hoot',
            items: {
              type: 'string',
              example: 'owlet',
            },
          },
          username: {
            type: 'string',
            example: 'owlbert',
            description: 'The username for the user that created this hoot',
          },
        },
      },
      SmolHoot: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/AdditionalHootProperties',
          },
          {
            $ref: '#/components/schemas/HootPost',
          },
          {
            $ref: '#/components/schemas/ReplyToString',
          },
        ],
      },
      ReplyToObject: {
        type: 'object',
        required: ['post'],
        properties: {
          replyto: {
            type: 'object',
            $ref: '#/components/schemas/SmolHoot',
          },
        },
      },
      BigHoot: {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/AdditionalHootProperties',
          },
          {
            $ref: '#/components/schemas/HootPost',
          },
          {
            $ref: '#/components/schemas/ReplyToObject',
          },
        ],
      },
    },
  },
};

fs.writeFileSync('./bin/openapi/openapiBase.json', JSON.stringify(definitionBase, null, 2));
