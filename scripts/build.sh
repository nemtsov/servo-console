#!/bin/bash
mkdir -p build
rm -rf build/*

browserify lib/components/Main.js -t [ babelify --presets [ es2015 react stage-0]]  > ./build/main.temp.js
#minify --output build/main.temp.js build/main.temp.js
gzip -c build/main.temp.js > build/main.js
rm -f build/main.temp.js

find lib/style/ -name '*.css' -exec cat {} \; | cleancss > build/main.temp.css
gzip -c build/main.temp.css > build/main.css
rm -f build/main.temp.css

cp -R lib/static/* build/
mv build/index.html build/index.temp.html
gzip -c build/index.temp.html > build/index.html
rm -f build/index.temp.html
