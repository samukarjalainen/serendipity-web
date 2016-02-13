'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    city: Sequelize.STRING,
    country: Sequelize.STRING,
    role: {
      type: Sequelize.STRING,
      defaultValue: "user"
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Sound)
      }
    }
  });

  return User;
};
