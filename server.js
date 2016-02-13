var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./server/database');

var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Middleware
app.use(favicon(__dirname + '/client/images/favicon.jpg'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

// Variables & port config
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';
app.set('port', process.env.PORT || 3000);

// Setup routes
app.use('/', require('./server/routes'));


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
