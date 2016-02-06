var mysql = require('mysql');
var connectionString = require('./mySqlConnectionString');


var mySqlConnectionProvider = {

  getMysqlConnection : function () {
    var connection = mysql.createConnection(connectionString.mySqlConnectionString.connection.dev);
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
// Production server uses these values too, so make your local database with the same credentials
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'serendipity'
});

module.exports = {
  getUsers: function() {
    connection.query('SELECT * FROM users',
      function(err, results, fields) {
        if (err) return (err);
        return results;
      }
    );
  }
};

//getUsers = function() {
//  connection.query('SELECT * FROM users', function(err, result) {
//    if (err) {
//      throw(err);
//    }
//    console.log(result);
//    return result;
//
//  });
//};


//connection.query('SELECT * FROM users', function (err, results) {
//
//  if (!err) {
//    //console.log('Data: ', results);
//  }
//  else {
//    console.log('Error connecting to database');
//  }
//
//});


