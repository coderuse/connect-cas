[![Build Status](https://travis-ci.org/AceMetrix/connect-cas.svg)](https://travis-ci.org/AceMetrix/connect-cas)

# Connect CAS

Connect cas is a connect-based middleware that allows you to authenticate through a CAS 2.0+ server.  It supports the gateway auth, single sign-out, and proxying other CAS clients.

Adapted from https://github.com/jmarca/cas_validate

## Installation

    npm install uidev547/connect-cas
            
## Options
Many of these options are borrowed from node's [url documentation](http://nodejs.org/api/url.html).  You may set global options through the `.configure()` method or override them with any of the exposed middleware.

  - `procotol` The protocol to communicate with the CAS Server.  Defaults to 'https'.
  - `host` CAS server hostname
  - `port` CAS server port number.  Defaults to 443.
  - `gateway` Send all validation requests through the CAS gateway feature.  Defaults to false.
  - `paths`
    - `serviceValidate` Path to validate TGT
    - `proxyValidate` Path to validate PGT (not implemented)
    - `proxy` Path to obtain a proxy ticket
    - `login` Path to the CAS login

## Usage

###cas configuration 
```javascript
var cas = require('connect-cas');
cas.configure({ 
    host: 'cev3.pramati.com',
    paths: {
        serviceValidate: '/cas/p3/serviceValidate', // CAS 3.0
        proxyValidate: '/cas/p3/proxyValidate'
    }
});
```


###For the routes which needs authentication follow the below steps

###routes configuration
```javascript
var cas = require('connect-cas');
app.get('/loggedin', cas.ssout('/loggedin'), cas.serviceValidate(), cas.authenticate(), function(req, res, next) {
    res.render( 'loggedin' );
});
```

Explaination for the above code snippet:
```javascript
  app.get( '/loggedin' ):
```
When browser request for loggedin route 
  - If the user not autheticated by CAS then redirect the request to cas login page and get the ticket from CAS after succesful login.
  - After validating the ticket respond to the browser with res.render( 'loggedin' )
  - If the user is already authentiated then it as normal flow respond with res.render( 'loggedin' )


###Logout Implementaion in Node app:

```javascript
app.get('/services/logout', function(req, res, next) {
  if (req.session.destroy) {
      req.session.destroy();
  } else {
      req.session = null;
  }
  res.end( '' );
});
```

Above code will invalidate the session of node application but not CAS session.
If you would like to invalidate the CAS session then after the success of the above response call the below code the browser script

```javascript
  window.location = "//cev3.pramati.com/cas/logout?service=" + document.URL; 
```

### Handling explict logout for CAS
If you would like to invalidate node applicaiton session in case of explicit CAS logged out is happend in browser


Then Add the below code in node js
```javascript
  app.post('/loggedin', cas.ssout('/loggedin') );
```
Above route will be called by the CAS server if explicit logout is happend, with a ticket in the req.body
By using the ticket connect-cas module invalidate the session for the particular client.


## License

  MIT

[![NPM](https://nodei.co/npm/connect-cas.png)](https://nodei.co/npm/connect-cas/)