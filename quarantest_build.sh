#!/bin/bash

cd /src
# TODO: figure out how to get rid of unsafe-perm
npm install --unsafe-perm
npm run build
cp -a  client/* /build/
