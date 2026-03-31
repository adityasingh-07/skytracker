const router = require('express').Router();
const { Booking, Passenger, Flight, Airline, Airport } = require('../models');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// GET my bookings (passenger)
router.get('/my', hasRole('passenger'), async (req, res) => {
  try {
    const passenger = await Passenger.findOne({ where: { user_id: req.user.user_id } });
    if (!passenger) return res.status(404).json({ error: 'Passenger profile not found' });

    const bookings = await Booking.findAll({
      where: { passenger_id: passenger.passenger_id },
      include: [{
        model: Flight,
        include: [
          { model: Airline },
          { model: Airport, as: 'DepartureAirport' },
          { model: Airport, as: 'ArrivalAirport' },
        ],
      }],
      order: [['booking_date', 'DESC']],
    });

    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET all bookings (admin)
router.get('/', hasRole('admin'), async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Passenger },
        {
          model: Flight,
          include: [
            { model: Airline },
            { model: Airport, as: 'DepartureAirport' },
            { model: Airport, as: 'ArrivalAirport' },
          ],
        },
      ],
      order: [['booking_date', 'DESC']],
    });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST create booking (passenger)
router.post('/', hasRole('passenger'), async (req, res) => {
  try {
    const passenger = await Passenger.findOne({ where: { user_id: req.user.user_id } });
    if (!passenger) return res.status(404).json({ error: 'Passenger profile not found' });

    const booking = await Booking.create({
      passenger_id: passenger.passenger_id,
      flight_id: req.body.flight_id,
      booking_date: new Date(),
      seat_number: req.body.seat_number || null,
      ticket_type: req.body.ticket_type || 'economy',
      payment_status: 'paid',
    });

    return res.status(201).json(booking);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE cancel booking (passenger owns it, or admin)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: [Passenger] });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (req.user.role === 'admin' || booking.Passenger?.user_id === req.user.user_id) {
      await Booking.update(
        { payment_status: 'refunded' },
        { where: { booking_id: req.params.id } }
      );
      return res.json({ success: true });
    }

    return res.status(403).json({ error: 'Not authorized to cancel this booking' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
