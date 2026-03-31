const router = require('express').Router();
const { Flight, Booking, Airline, Airport, Aircraft, Crew, Passenger, User } = require('../models');
const { hasRole } = require('../middleware/auth');

// GET dashboard stats (admin)
router.get('/stats', hasRole('admin'), async (req, res) => {
  try {
    const totalFlights = await Flight.count();
    const totalBookings = await Booking.count();
    const totalPassengers = await Passenger.count();
    const totalCrew = await Crew.count();
    const totalAirlines = await Airline.count();
    const totalAirports = await Airport.count();
    const totalAircraft = await Aircraft.count();
    const totalUsers = await User.count();

    const paidBookings = await Booking.count({ where: { payment_status: 'paid' } });

    return res.json({
      totalFlights,
      totalBookings,
      totalPassengers,
      totalCrew,
      totalAirlines,
      totalAirports,
      totalAircraft,
      totalUsers,
      paidBookings,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
