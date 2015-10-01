var JsonDB = require('node-json-db');
var sendText = require( './sender' );
var url = 'https://hooks.slack.com/services/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';

//The second argument is used to tell the DB to save after each push
//The third argument is for "human-readable" store...we don't care
var db = new JsonDB("karmadb", true, false);

function getKarmaForUser( user ) {
	try {
		var data = db.getData( user );
		return data[user] || 0;
	} catch(error) {
		return 0;
	}
}
function setKarmaForUser( user, karma ) {
	try {
        	db.push( '/' + user, karma );        		
        } catch(error) {
        }

}

function normalizePPandMM( text ) {
	var user = text.replace(/[\-\+]/g,'');
	var karmas = text.split( user );
	var karma = 0;
	karmas.forEach( function( karmaString ) {
		if( !karmaString) return;
		//hack to not have to check for "is last + or -" in loop
		karmaString = karmaString + '0';
		var count = 0;
		var chars = karmaString.split('');
		var state = chars[0];
		chars.forEach( function( char) {
			if( char === state ) { count++; }
			else {
				if( ! (count % 2) ) {
					if( state === '-') {karma -= count /2;}
					else if( state === '+' ) {karma += count /2;}
				}
				state = char;
				count = 1;
			}
		});
	});
	return { user: user.replace( /[\(\)]/g,''), karma: karma };
}

//sendText( url, '@' + user + '++ [woot! now at ' + karma + ']');
function doKarma( message ) {
	message.split(/([\+\-]*\(.+?\)[\+\-]*|\S*)\s*/).forEach( function( text ) {
		if( text[0] !== '`' && (text.indexOf( '++' ) !== -1 || text.indexOf('--') !== -1 ) ) {
			var result = normalizePPandMM( text );
			var karma = getKarmaForUser( result.user );
			karma += result.karma;
			var type = result.karma > 0 ? 'good' : 'bad';
			setKarmaForUser( result.user, karma );
			sendText( url, result.user + ' got ' + type + ' karma [total is ' + karma + ']' );
		}
	});
}

module.exports = function( app ) {
	//karmabot. out-going webhooks from slack make a POST
	app.post( '/karma', function( req, res) {
		if( req.body.user_name.indexOf( 'bot' ) === -1 ) {
			var query = req.body.text;
			if( query.indexOf( '!karma' ) === 0 ) {
				var whom = query.replace( '!karma','') || req.body.user_name;
				whom = whom.replace( /\s/g,'');
				var karma = getKarmaForUser( whom );
				sendText( url, whom + ' has ' + karma + ' karma!' );
			} else {
				doKarma( req.body.text );
			}
		}
		res.send();
	});
}
