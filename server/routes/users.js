var db = require('../database');
var Sequelize = require('sequelize');

var users = {

  getAll: function(req, res) {
    db.User.findAll().then(function (results) {
      res.json(results);
    });
  },

  getOne: function(req, res) {
    var username = req.params.username;
    db.User.findOne({ where: { username: username }})
      .then(function (user) {
      if (!user || typeof user == 'undefined') {
        res.status(404);
        res.json({
          "status": 404,
          "message": "User not found"
        });
      } else {
        res.json(user);
      }
    })
  },

  create: function(req, res) {
    db.User.find({
      where: Sequelize.or({ username: req.body.username }, { email: req.body.email })
    }).then(function (user) {
      if (!user || typeof user ==  'undefined') {
        db.User.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          city: req.body.city,
          country: req.body.country
        });
        res.status(200);
        res.json({success: true, message: "User created"});
      } else {
        res.status(409);
        res.json({success: false, message: "A user with that e-mail or username already exits."});
      }
    });
  },

  update: function(req, res) {
    console.log(req.body.id);
    if (req.body.id && typeof req.body.id !== 'undefined') {
      db.User.update(req.body, { where : { id: req.body.id } }
      ).then(function () {
        console.log("User with ID: " + req.body.id + " updated successfully");
        res.status(200);
        res.json({ success: true, message: "User updated succesfully" });
      }).catch(function (err) {
        console.log("Error updating user");
        console.log(err);
        res.status(400);
        res.json({ success: false, message: err.message, errors: err.errors });
      });
    } else {
      console.log("Request ID undefined");
      res.status(400);
      res.json({ success: false, message: "Request ID undefined" });
    }
  },

  delete: function(req, res) {
    // TODO: Finish this function
  }
};

module.exports = users;
