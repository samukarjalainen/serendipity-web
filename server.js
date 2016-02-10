var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./server/api');
var Sequelize = require('sequelize');

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

app.post('/login', function (req, res) {
  res.json(req.body);
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
