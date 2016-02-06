//var app = require('../server.js');

module.exports = {
  getUsers : function (req, res) {
    console.log("GET requsted at /api/users");
    var person1 = {
      id : '123',
      username : 'dummyuser'
    };

    var person2 = {
      id : '999',
      username : 'roflcopter'
    };

    var users = [person1, person2];
    res.json(users);
  }
};


