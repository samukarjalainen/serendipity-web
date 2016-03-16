'use strict';

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Track = sequelize.define('Track', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    type: Sequelize.STRING,
    path: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
    }
  });
  return Track;
};
