
var url= 'https://hooks.slack.com/services/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';
var sendText = require( './sender' );

function roll( sides, times ) {
	var thisRoll = Math.floor((Math.random() * Number(sides))) + 1 
	if( times > 1 ) {
		return thisRoll + roll(sides, times - 1);	
	}
	return thisRoll;
}
module.exports = function( app ) {
	app.get('/roll', function( req, res) {
		res.send();//so the caller doesn't freak out.
		var user = req.query.user_name;
  		var command = req.query.text;
		var times,sides,addendum;
		if( !command ) {
			times = 1;
			sides = 6;
		} else if( /\d*d\d(\+\d)?/.test(command) ){
			var indexOfD = command.indexOf('d');
			var indexOfPlus = command.indexOf('+');
			indexOfPlus = indexOfPlus === -1 ? undefined : indexOfPlus;
			times = parseInt(command.substring(0,indexOfD)) || 1;
			sides = parseInt(command.substring(indexOfD + 1,indexOfPlus));
			if( indexOfPlus) {
				addendum = parseInt(command.substring( indexOfPlus + 1 ));
			}
		} else {
			res.send( 'Please, use the format "#d#". Optionally add "+#"');
			return;
		}
		var value = sides === 0 ? 0 : roll(sides,times);
		var rollText =  '@' + user + ' rolled a ' + times + 'd' + sides;
		if(addendum) {
			value += addendum;
			rollText += ' with a +' + addendum + ' modifier';
		}
		sendText( url, rollText + '; result is _*' + value.toString() + '*_' );
	});

	app.get('/flipcoin', function( req, res) {
  		var value = Math.floor((Math.random() * 2)) ? 'heads':'tails';
		sendText( url, '@' + req.query.user_name + ' flipped a coin and it landed on _*' + value + '*_' );
		res.send();
	});
};
