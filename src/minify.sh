#!/bin/bash
echo Make sure you have SASS, clean-css, postcss/autoprefixer and UglifyJS installed as global via npm.

sleep 1s

echo Compressing JS
uglifyjs -c -m -o app/app.min.js src/app.js

sleep 0.5s

echo Compressing CSS
sass src/scss/style.scss app/style.css &&
npx postcss app/*.css --use autoprefixer -d app/ &&
cleancss -o app/style.min.css app/style.css 