const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  google_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
  role: {
    type: DataTypes.ENUM('passenger', 'admin', 'crew'),
    allowNull: true,
    defaultValue: null,
  },
}, { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = User;
