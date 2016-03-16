var db = require('../database');
var Sequelize = require('sequelize');
var auth = require('./auth.js');
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
    //var title = req.body.title;
    //var description = req.body.description;
    //var type = req.body.type;
  }

};

module.exports = tracks;
