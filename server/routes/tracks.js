var db = require('../database');
var Sequelize = require('sequelize');
var auth = require('./auth.js');
var uploadTrack = require('../middleware/multer-upload-track.js');
var fs = require('fs');
var path = require("path");
var TAG = 'api/routes/tracks.js: ';

var tracks = {

  getAll: function (req, res) {
    db.Track.findAll()
      .then(function (results) {
        var numResults = results.length;
        console.log(TAG + "Results: " + numResults + " tracks found.");
        if (numResults === 0) {
          res.json({ message: "No tracks in database." });
        } else {
          res.json(results);
        }
      });
  },

  create: function (req, res) {

    uploadTrack(req,res,function(err) {
      if(err){
        console.log(err);
        res.json({ success: false, error: err });
        return;
      } else {
        console.log(req.body);
        // Check that the request has required attributes
        if (req.body.title && req.body.description && req.body.type) {

          // Get vars
          var title = req.body.title || 'Default title';
          var description = req.body.description || 'Default description';
          var type = req.body.type || 'Default type';
          var path = req.file.path || "Default path";

          // Hack the path
          console.log(TAG + "Path before: " + path);
          if (path.indexOf('\\') !== -1) {
            path = path.replace('client\\', '');
          } else {
            path = path.replace("client/", "");
          }
          console.log(TAG + "Path after: " + path);

          // Update or create db entry
          db.Track.upsert({
            title: title,
            description: description,
            type: type,
            path: path
          })
          .then(function (result) {
            if (result) {
              res.status(200);
              res.json({
                success: true,
                message: "Track uploaded succesfully."
              });
            } else {
              res.status(200);
              res.json({
                success: false,
                message: "A sound with those properties already found."
              });
            }
          });

        } else {
          res.status(400);
          res.json({
            success: false,
            message: "Missing request property (title, description or type)."
          });
        }
      }
    });

  },

  delete: function (req, res) {
    console.log(TAG + "delete called");
    console.log(req.body);

    // Check that user info is set
    var user = auth.getUser(req);

    if (user) {
      // Check user role
      if (user.role === 'admin') {
        // User is admin, permit deleting any track
        console.log(TAG + "User is admin, deleting");
        deleteTrack(req, res);
      } else {
        // User was not admin
        res.status(403);
        res.json({success: false, message: "Unauthorized"});
      }

      // TODO: Remove the file from filesystem
      var path = require('path');
      var basePath = path.join(__dirname, '../../client/');
      var soundPath = basePath + req.body.path;
      console.log(soundPath);

    } else {
      res.status(401);
      res.json({success: false, message: "Not logged in"});
    }
  },

  createFromJson: function (req, res) {

    //console.log(path.join(__dirname, "../../client/sounds/tracks"));
    var files = fs.readdirSync(path.join(__dirname, "../../client/sounds/tracks"));
    console.log(files);

    var data =
    [
      {
        "title": "Tip Toe",
        "description": "Chippery synth tune.",
        "type": "Classical",
        "path": "sounds/tracks/tip_toe_synth_strings.mp3",
        "file": "tip_toe_synth_strings.mp3"
      }
    ];

    console.log(TAG + "Raw data");
    console.log(data);



    data.forEach(function (track) {

      files.forEach(function (file) {
        if (track.file == file) {
          // db.Track.upsert({
          //   title: track.title,
          //   description: track.description,
          //   type: track.type,
          //   path: track.path
          // })
          // .then(function (result) {
          //   if (result) {
          //     res.status(200);
          //     res.json({
          //       success: true,
          //       message: "Tracks uploaded succesfully."
          //     });
          //   } else {
          //     res.status(200);
          //     res.json({
          //       success: false,
          //       message: "A sound with those properties already found."
          //     });
          //   }
          // });
        }
      });


    });

    res.json({success: true});

  }

};

module.exports = tracks;

function deleteTrack(req, res) {
  db.Track.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(rowsDeleted) {
    console.log(TAG + "rows deleted: " + rowsDeleted);
    res.status(200);
    res.json({success: true, message: "Sound deleted."});
  }, function(err){
    console.log(err);
    res.status(500);
    res.json({success: false, message: "An error occurred", error: err});
  });
}
