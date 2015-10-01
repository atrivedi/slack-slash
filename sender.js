var request = require( 'request' );

module.exports = function ( url, text ) {
	request.post( {
			url: url,
			form: {
				payload: JSON.stringify( {text: text } )
			}
		}, function( err, http,body) {
			if( err ) console.log(err);
		}
	);
};
