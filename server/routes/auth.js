var db = require('../database');
var Sequelize = require('sequelize');

var auth = {

  login: function (req, res) {
    db.User.find({
      where: Sequelize.or({ username: req.body.email }, { email: req.body.email })
    }).then(function (user) {
      if (user && user !== typeof 'undefined' && req.body.password == user.password) {
        res.status(200);
        res.json({success: true, message: "Logged in"})
      } else {
        res.status(400);
        res.json({success: false, message: "Incorrect username or password."})
      }
    });
  },

  logout: function (req, res) {
    console.log("Logout called");
    res.status(200);
    res.json({ success: true, message: "You have logged out." });
  }

};

module.exports = auth;
