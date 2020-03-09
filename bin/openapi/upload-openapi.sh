#!/bin/bash
bash ./bin/openapi/generate-oas-definition.sh
echo "Loading rdme..."
npx rdme swagger --key $API_KEY
