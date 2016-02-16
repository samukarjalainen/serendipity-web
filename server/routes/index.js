var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var users = require('./users.js');
var sounds = require('./sounds.js');

// Public routes
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.get('/register');

// Routes that require user role (logging in)


// Regular user routes
router.get('/api/user/:username', users.getOne);
router.post('/api/users/create', users.create);
router.post('/api/users/update', users.update);
router.post('/api/sounds/upload', sounds.create);

// Admin user routes
router.get('/api/users', users.getAll);
router.get('/api/sounds', sounds.getAll);


module.exports = router;
