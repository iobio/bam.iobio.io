#!/bin/bash

# build vue app
if [[ $1 == "prod" ]]; then
  echo "** Building prod **"
  NODE_ENV=production npm run build
elif [[ $1 == "stage" ]]; then
  echo "** Building stage **"
  npm run build
else
  echo "** Building dev **"
  npm run build
fi



working_dir=$PWD

# upload to cloudfront
if [[ $1 == "stage" ]]; then

  echo "** Uploaded to stage s3 bucket **"
  aws s3 cp . s3://static.iobio.io/stage/bam.iobio.io/ --recursive --exclude '.git/*'
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id EW1T1HDKHSTBF --paths /\*

fi