const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FlightStatus = sequelize.define('FlightStatus', {
  status_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  flight_id: { type: DataTypes.INTEGER, allowNull: false },
  status_type: {
    type: DataTypes.ENUM('scheduled', 'boarding', 'departed', 'in_air', 'landed', 'delayed', 'cancelled'),
    allowNull: false,
    defaultValue: 'scheduled',
  },
  delay_reason: { type: DataTypes.STRING, allowNull: true },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'flight_status', timestamps: false });

module.exports = FlightStatus;
