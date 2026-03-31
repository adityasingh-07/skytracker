const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Airline = sequelize.define('Airline', {
  airline_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'airlines', timestamps: false });

module.exports = Airline;
