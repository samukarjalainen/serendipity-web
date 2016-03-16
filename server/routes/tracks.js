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
        var title = req.body.title || 'Default title';
        var description = req.body.description || 'Default description';
        var type = req.body.type || 'Default type';
        var path = req.file.path || "Default path";

        console.log(TAG + "Path before: " + path);

        if (path.indexOf('\\') !== -1) {
          path = path.replace('client\\', '');
        } else {
          path = path.replace("client/", "");
        }

        console.log(TAG + "Path after: " + path);

        res.json({success: true});

      }



    });


  }

};

module.exports = tracks;
