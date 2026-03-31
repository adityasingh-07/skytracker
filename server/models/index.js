const sequelize = require('../config/database');

const User = require('./User');
const Airline = require('./Airline');
const Airport = require('./Airport');
const Aircraft = require('./Aircraft');
const Flight = require('./Flight');
const FlightStatus = require('./FlightStatus');
const Crew = require('./Crew');
const Passenger = require('./Passenger');
const Booking = require('./Booking');

// ─── Associations ───

// Airline -> Flights (1:M)
Airline.hasMany(Flight, { foreignKey: 'airline_id' });
Flight.belongsTo(Airline, { foreignKey: 'airline_id' });

// Aircraft -> Flights (1:M)
Aircraft.hasMany(Flight, { foreignKey: 'aircraft_id' });
Flight.belongsTo(Aircraft, { foreignKey: 'aircraft_id' });

// Airport -> Flights (departure & arrival)
Airport.hasMany(Flight, { foreignKey: 'departure_airport_id', as: 'departures' });
Airport.hasMany(Flight, { foreignKey: 'arrival_airport_id', as: 'arrivals' });
Flight.belongsTo(Airport, { foreignKey: 'departure_airport_id', as: 'DepartureAirport' });
Flight.belongsTo(Airport, { foreignKey: 'arrival_airport_id', as: 'ArrivalAirport' });

// Flight -> FlightStatus (1:M)
Flight.hasMany(FlightStatus, { foreignKey: 'flight_id', as: 'statuses' });
FlightStatus.belongsTo(Flight, { foreignKey: 'flight_id' });

// Flight <-> Crew (M:M through flight_crew)
Flight.belongsToMany(Crew, { through: 'flight_crew', foreignKey: 'flight_id', otherKey: 'crew_id' });
Crew.belongsToMany(Flight, { through: 'flight_crew', foreignKey: 'crew_id', otherKey: 'flight_id' });

// User -> Crew (1:1 optional)
User.hasOne(Crew, { foreignKey: 'user_id' });
Crew.belongsTo(User, { foreignKey: 'user_id' });

// User -> Passenger (1:1)
User.hasOne(Passenger, { foreignKey: 'user_id' });
Passenger.belongsTo(User, { foreignKey: 'user_id' });

// Passenger -> Bookings (1:M)
Passenger.hasMany(Booking, { foreignKey: 'passenger_id' });
Booking.belongsTo(Passenger, { foreignKey: 'passenger_id' });

// Flight -> Bookings (1:M)
Flight.hasMany(Booking, { foreignKey: 'flight_id' });
Booking.belongsTo(Flight, { foreignKey: 'flight_id' });

module.exports = {
  sequelize,
  User,
  Airline,
  Airport,
  Aircraft,
  Flight,
  FlightStatus,
  Crew,
  Passenger,
  Booking,
};
