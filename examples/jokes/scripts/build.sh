#!/usr/bin/env bash

rm -rf ./build
cp -r src build
cp ./package.json ./build/
cd ./build
NODE_ENV=production npm install
