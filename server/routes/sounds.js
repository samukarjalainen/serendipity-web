var db = require('../database');
var Sequelize = require('sequelize');
var upload = require('../middleware/multer-upload.js');
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
      console.log('Creating a file in DB');
      console.log(req.body);
      //console.log(req.file);
      var username = req.loggedInUser || 'test@serendipity.com';
      console.log(TAG, 'username is ', username);
      db.User.findOne({ where: {email: 'test@serendipity.com'}}).then(function (user) {
        if (user) {
          db.Sound.create({
            title: req.file.originalname,
            description: "Lorem ipsum",
            lat: "90",
            long: "45",
            path: req.file.path,
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
