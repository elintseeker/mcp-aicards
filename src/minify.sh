#!/bin/bash
echo Make sure you have SASS and UglifyJS installed as global via npm.

sleep 1s

echo Compressing JS
uglifyjs -c -m -o ../app/app.min.js ../src/app.js

sleep 1s

echo Compressing CSS
sass ../src/scss/style.scss ../app/style.css