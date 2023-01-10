echo "$( jq '.scriptFile = "../dist/check-customer/index.js"' ./check-customer/function.json)" > ./check-customer/function.json
echo "$( jq '.scriptFile = "../dist/business-process/index.js"' ./business-process/function.json)" > ./business-process/function.json
echo "$( jq '.scriptFile = "../dist/business-process-start/index.js"' ./business-process-start/function.json)" > ./business-process-start/function.json
echo "$( jq '.scriptFile = "../dist/finalize/index.js"' ./finalize/function.json)" > ./finalize/function.json
echo "$( jq '.scriptFile = "../dist/get-account-no/index.js"' ./finalize/function.json)" > ./get-account-no/function.json
echo "$( jq '.scriptFile = "../dist/internal-queue/index.js"' ./internal-queue/function.json)" > ./internal-queue/function.json
echo "$( jq '.scriptFile = "../dist/main/index.js"' ./main/function.json)" > ./main/function.json
echo "$( jq '.scriptFile = "../dist/mark-send-to-decision/index.js"' ./mark-send-to-decision/function.json)" > ./mark-send-to-decision/function.json
echo "$( jq '.scriptFile = "../dist/process-id/index.js"' ./process-id/function.json)" > ./process-id/function.json
echo "$( jq '.scriptFile = "../dist/reject/index.js"' ./reject/function.json)" > ./reject/function.json
echo "$( jq '.scriptFile = "../dist/reject-customer-status/index.js"' ./reject-customer-status/function.json)" > ./reject-customer-status/function.json

