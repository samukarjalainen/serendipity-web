var multer = require('multer');
var mkdirp = require('mkdirp');
var auth = require('../routes/auth');
var separator = '-';


var storage = multer.diskStorage({

  destination: function (req, file, cb) {
    var user = auth.getUser(req);
    var dest = './client/sounds/uploads/' + user.username + '/remix/';
    console.log(dest);
    mkdirp.sync(dest);
    cb(null, dest)
  },

  filename: function (req, file, cb) {
    var timestamp = Date.now();
    var fileParts = file.originalname.split('.');
    var origFileName = fileParts[0];
    var extension = fileParts.pop();
    cb(null, origFileName + separator + timestamp + '.' + extension);
  }

});

var upload = multer({ storage: storage }).single('file');

module.exports = upload;
