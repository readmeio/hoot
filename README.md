[![](https://d3vv6lp55qjaqc.cloudfront.net/items/1M3C3j0I0s0j3T362344/Untitled-2.png)](https://readme.com)

# Hoot

[Hoot](https://hoot.at) is a simple social app that lets you hoot statuses. More importantly, it has a simple REST API written in Node and Express which you can connect to [ReadMe](https://readme.com)!

This project uses all of the following ReadMe tools and features:

- [`@readme/eslint-config`](https://github.com/readmeio/eslint-config), which ensures that this codebase conforms to ReadMe's core coding standards
  - Run `npm test` to test the codebase
- [`swagger-inline`](https://github.com/readmeio/swagger-inline) to generate a full OpenAPI document using in-line comments from the code in the `/api` directory
  - See the `swagger-inline` usage in the `/bin/openapi` directory
- [`rdme`](https://github.com/readmeio/rdme) to upload the OpenAPI to ReadMe's interactive [API Explorer](https://github.com/readmeio/api-explorer)
  - See the `rdme` usage in the `/bin/openapi` directory
- [ReadMe JWT](https://docs.readme.com/guides/docs/passing-data-to-jwt) to log users into the API documentation, which allows them to interact with the Hoot API using their Hootr login credentials
  - See this example in `/middlewares/jwt.js`
- [ReadMe API Metrics](https://readme.com/metrics), which allows users to see their API logs within the API documentation and project administrators to view insights based on API usage
  - See this example in `/middlewares/metrics.js`
  
**For setup instructions, see SETUP.md.**
