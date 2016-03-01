var db = require('../database');
var Sequelize = require('sequelize');
var upload = require('../middleware/multer-upload.js');
var auth = require('./auth.js');
var TAG = 'api/routes/sounds.js: ';

var sounds = {

  getAll: function(req, res) {
    db.Sound.findAll().then(function (results) {
      res.json(results);
    });
  },

  getOne: function(req, res) {
    // TODO: Implement
  },

  getUserSounds: function (req, res) {
    var user = auth.getUser(req);
    if (user) {
      console.log(TAG, "fetching sounds for user: " + user.username);
      db.Sound.findAll({ where: {UserId: user.id} }).then(function (results) {
        res.json(results);
      })
    }
  },

  create: function(req, res) {
    upload(req,res,function(err){
      //console.log(req);
      if(err){
        console.log(err);
        res.json({success: false, error: err});
        return;
      }
      var user = auth.getUser(req);
      if (user) {
        var username = user.username || 'test';
        console.log(TAG, 'username is ', username);
        db.User.findOne({ where: {username: username}}).then(function (user) {
          if (user) {
            // Get the values from request or use placeholders
            var title = req.body.title || "Default title";
            var description = req.body.description || "Description placeholder";
            var lat = parseFloat(req.body.lat) || 90.000000;
            var long = parseFloat(req.body.long) || 180.000000;
            var path = req.file.path || "Default path";

            db.Sound.create({
              title: title,
              description: description,
              lat: lat,
              long: long,
              path: path,
              UserId: user.id
            })
          }
        }).then(function () {
          res.json({ success: true, error:null });
        });
      }
    });
  },

  update: function(req, res) {
    // TODO: Finish this function
  },

  delete: function(req, res) {
    // TODO: Finish this function
  }
};

module.exports = sounds;
