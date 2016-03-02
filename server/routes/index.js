var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var users = require('./users.js');
var sounds = require('./sounds.js');


// Public routes
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/register', users.create);


// Routes that require user role (logging in)
router.get('/api/user/:username', users.getOne);
router.post('/api/users/update', users.update);
router.post('/api/sounds/upload', sounds.create);
router.post('/api/sounds/mysounds', sounds.getUserSounds);
router.get('/api/sounds/get-all', sounds.getAll);
router.post('/api/sounds/get-all-by-location', sounds.getAllByLocation);


// Admin user routes
router.get('/api/users', users.getAll);
router.get('/api/sounds', sounds.getAll);


module.exports = router;
