var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var users = require('./users.js');
var sounds = require('./sounds.js');
var tracks = require('./tracks.js');
var gcm = require('./gcm.js');


// Public routes
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/register', users.create);
router.get('/sounds/get-all', sounds.getAll);
router.post('/gcm-register', gcm.register);
router.post('/gcm-unregister', gcm.unregister);
router.get('/sounds/download/:id', sounds.downloadByIdFromParams);
router.post('/sounds/download', sounds.downloadByIdFromHeaderOrBody);
router.get('/sounds/create-dummy-sounds', sounds.createDummySounds);
router.get('/users/create-dummy-users', users.createDummyUsers);
router.get('/tracks/get-all', tracks.getAll);

// Routes that require user role (logging in)
router.get('/api/user/:username', users.getOne);
router.post('/api/users/update', users.update);
router.post('/api/sounds/upload', sounds.create);
router.post('/api/sounds/mysounds', sounds.getUserSounds);

router.post('/api/sounds/get-all-by-location', sounds.getAllByLocation);
//TO DO
router.post('api/sounds/update', sounds.update);
router.delete('/api/sounds/delete', sounds.delete);

// Admin user routes
router.get('/api/users', users.getAll);
router.get('/api/sounds', sounds.getAll);
router.post('/api/tracks/upload', tracks.create);


module.exports = router;
