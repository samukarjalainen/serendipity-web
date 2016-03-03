var db = require('../database');
var Sequelize = require('sequelize');
var upload = require('../middleware/multer-upload.js');
var auth = require('./auth.js');
var TAG = 'api/routes/sounds.js: ';

// For latitude, 0.0018 = 200 meters
// For longitude, 0.004255 = 200 meters
var latDiffValue = 0.001800;
var longDiffValue = 0.004255;

var sounds = {

  getAll: function(req, res) {
    db.Sound.findAll().then(function (results) {
      var numResults = results.length;
      console.log(TAG + "Results: " + numResults + " sounds found.");
      if (numResults === 0) {
        res.json({ message: "No sounds in database." });
      } else {
        res.json(results);
      }
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
            var headerBody = req.headers['body'];
            try {
              console.log(TAG + "UPLOAD REQUEST BODY");
              console.log(req.body);
            } catch (err) {
              console.log(TAG + "REQUEST BODY NOT FOUND");
              console.log(err);
            }
            try {
              console.log(TAG + "UPLOAD REQUEST HEADER ['body']");
              console.log(headerBody);
            } catch (err) {
              console.log(TAG + "REQUEST HEADER ['body'] NOT FOUND");
              console.log(err);
            }



            // Get the values from request or use placeholders
            // TODO: Remove placeholders once the mobile upload is fully functional
            var title = req.body.title || headerBody.title ||"Default title";
            var description = req.body.description || headerBody.description || "Description placeholder";
            var lat = parseFloat(req.body.lat) || parseFloat(headerBody.lat) || 90.000000;
            var long = parseFloat(req.body.long) || parseFloat(headerBody.long) || 180.000000;
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
  },

  createDummySounds: function (req, res) {
    db.Sound
      .findOrCreate({where: {
        title: 'Dummy Sound 1',
        description: 'Lorem ipsum dolor sit amet.',
        lat: 65.000000,
        long: 25.000000,
        path: 'dummyuser/dummysound1-123457890',
        UserId: 1
      }}).spread(function (sound, created) {
      db.Sound
        .findOrCreate({where: {
          title: 'Dummy Sound 2',
          description: 'Lorem ipsum dolor sit amet.',
          lat: 65.001799,
          long: 25.004254,
          path: 'dummyuser/dummysound2-123457890',
          UserId: 2
        }}).then(function () {
        return "created";
      })
    }).catch(function(error) {
      console.log("Dummy sounds already in db");
    });
  },

  // The function to get sounds that are near a user
  getAllByLocation: function (req, res) {

    console.log(TAG, "getSoundsNearLocation starting");


    // Get the user coords from request
    var lat = parseFloat(req.body.lat) || 75.000000;
    var long = parseFloat(req.body.long) || 35.000000;


    // Check that the request body was correctly formatted
    if ((lat < -90.00 || lat > 90.00) || (long < -180.00 || long > 180.00)) {
      res.status(400);
      res.json({success: false, message: "Bad request.", error: "Error in latitude or longitude format."});
      return;
    }


    // Formulate boundaries for query
    var latDiffMin = lat - latDiffValue;
    var latDiffMax = lat + latDiffValue;
    var longDiffMin = long - longDiffValue;
    var longDiffMax = long + longDiffValue;


    // Formulate query:
    // SELECT * FROM sounds
    // WHERE (LAT BETWEEN latBoundary_floor AND latBoundary_ceil)
    // AND (LONG BETWEEN longBoundary_floor AND longBoundary_ceil);
    db.Sound.findAll({
      where: {
        $and: {
          lat: {
            $between: [latDiffMin, latDiffMax]
          },
          long: {
            $between: [longDiffMin, longDiffMax]
          }
        }
      }
    }).then(function (results) {
      var numResults = results.length;
      console.log(TAG + "Results: " + numResults + " sounds found.");
      if (numResults === 0) {
        res.json({ message: "No sounds in 200m area." });
      } else {
        res.json(results);
      }
    })
  }
};

module.exports = sounds;
