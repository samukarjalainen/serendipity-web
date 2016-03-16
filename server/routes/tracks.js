var db = require('../database');
var Sequelize = require('sequelize');
var auth = require('./auth.js');
var uploadTrack = require('../middleware/multer-upload-track.js');
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

  }

};

module.exports = tracks;
