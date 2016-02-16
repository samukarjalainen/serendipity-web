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


  // Check that
  isAuth: function (req, res, next) {
    var authHeader, token, elements, bearer;
    authHeader = req.headers['authorization'];

    if (authHeader) {
      elements = authHeader.split(" ");
      bearer = elements[0];

      if (bearer === 'Bearer') {
        token = elements[1];

        try {
          jwt.decode(token, secret);
          next();
        } catch (err) {
          console.log(err);
        }
      }
    }
  },

  getUsername: function (req) {
    var authHeader, token, elements, bearer;
    authHeader = req.headers['authorization'];

    if (authHeader) {
      elements = authHeader.split(" ");
      bearer = elements[0];

      if (bearer === 'Bearer') {
        token = elements[1];

        try {
          var decoded = jwt.decode(token, secret);
          console.log(decoded);
          return decoded.usr;
        } catch (err) {
          console.log(err);
        }
      }
    }

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
    usr: user.username,
    scope: user.role
  };

  var token = jwt.encode(payload, secret);

  return {
    token: token,
    expires: expires,
    username: user.username,
    id : user.id,
    role: user.role
  };
}

function expiresIn(days) {
  var currentTime = new Date();
  return currentTime.setDate(currentTime.getDate() + days);
}

module.exports = auth;
