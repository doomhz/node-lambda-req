#!/usr/bin/env bash

WORK_DIR=`pwd`
FUNCTION_NAME="jokes"
PAYLOAD='{"task":"joke","params":{"id":101}}'
OUTPUT_FILE=result.log

aws lambda invoke \
  --function-name $FUNCTION_NAME \
  --payload $PAYLOAD \
  $OUTPUT_FILE
