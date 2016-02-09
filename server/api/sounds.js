'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Sound = sequelize.define('Sound', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    gpsLoc: Sequelize.STRING,
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

            allowNull: false
          }
        });
      }
    }
  });

  return Sound;
};
