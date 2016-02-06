var mysql = require('mysql');
//var connectionString = require('./mySqlConnectionString');

var connectionString = {
  connection : {
    dev : {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'serendipity'
    },
    production : {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'serendipity'
    }
  }
};


var mySqlConnectionProvider = {

  getMysqlConnection : function () {
    var connection = mysql.createConnection(connectionString.connection.dev);
    connection.connect(function (err) {
      if (err) {
        throw err;
      }
      console.log('Connected to DB');
    });
    return connection;
  },

  closeMySqlConnection : function (currentConnection) {
    if (currentConnection) {
      currentConnection.end(function (err) {
        if (err) {
          throw err;
        }
        console.log('Disconnected from DB');
      });
    }
  }
};

module.exports.mySqlConnectionProvider = mySqlConnectionProvider;
