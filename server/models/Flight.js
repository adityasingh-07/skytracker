const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flight = sequelize.define('Flight', {
  flight_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  flight_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  airline_id: { type: DataTypes.INTEGER, allowNull: false },
  aircraft_id: { type: DataTypes.INTEGER, allowNull: true },
  departure_airport_id: { type: DataTypes.INTEGER, allowNull: false },
  arrival_airport_id: { type: DataTypes.INTEGER, allowNull: false },
  departure_time: { type: DataTypes.DATE, allowNull: false },
  arrival_time: { type: DataTypes.DATE, allowNull: false },
  base_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'flights', timestamps: false });

module.exports = Flight;
