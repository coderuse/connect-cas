var _ = require('lodash');
var HttpStatus = require('http-status-codes');

var clearSession = function( data, req, res ) {
    if (!/<samlp:SessionIndex>(.*)<\/samlp:SessionIndex>/.exec( data ) ) {
        next();
        return;
    }
    var st = RegExp.$1;
    var sessionId = req.sessionStore.sessions[ st ];
    if( sessionId ) {
      sessionId = JSON.parse( sessionId );
      if( sessionId ) {
        if ( sessionId && sessionId.sid ) req.sessionStore.destroy( sessionId.sid );
        req.sessionStore.destroy(st);  
      }
    }
    res.sendStatus(HttpStatus.NO_CONTENT);
};

module.exports = function( serviceUrl ) {
    return function(req,res,next){
        if (!req.sessionStore) throw new Error('no session store configured');
        if (!serviceUrl) throw new Error('no service url configured');

        req.ssoff = true;
        if ( req.method !== 'POST' || req.url !== serviceUrl ) {
            next();
            return;
        }
        if( req && typeof req.body === 'object' ) {
            clearSession( req.body.logoutRequest, req, res );
            return;
        } 
        var body = '';
        req.on('data', function(chunk){
            body += chunk;
        });
        req.on('end', function(){
            clearSession( decodeURIComponent(data), req, res );
        });
    }
}

