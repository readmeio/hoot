#!/bin/bash
bash ./bin/openapi/generate.sh
echo "Loading rdme..."
npx rdme swagger --key $API_KEY
