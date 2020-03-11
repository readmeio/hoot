#!/bin/bash
echo "Generating OpenAPI document with swagger-inline..."
node ./bin/openapi/generate-base.js
npx swagger-inline './api/*.js' --base ./bin/openapi/openapiBase.json > openapi.json
echo "Generated openapi.json!"
