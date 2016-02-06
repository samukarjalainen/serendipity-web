var mysqlConnectionString = {
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

module.exports.mySqlConnectionString = mysqlConnectionString;
