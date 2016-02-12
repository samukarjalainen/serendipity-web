var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./server/api');
var Sequelize = require('sequelize');
var multer = require('multer');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware
app.use(favicon(__dirname + '/client/images/favicon.jpg'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

// Configure multer (file uploading
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    cb(null, 'upload-' + datetimestamp);
  }
});

var upload = multer({ storage: storage }).single('file');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
app.set('port', process.env.PORT || 3000);



// API calls
app.get('/api/users', function (req, res) {
  db.User.findAll().then(function (results) {
    res.json(results);
  });
});

app.get('/api/sounds', function (req, res) {
  db.Sound.findAll().then(function (results) {
    res.json(results);
  });
});

app.get('/api/users/email', function (req, res) {
  db.User.findOne({
    where: {
      email: 'test@serendipity.com'
    }
  }).then(function (result) {
    res.json(result);
  })
});

app.post('/login', function (req, res) {
  var success = false;

  db.User.find({
    where: Sequelize.or({ username: req.body.email }, { email: req.body.email })
  }).then(function (user) {
    if (user && req.body.password === user.password) {
      success = true;
      res.json(success);
      //res.redirect('#/dashboard');
    } else {
      res.json(success);
    }
  });
});

app.post('/register', function (req, res) {
  var created = false;

  db.User.find({
    where: Sequelize.or({ username: req.body.username }, { email: req.body.email })
  }).then(function (user) {
    if (!user) {
      db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        country: req.body.country
      });
      created = true;
    }
    res.json(created);
  });
});

app.post('/upload', function(req, res) {
  upload(req,res,function(err){
    //console.log(req);
    if(err){
      console.log(err);
      res.json({error_code:1,err_desc:err});
      return;
    }
    console.log('Creating a file in DB');
    console.log(req.body);
    console.log(req.file);
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
});
//
//app.post('/uploadsound', function(req, res) {
//  upload(req,res,function(err){
//    console.log("upload starting");
//    console.log(req);
//    if(err){
//      console.log(err);
//      res.json({error_code:1,err_desc:err});
//      return;
//    }
//    console.log('[/uploadsound] Creating a file in DB');
//    console.log(req.body);
//    console.log(req.file);
//    db.User.findOne({ where: {email: 'test@serendipity.com'}}).then(function (user) {
//      if (user) {
//        db.Sound.create({
//          title: req.body.title,
//          description: req.body.description,
//          lat: req.body.lat,
//          long: req.body.long,
//          path: req.file.path,
//          UserId: user.id
//        })
//      }
//    }).then(function () {
//      res.json({error_code:0,err_desc:null});
//    });
//  });
//});

app.get('/logout', function (req, res) {
  console.log("Logout called, redirecting to homepage");
  res.redirect('/');
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {},
        title: 'error'
    });
});

// Synchronize db with sequelize model, create dummy users and then start the server
db.sequelize.sync({}).then(function () {
  //db.User
  //  .findOrCreate({where: {
  //    username: 'Admin',
  //    email: 'admin@serendipity.com',
  //    password: 's3cr37',
  //    firstName: 'Admin',
  //    lastName: 'Admin',
  //    city: 'Oulu',
  //    country: 'Finland'
  //  }}).then(function () {
  //    db.User
  //      .findOrCreate({where: {
  //        username: 'test',
  //        email: 'test@serendipity.com',
  //        password: 'test',
  //        firstName: 'Testing',
  //        lastName: 'Account',
  //        city: 'Oulu',
  //        country: 'Finland'
  //      }}).then(function () {
  //        var server = app.listen(app.get('port'), function () {
  //          console.log('Express server listening on port ' + server.address().port);
  //        })
  //      })
  //  });
  var server = app.listen(app.get('port'), function () {
    console.log('Server started on port ' + server.address().port);
  });
});

module.exports = app;
