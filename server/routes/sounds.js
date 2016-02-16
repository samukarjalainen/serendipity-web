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

  create: function(req, res) {
    upload(req,res,function(err){
      //console.log(req);
      if(err){
        console.log(err);
        res.json({error_code:1,err_desc:err});
        return;
      }
      var username = auth.getUsername(req) || 'test';
      console.log(TAG, 'username is ', username);
      db.User.findOne({ where: {username: username}}).then(function (user) {
        if (user) {
          // Get the values from request or use placeholders
          var title = req.body.title || "Default title";
          var description = req.body.description || "Description placeholder";
          var lat = req.body.lat || "99";
          var long = req.body.long || "00";
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
        res.json({error_code:0,err_desc:null});
      });
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
