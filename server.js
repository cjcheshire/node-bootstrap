var express = require('express');
var path = require('path');
var app = express();

var pageData = require('./pageData.json');

var gzippo = require('gzippo');
app.use(gzippo.staticGzip(__dirname + '/public'));
app.use(express.bodyParser());

app.set('view engine', 'jade');
app.set('views', './assets/jade');

function beforeAllFilter(req, res, next) {
  app.locals.pretty = true;

  next();
}

app.all('*', beforeAllFilter);

app.get('/', function (req, res) {
  res.render('index', pageData);
});
app.get('/test', function (req, res) {
  res.render('test', pageData);
});
app.get('/styleguide', function (req, res) {
  res.render('style-guide', pageData);
});

app.configure('production', function(){
  var port = process.env.PORT || 5000;
  app.listen(port, function() {
     console.log("Listening on " + port);
  });
});

module.exports = app;
