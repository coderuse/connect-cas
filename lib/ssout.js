var _ = require('lodash');
var HttpStatus = require('http-status-codes');

module.exports = function(serviceUrl){
    return function(req,res,next){
        if (!req.sessionStore) throw new Error('no session store configured');
        if (!serviceUrl) throw new Error('no service url configured');

        req.ssoff = true;
        if (req.method !== 'POST' || req.url !== serviceUrl ) {
            next();
            return;
        }
        
        var body = '';
        req.on('data', function(chunk){
            body += chunk;
        });
        req.on('end', function(){
            data = decodeURIComponent( data );
            if (!/<samlp:SessionIndex>(.*)<\/samlp:SessionIndex>/.exec(body)) {
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
            res.send(HttpStatus.NO_CONTENT);
        });
    }
};
