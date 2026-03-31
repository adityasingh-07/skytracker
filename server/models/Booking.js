const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  booking_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  passenger_id: { type: DataTypes.INTEGER, allowNull: false },
  flight_id: { type: DataTypes.INTEGER, allowNull: false },
  booking_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  seat_number: { type: DataTypes.STRING, allowNull: true },
  ticket_type: {
    type: DataTypes.ENUM('economy', 'business', 'first'),
    allowNull: false,
    defaultValue: 'economy',
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, { tableName: 'bookings', timestamps: false });

module.exports = Booking;
