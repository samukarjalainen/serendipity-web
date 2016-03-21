var db = require('../database');
var Sequelize = require('sequelize');
var upload = require('../middleware/multer-upload.js');
var uploadRemix = require('../middleware/multer-upload-remixed.js');
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

  update: function(req, res) {
		console.log(req.body.id);
    if (req.body.id && typeof req.body.id !== 'undefined') {
      db.Sound.update(req.body, { where : { id: req.body.id } }
      ).then(function () {
        console.log("Sound with ID: " + req.body.id + " updated successfully");
        res.status(200);
        res.json({ success: true, message: "Sound updated succesfully" });
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


	//DELETE FROM sound where id= soundId;
	//TO DO
  delete: function(req, res) {
    console.log(TAG + "delete called");
    console.log(req.body);

    // Check that user info is set
    var user = auth.getUser(req);

    if (user) {

      // Check user role
      if (user.role === 'admin') {
        // User is admin, permit deleting any sounds
      } else {
        // Check that the user is trying to delete sounds that belong to them
        if (user.id === req.body.UserId) {
          // Delete sound
          db.Sound.destroy({
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
        } else {
          // User is not admin and was trying to delete sounds not belonging to them
          res.status(403);
          res.json({success: false, message: "Unauthorized"});
        }
      }

      var path = require('path');
      var basePath = path.join(__dirname, '../../client/');
      var soundPath = basePath + req.body.path;
      console.log(soundPath);


    } else {
      res.status(401);
      res.json({success: false, message: "Not logged in"});
    }






		/*
		    var collection =  db.Sound.findAll();
    collection.remove({ _id: req.params.id }, function(err, sound){
        if (err) throw err;

        res.json(sound);
    });
		*/
		/*
		var soundId = req.body.soundid || req.headers['soundid'];

    console.log(TAG + "sound from body or header: " + soundId);

    db.Sound.delete({ where: { id: soundId } });
		*/
		/*
		db.Sound.remove({
            _id: req.params.sound_id
        }, function(err, sound) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
				*/

/*
				db.sound.remove({
				var soundId = req.params.id;
    db.Sound.findOne({ where: { id: soundId }}
		)}).then(function (sound) {
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
		*/

				/*
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
*/
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

  remix: function (req, res) {

    // TODO: Implement logic for creating new file / deleting the old one
    // TODO: Implement logic for setting the output volume

    var mkdirp = require('mkdirp');
    var path = require('path');

    console.log(TAG + "Remix");
    var user = auth.getUser(req);

    if (user) {
      var soundVol = req.body.soundVol;
      var trackVol = req.body.trackVol;
      var newFile = req.body.newFile;
      var basePath = path.join(__dirname, '../../client/');
      var dateNow = Date.now().toString();
      //var basePath = '~/serendipity-web/client/';
      var soundPath = basePath + req.body.sound.path;
      var trackPath = basePath + req.body.track.path;
      var outputPath = basePath + 'sounds/uploads/' + user.username + '/';
      var title = req.body.sound.title + '[' + req.body.track.title + ']';
      var description = req.body.sound.description;
      var lat = req.body.sound.lat;
      var long = req.body.sound.long;

      var fileTitle = title;
      fileTitle.replace(/\s+/g, "");
      fileTitle.replace("[", "");
      fileTitle.replace("]", "");

      // Debug stuff
      console.log(fileTitle);
      console.log(TAG + "Client dir: " + basePath);

      // Populate the ffmpeg command
      outputPath = outputPath + 'remix-' + dateNow + '.mp3';
      var command = 'ffmpeg -i ' + soundPath + ' -i ' + trackPath + ' -filter_complex amix=duration=shortest ' + outputPath;
      console.log(TAG + "THE COMMAND: " + command);


      // Execute mp3 encoding
      var exec = require('child_process').exec;
      var child = exec(command, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

        if (error !== null) {
          console.log('exec error: ' + error);
          res.status(500);
          res.json({success: false, error: error});
        } else {
          // Trim the filePath for the file
          var filePath = outputPath;
          console.log(TAG + "Path before: " + filePath);
          if (filePath.indexOf('\\') !== -1) {
            filePath = filePath.replace('\\home\\admin\\serendipity-web\\client\\', '');
          } else {
            filePath = filePath.replace(basePath, "");
          }
          console.log(TAG + "Path after: " + filePath);

          // Save the sound in DB
          db.Sound.create({
            title: title,
            description: description,
            status: 'remix',
            lat: lat,
            long: long,
            path: filePath,
            UserId: user.id
          }).then(function (result) {
            console.log(TAG + "Sound created in db");
            res.status(200);
            res.json({success: true, message: 'Remixed successfully'});
          }, function (err) {
            res.status(500);
            res.json({success: false, message: 'Error on saving the sound to db', error: err})
          });

        }
      });

    } else {
      res.status(403);
      res.json({success: false, message: "User not found"});
    }

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
