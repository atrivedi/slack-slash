var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 

var random = require( './random' );
var karma = require( './karma' );

var x = '%AF\\_%28%u30C4%29_/%AF';
var r = /\\u([\d\w]{4})/gi;
x = x.replace(r, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 16)); } );
x = unescape(x);
x = 'still alive ' + x;

app.get('/', function (req, res) {
  res.send( x );
});

random( app );
karma( app );

app.listen(2303, function () {});
