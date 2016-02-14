var db = require('../database');
var Sequelize = require('sequelize');
var jwt = require('jwt-simple');
var secret = '5UP3R53CR3770K3N57R1NG';

var auth = {

  login: function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    // Check that username and password were not empty
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        status: 401,
        success: false,
        message: "Incorrect username or password. (1)"
      });
      return;
    }

    // Check that username and password are a match
    // If so, generate a token and return it
    db.User.findOne({
      where: Sequelize.or({ username: username }, { email: username })
    }).then(function (dbUserObj) {
      if (dbUserObj && dbUserObj !== typeof 'undefined' && password == dbUserObj.password) {
        var user = dbUserObj.get();
        console.log("returning token");
        res.json(generateToken(user));
      } else {
        res.status(401);
        res.json({
          status: 401,
          success: false,
          message: "Incorrect username or password. (2)"
        });
      }
    });
  },

  logout: function (req, res) {
    console.log("Logout called");
    res.status(200);
    res.json({ success: true, message: "You have logged out." });
  },

  validateUser: function (username) {

  },

  isAuth: function (req, res, next) {
    var authHeader, token, elements, bearer;
    authHeader = req.headers['Authorization'];

    if (typeof authHeader !== 'undefined') {
      elements = authHeader.split(" ");
      bearer = elements[0];

      if (bearer === 'Bearer') {
        token = elements[1];
      }
    }
  },

  validateRequest: function (req, res, next) {
  //  // Check that the token exists
  //  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers['Authorization'];
  //
  //  if (token) {
  //    try {
  //      var decoded = jwt.decode(token, secret);
  //
  //      // Check that the token hasn't expired
  //      if (decoded.exp <= Date.now()) {
  //        res.status(400);
  //        res.json({
  //          "status": 400,
  //          "message": "Token Expired"
  //        });
  //        return;
  //      }
  //
  //      // Check that
  //      if (key == '') {
  //        res.status(401);
  //        res.json({
  //          status: 401,
  //          success: false,
  //          message: "Empty username in request"
  //        });
  //        return;
  //      }
  //
  //      db.User.findOne({
  //        where: Sequelize.or({ username: username }, { email: username })
  //      }).then(function (dbUserObj) {
  //        if (dbUserObj && dbUserObj !== typeof 'undefined' && password == dbUserObj.password) {
  //          var user = dbUserObj.get();
  //          console.log("returning token");
  //          res.json(generateToken(user));
  //        } else {
  //          res.status(401);
  //          res.json({
  //            status: 401,
  //            success: false,
  //            message: "Incorrect username or password. (2)"
  //          });
  //        }
  //      });
  //
  //      if (dbUser) {
  //        if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
  //          next(); // To move to next middleware
  //        } else {
  //          res.status(403);
  //          res.json({
  //            "status": 403,
  //            "message": "Not Authorized"
  //          });
  //          return;
  //        }
  //      } else {
  //        // No user with this name exists, respond back with a 401
  //        res.status(401);
  //        res.json({
  //          "status": 401,
  //          "message": "Invalid User"
  //        });
  //        return;
  //      }
  //
  //    } catch (err) {
  //      res.status(500);
  //      res.json({
  //        "status": 500,
  //        "message": "Oops something went wrong",
  //        "error": err
  //      });
  //    }
  //  } else {
  //    res.status(401);
  //    res.json({
  //      "status": 401,
  //      "message": "Invalid Token or Key"
  //    });
  //    return;
  //  }
  }

};

// Private helper functions for authenticating
function generateToken(user) {
  var curTime = new Date().getTime();
  var expires = expiresIn(7);
  var issuer = 'serendipity'; //server.address().address;

  var payload = {
    iss: issuer,
    iat: curTime,
    exp: expires,
    sub: user.id,
    scope: user.role
  };

  console.log("starting token generation");
  var token = jwt.encode(payload, secret);
  console.log("token generated");
  var decoded = jwt.decode(token, secret);
  console.log(decoded);


  return {
    token: token,
    expires: expires,
    id : user.id,
    role: user.role
  };
}

function expiresIn(days) {
  var currentTime = new Date();
  return currentTime.setDate(currentTime.getDate() + days);
}

module.exports = auth;
