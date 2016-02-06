var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : 'localhost',
  user            : 'root',
  password        : 'root',
  database        : 'serendipity'
});

// Get users
exports.getAllUsers = function(callback) {
  var sql = 'SELECT * FROM users';

  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err); callback(true); return;
    }
    connection.query(sql, function(err, results) {
      connection.release();
      if(err) {
        console.log(err); callback(true); return;
      }
      callback(false, results);
    });
  });
};
