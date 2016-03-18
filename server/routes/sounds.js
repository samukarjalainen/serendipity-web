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
    var soundId = req.params.id;
    db.Sound.findOne({ where: { id: soundId }})
      .then(function (sound) {
      if (!sound || typeof sound == 'undefined') {
        res.status(404);
        res.json({
          "status": 404,
          "message": "Sound not found"
        });
      } else {
        res.json(sound);
      }
    })
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

      if(err){
        console.log(err);
        res.json({ success: false, error: err });
        return;
      }

      var user = auth.getUser(req);

      if (user) {
        var username = user.username;
        console.log(TAG, 'username is ', username);
        db.User.findOne({ where: {username: username}}).then(function (user) {
          if (user) {
            var headerBody;

            try {
              headerBody = JSON.parse(req.headers['body']);
              console.log(TAG + "UPLOAD REQUEST HEADER ['body']");
              console.log(headerBody);
            } catch (err) {
              console.log(TAG + "No header 'body' in the request");
            }

            try {
              console.log(TAG + "UPLOAD REQUEST BODY");
              console.log(req.body);
            } catch (err) {
              console.log(TAG + "REQUEST BODY NOT FOUND");
              console.log(err);
            }

            var title, description, lat, long;

            if (headerBody) {
              title = headerBody.title;
              description = headerBody.description;
              lat = parseFloat(headerBody.lat);
              long = parseFloat(headerBody.long);
            } else {
              // Providing fallback placeholders, just in case
              title = req.body.title ||"Default title";
              description = req.body.description || "Description placeholder";
              lat = parseFloat(req.body.lat) || 90.000000;
              long = parseFloat(req.body.long) || 180.000000;
            }

            // Check that the request body was correctly formatted
            if (!validateGpsCoordinates(lat, long)) {
              res.status(400);
              res.json({success: false, message: "Bad request.", error: "Error in latitude or longitude format."});
              return;
            }

            var path = req.file.path || "Default path";

            console.log(TAG + "Path before: " + path);

            if (path.indexOf('\\') !== -1) {
              path = path.replace('client\\', '');
            } else {
              path = path.replace("client/", "");
            }

            console.log(TAG + "Path after: " + path);

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
      } else {
        console.log(TAG + "Could not find user");
        res.status(401);
        res.json({ success: false, message: "Could not find user" });
      }
    });
  },

	
	//UPDATE sound 
	//SET title = 'x', description = 'y', path =  'z'
	//WHERE id = SoundId and UserId = UserId
	//TO DO
  update: function(req, res) {
		/*
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
		*/
  },

	
	//DELETE FROM sound where id= soundId;
	//TO DO
  delete: function(req, res) {
		/*
		var soundId = req.body.soundid || req.headers['soundid'];

    console.log(TAG + "sound from body or header: " + soundId);

    db.Sound.delete({ where: { id: soundId } });
		*/
		db.Sound.remove({
            _id: req.params.sound_id
        }, function(err, sound) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
				

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
        res.redirect('/');
      })
    }).catch(function(error) {
      console.log("Dummy sounds already in db");
      res.redirect('/');
    });
  },

  // TODO: Refactor function to pass in variables on what area to search sounds for
  // The function to get sounds that are near a user
  getAllByLocation: function (req, res) {

    console.log(TAG, "getSoundsNearLocation starting");


    // Get the user coords from request
    var lat = parseFloat(req.body.lat) || 75.000000;
    var long = parseFloat(req.body.long) || 35.000000;


    // Check that the request body was correctly formatted
    if (!validateGpsCoordinates(lat, long)) {
      res.status(400);
      res.json({success: false, message: "Bad request.", error: "Error in latitude or longitude format."});
      return;
    }


    // Formulate boundaries for query
    var latDiffMin = lat - latDiffValue;
    var latDiffMax = lat + latDiffValue;
    var longDiffMin = long - longDiffValue;
    var longDiffMax = long + longDiffValue;


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
  },

  downloadByIdFromParams: function (req, res) {
    var soundIdParam = req.params.id;
    var downloadUrl = "";

    console.log(TAG + "Sound ID from params: " + soundIdParam);

    db.Sound.findOne({ where: { id: soundIdParam } })
      .then(function (sound) {
        if (!sound) {
          res.status(404);
          res.json({
            "status": 404,
            "message": "Sound not found"
          });
          return 'error';
        } else {
          console.log(sound.path);
          downloadUrl = sound.path;
          res.download(downloadUrl);
        }
      });
  },

  downloadByIdFromHeaderOrBody: function (req, res) {
    var soundId = req.body.soundid || req.headers['soundid'];
    var downloadUrl = "";

    console.log(TAG + "sound from body or header: " + soundId);

    db.Sound.findOne({ where: { id: soundId } })
      .then(function (sound) {
        if (!sound) {
          res.status(404);
          res.json({
            "status": 404,
            "message": "Sound not found"
          });
          return 'error';
        } else {
          console.log(sound.path);
          downloadUrl = sound.path;
          res.download(downloadUrl);
        }
      });
  },

  edit: function (req, res) {
    var user = req.user;
  },

  getOverlayTracks: function (req, res) {

  }
};

module.exports = sounds;

function validateGpsCoordinates(lat, long) {
  if ((lat < -90.00 || lat > 90.00) || (long < -180.00 || long > 180.00)) {
    return false;
  } else {
    return true;
  }
}
