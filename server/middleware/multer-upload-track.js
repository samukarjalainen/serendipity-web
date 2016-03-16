var multer = require('multer');
var mkdirp = require('mkdirp');
var auth = require('../routes/auth');


var storage = multer.diskStorage({

  destination: function (req, file, cb) {
    var dest = './client/sounds/tracks/';
    console.log(dest);
    mkdirp.sync(dest);
    cb(null, dest)
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }

});

var uploadTrack = multer({ storage: storage }).single('file');

module.exports = uploadTrack;
