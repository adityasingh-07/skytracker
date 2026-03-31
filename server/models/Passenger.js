const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Passenger = sequelize.define('Passenger', {
  passenger_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  passport_number: { type: DataTypes.STRING, allowNull: true },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
}, { tableName: 'passengers', timestamps: false });

module.exports = Passenger;
