var jwt = require('jwt-simple');
var UserModel = require('../models/users');

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./api.properties');

var Log = require('log');
var fs = require('fs');
var log = new Log('debug', fs.createWriteStream(properties.get('main.log.file')));

module.exports = function(req, res, next) {

  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  //var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

  if (token) {
    try {
      if (token == '') {
         log.debug('Invalid token');
         res.status(401);
         res.setHeader('Content-Type', 'text/plain');
         res.json({
           //"status": 400,
           "message": "Invalid token"
         });
         return;
      }

      var decoded = jwt.decode(token, require('../config/secret.js')());

      // Comprobar la expiracion del token
      if (decoded.exp <= Date.now()) {
        log.info('Token Expired');

        res.status(400);
        res.json({
          //"status": 400,
          "message": "Token expired"
        });
        return;
      }

      // Comprobar la existencia del usuario
      var userData = {username:decoded.iss};
      UserModel.getUser(userData,function(error, dbUser) {
          if (dbUser==null) {
            res.status(500);
            res.json({
              //"status": 500,
              "message": "Oops something went wrong :(",
            });
            return;
          }

          if (typeof dbUser == 'undefined' || dbUser.length == 0) {
            log.debug('Invalid user');
            res.status(401);
            res.setHeader('Content-Type', 'text/plain');
            res.json({
              //"status": 401,
              "message": "Invalid user"
            });
            return;
          }
          else {
            next();
          }

      });

    } catch (err) {
    res.status(401);
    res.json({
      //"status": 500,
      //"message": "Oops something went wrong",
      //"status": 401,
      "message": "Invalid token",
      //"error": err
    });
   }
  } else {
    res.status(401);
    res.json({
      //"status": 401,
      "message": "Invalid token"
    });
    return;
  }
}
