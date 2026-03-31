const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aircraft = sequelize.define('Aircraft', {
  aircraft_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  model: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  manufacturer: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'aircraft', timestamps: false });

module.exports = Aircraft;
