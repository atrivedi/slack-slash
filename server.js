var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 

var random = require( './random' );
var karma = require( './karma' );

app.get('/', function (req, res) {
  res.send('sill alive');
});

random( app );
karma( app );

app.listen(2303, function () {});
