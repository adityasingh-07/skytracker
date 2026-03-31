const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Crew = sequelize.define('Crew', {
  crew_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false }, // e.g., Pilot, Co-Pilot, Flight Attendant
  certification: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'crew', timestamps: false });

module.exports = Crew;
