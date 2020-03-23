#!/bin/bash

cd /src
npm install --unsafe-perm
npm run build
cp -a client/* /build/
