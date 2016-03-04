var gcm = require('node-gcm');


var apiKey = 'Nm7kL8kp';
var sender = new gcm.Sender(apiKey);


var gcmMethods = {

  register : function (req, res) {

    // Get the user info from db

    // Store key in db


  },

  unregister : function (req, res) {

  },

  send : function (req, res) {

  }
};

module.exports = gcmMethods;
