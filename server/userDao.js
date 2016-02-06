var connectionProvider = require('./mySqlConnectionProvider');

var userDao = {

  getAllUsers : function (onSuccess) {
    var statement = "SELECT * FROM users";
    var connection = connectionProvider.mySqlConnectionProvider.getMysqlConnection();

    if (connection) {
      connection.query(statement, function (err, rows, fields) {
        if (err) {
          throw err;
        }

        console.log(rows);
        onSuccess(rows);
      });
      connectionProvider.mySqlConnectionProvider.closeMySqlConnection(connection);
    }
  }
};
