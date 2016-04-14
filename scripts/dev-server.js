#!/usr/local/bin/node
var express = require('express'),
  app = express(),
  watch = require('watch'),
  browserify = require('browserify'),
  port = process.env.PORT || 4000,
  cssCleaner = require('clean-css'),
  recursive = require('recursive-readdir'),
  path = require('path'),
  mainJS, mainCSS;

app.use(express.static('./lib/static'));
app.get('/main.js', function (req, res) {
  res.type('application/javascript').send(mainJS);
});
app.get('/main.css', function (req, res) {
  res.type('text/css').send(mainCSS);
});
app.use(function (req, res) {
  res.sendFile(path.normalize(__dirname + '/../lib/static/index.html'));
});

app.listen(port, function () {
  console.log('Servo Console development server running on port ' + port)
});

watch.watchTree('./lib/components', refreshComponents);
watch.watchTree('./lib/constants', refreshComponents);
watch.watchTree('./lib/stores', refreshComponents);
watch.watchTree('./lib/style', refreshStyles);

function refreshComponents() {
  var bundle, output = '', start = new Date().getTime();
  console.log('Building components');
  bundle = browserify({debug: true}).transform("babelify").add('./lib/components/Main.js').bundle();
  bundle.on('data', function (data) {
    output += data.toString();
  });
  bundle.on('end', function () {
    console.log('Components built successfully: ' + (new Date().getTime() - start) + 'ms');
    mainJS = output;
  });
  bundle.on('error', function (err) {
    console.warn('Error building components', err.message);
    console.log(err)
  });
}

function refreshStyles() {
  var start = new Date().getTime();
  console.log('Building styles');
  recursive('./lib/style', function (err, files) {
    var minified = new cssCleaner().minify(files);
    if (minified.errors.length)
      return console.log('Error building styles', minified.errors);
    mainCSS = minified.styles;
    console.log('Styles built successfully: ' + (new Date().getTime() - start) + 'ms');
  });
}
