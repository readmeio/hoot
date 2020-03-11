#!/bin/bash
if [[ -z "${API_KEY}" ]]; then
  echo "Oops! Unable to locate your API key! Is your .env file populated? If so, see the FAQ in SETUP.md for more info."
else
  bash ./bin/openapi/generate.sh
  echo "Loading rdme..."
  npx rdme swagger --key $API_KEY
fi
