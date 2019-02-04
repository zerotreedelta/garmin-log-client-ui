#!/bin/bash

if [ -z "$1" ]
then
  echo "defaulting to get dev env settings"
  ENV="dev"
else
  ENV=$1
fi

cat << EOF > react_app_env.json
$(aws ssm get-parameters \
--names \
/garmin-log-client-svc/ServiceEndpoint/$ENV \
/garmin-log-client-svc/AWSServiceRegion/$ENV \
/garmin-log-client-svc/UserPoolClientId/$ENV \
/garmin-log-client-svc/UserPoolId/$ENV \
/garmin-log-client-svc/FileUploadBucketName/$ENV \
/garmin-log-client-svc/IdentityPoolId/$ENV \
--query "Parameters[*].{Name:Name,Value:Value}")
EOF