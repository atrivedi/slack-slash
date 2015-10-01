
var sendText = require( './sender' );
var url = 'https://hooks.slack.com/services/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';

var localDb = {};

function doKarma( text ) {
	var regPP = /([a-z0-9_\-\.]+)\+\+/i;
	var ppReg = /\+\+([a-z0-9_\-\.]+)/i;
     	var regMM = /([a-z0-9_\-\.]+)\-\-/i;
	var mmReg = /\-\-([a-z0-9_\-\.]+)/i;
	if( ppReg.test( text ) || regPP.test( text ) ) {
		var user = text.replace(/\+\+/g, '');
		if( localDb[user] === undefined ) {
			localDb[user] = 0;
		}
		localDb[user]++;
		sendText( url, '@' + user + '++ [woot! now at ' + localDb[user] + ']');
	} else if( mmReg.test( text ) || regMM.test( text ) ) {
		var user = text.replace(/\-\-/g, '');
		if( localDb[user] === undefined ) {
			localDb[user] = 0;
		}
		localDb[user]--;
		sendText( url, '@' + user + '-- [ouch! now at ' + localDb[user] + ']');
	}
}

module.exports = function( app ) {
	//karmabot
	app.post( '/karma', function( req, res) {
		//get local db
		if( req.body.user_name.indexOf( 'bot' ) === -1 ) {
			doKarma( req.body.text );
		}
		res.send();
	});
}
