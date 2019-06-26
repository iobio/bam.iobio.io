#!/bin/bash

# build vue app
if [[ $1 == "prod" ]]; then
  echo "** Building prod **"
  #NODE_ENV=production npm run build
  npm run build
elif [[ $1 == "stage" ]]; then
  echo "** Building stage **"
  npm run build
else
  echo "** Building dev **"
  npm run build
fi


# upload to cloudfront
if [[ $1 == "stage" ]]; then

  echo "** Uploading to stage s3 bucket **"
  aws s3 cp . s3://static.iobio.io/stage/bam.iobio.io/ --recursive --exclude '.git/*'
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id EW1T1HDKHSTBF --paths /\*

elif [[ $1 == "prod" ]]; then
  echo "** Uploading to prod s3 bucket **"
  aws s3 cp ./client s3://static.iobio.io/prod/bam.iobio.io/green/ --recursive --cache-control 'public, max-age=86400'
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E1SI8J5TK5FF8 --paths /\*
fi
