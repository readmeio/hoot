#!/bin/bash
bash ./bin/openapi/generate-oas-definition.sh
if [ -z "$API_SPEC_ID" ]; then
  echo "No API Spec ID provided, uploading a new API definition"
  npx rdme swagger \
    --key $API_KEY \
    openapi.json
else
  echo "API Spec ID provided (${API_SPEC_ID}), updating an existing API definition"
  npx rdme swagger \
    --key $API_KEY \
    --id $API_SPEC_ID \
    openapi.json
fi;
