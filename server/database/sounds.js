'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Sound = sequelize.define('Sound', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    status: {
      type: Sequelize.STRING,
      defaultValue: 'original'
    },
    lat: Sequelize.DECIMAL(10,8),
    long: Sequelize.DECIMAL(11,8),
    path: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        Sound.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: true
          }
        });
      }
    }
  });
  return Sound;
};
