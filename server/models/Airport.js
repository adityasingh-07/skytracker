const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Airport = sequelize.define('Airport', {
  airport_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  iata_code: { type: DataTypes.STRING(3), unique: true, allowNull: false },
}, { tableName: 'airports', timestamps: false });

module.exports = Airport;
