#!/bin/bash
echo "Generating OpenAPI document!"
node ./bin/openapi/generate-oas-base.js
npx swagger-inline './api/*.js' --base ./bin/openapi/openapiBase.json > openapi.json
