var db = require('../database');
var Sequelize = require('sequelize');
var jwt = require('jwt-simple');

var auth = {

  login: function (req, res) {

    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        status: 401,
        message: "Invalid credentials"
      });
      return;
    }

    var dbUserObj = auth.validate(username, password);


  },

  logout: function (req, res) {
    console.log("Logout called");
    res.status(200);
    res.json({ success: true, message: "You have logged out." });
  },

  validate: function (username, password) {
    db.User.find({
      where: Sequelize.or({ username: req.body.username }, { email: req.body.username })
    }).then(function (user) {
      if (user && user !== typeof 'undefined' && req.body.password == user.password) {
        res.status(200);
        res.json({success: true, message: "Logged in"})
      } else {
        res.status(400);
        res.json({success: false, message: "Incorrect username or password."})
      }
    });
  }

};

module.exports = auth;
