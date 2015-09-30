var express = require('express');
var request = require('request');
var app = express();

var url= 'https://hooks.slack.com/services/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';
function sendText( text ) {
	request.post( {
			url: url,
			form: {
				payload: JSON.stringify( {text: text } )
			}
		}, function( err, http,body) {
			if( err ) console.log(err);
		}
	);
}

function roll( sides, times ) {
	var thisRoll = Math.floor((Math.random() * Number(sides))) + 1 
	if( times > 1 ) {
		return thisRoll + roll(sides, times - 1);	
	}
	return thisRoll;
}

app.get('/', function (req, res) {
  res.send('sill alive');
});

app.get('/roll', function( req, res) {
	var user = req.query.user_name;
  	var command = req.query.text;
	var times,sides,addendum;
	if( !command ) {
		times = 1;
		sides = 6;
		
	} else if( /\dd\d(\+\d)?/.test(command) ){
		var indexOfD = command.indexOf('d');
		var indexOfPlus = command.indexOf('+');
		indexOfPlus = indexOfPlus === -1 ? undefined : indexOfPlus;
		times = parseInt(command.substring(0,indexOfD));
		sides = parseInt(command.substring(indexOfD + 1,indexOfPlus));
		if( indexOfPlus) {
			addendum = parseInt(command.substring( indexOfPlus + 1 ));
		}
	} else {
		sendText( 'Please, use the format "#d#". Optionally add "+#"');
		res.send();
		return;
	}
	var value = roll(sides,times);
	var rollText =  '@' + user + ' rolled a ' + times + 'd' + sides;
	if(addendum) {
		value += addendum;
		rollText += ' with a +' + addendum + ' modifier';
	}
	sendText( rollText + '; result is _*' + value.toString() + '*_' );
	res.send();
});

app.get('/flipcoin', function( req, res) {
  	var value = Math.floor((Math.random() * 2)) ? 'heads':'tails';
	sendText( '@' + req.query.user_name + ' flipped a coin and it landed on _*' + value + '*_' );
	res.send();
});

var server = app.listen(2303, function () {});
