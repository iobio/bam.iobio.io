#!/bin/bash

target=$1

# build vue app
if [ "$target" == "stage" ]; then
  echo "** Building stage **"
  npm run build
elif [ "$target" ]; then
  echo "** Building prod **"
  #NODE_ENV=production npm run build
  npm run build
fi

# upload to cloudfront
if [ "$target" == "stage" ]; then

  echo "** Uploading to stage s3 bucket **"
  aws s3 cp ./client s3://static.iobio.io/stage/bam.iobio.io/stage/ --recursive --cache-control 'public, max-age=86400'
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id EW1T1HDKHSTBF --paths /\*

elif [ "$target" ]; then
  echo "** Uploading to prod s3 bucket **"
  aws s3 cp ./client s3://static.iobio.io/prod/bam.iobio.io/$target/ --recursive --cache-control 'public, max-age=86400'
  echo "** Renew cloudfrount cache **"
  #aws cloudfront create-invalidation --distribution-id E1SI8J5TK5FF8 --paths /\*
fi
