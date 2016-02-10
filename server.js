var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./server/api');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
app.set('port', process.env.PORT || 3000);

app.use(favicon(__dirname + '/client/images/favicon.jpg'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

// API calls
app.get('/api/users', function (req, res) {
  db.User.findAll().then(function (results) {
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

app.post('/api/register', function (req, res) {

  var wasCreated = "";

  db.User
    .findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        country: req.body.country
      }
    })
    .spread(function (user, created) {
      console.log(user.get({plain: true}));
      console.log(created);
      wasCreated = created;
    })
    .then(function () {
  });

});

app.get('/logout', function (req, res) {
  console.log("Logout called, redirecting to homepage");
  res.redirect('/');
});

  //db.User
  //  .build({
  //    username: req.body.username,
  //    email: req.body.email,
  //    password: req.body.password,
  //    firstName: req.body.firstName,
  //    lastName: req.body.lastName,
  //    city: req.body.city,
  //    country: req.body.country
  //  })
  //  .save();

/// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

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
db.sequelize.sync().then(function () {

  db.User
    .findOrCreate({where: {
      username: 'Admin',
      email: 'admin@serendipity.com',
      password: 's3cr37',
      firstName: 'Admin',
      lastName: 'Admin',
      city: 'Oulu',
      country: 'Finland'
    }}).then(function () {
      db.User
        .findOrCreate({where: {
          username: 'test',
          email: 'test@serendipity.com',
          password: 'test',
          firstName: 'Testing',
          lastName: 'Account',
          city: 'Oulu',
          country: 'Finland'
        }}).then(function () {
          var server = app.listen(app.get('port'), function () {
            console.log('Express server listening on port ' + server.address().port);
          })
        })
    });
});

module.exports = app;
