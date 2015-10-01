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
function updateKarmaForUser( user, karma ) {
	try {
        	db.push( '/' + user, karma );        		
        } catch(error) {
        }

}

function doKarma( text ) {
	var regPP = /([a-z0-9_\-\.]+)\+\+/i;
	var ppReg = /\+\+([a-z0-9_\-\.]+)/i;
     	var regMM = /([a-z0-9_\-\.]+)\-\-/i;
	var mmReg = /\-\-([a-z0-9_\-\.]+)/i;
	if( ppReg.test( text ) || regPP.test( text ) ) {
		var user = text.replace(/\+\+/g, '');
		var karma = getKarmaForUser( user );
		karma++;
		updateKarmaForUser( user, karma );
		sendText( url, '@' + user + '++ [woot! now at ' + karma + ']');
	} else if( mmReg.test( text ) || regMM.test( text ) ) {
		var user = text.replace(/\-\-/g, '');
		var karma = getKarmaForUser( user );
		karma--;
		updateKarmaForUser( user, karma );
		sendText( url, '@' + user + '-- [ouch! now at ' + karma + ']');
	}
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
