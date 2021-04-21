#!/bin/bash
rm -rf dist
mkdir -p dist/assets
mkdir -p dist/db
mkdir -p dist/custom

cp -r wwwroot/db ./dist/db/

x run _bundle.ss -to dist/

cp -r wwwroot/ dist/
cp scripts/deploy/app.settings dist/wwwroot/app.settings

cp wwwroot/custom/northwind.js dist-mix/northwind/
cp northwind.sqlite dist-mix/northwindcustom

cp wwwroot/custom/chinook.js dist-mix/chinook/custom
cp chinook.sqlite dist-mix/chinook

