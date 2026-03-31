const router = require('express').Router();
const { Op } = require('sequelize');
const { Flight, Airline, Airport, Aircraft, FlightStatus } = require('../models');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// GET all flights (any authenticated user)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { from, to, date, airline } = req.query;
    const where = {};

    if (from) where.departure_airport_id = from;
    if (to) where.arrival_airport_id = to;
    if (airline) where.airline_id = airline;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.departure_time = { [Op.between]: [start, end] };
    }

    const flights = await Flight.findAll({
      where,
      include: [
        { model: Airline },
        { model: Aircraft },
        { model: Airport, as: 'DepartureAirport' },
        { model: Airport, as: 'ArrivalAirport' },
        { model: FlightStatus, as: 'statuses', order: [['updated_at', 'DESC']], limit: 1 },
      ],
      order: [['departure_time', 'ASC']],
    });

    return res.json(flights);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET single flight with full details
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id, {
      include: [
        { model: Airline },
        { model: Aircraft },
        { model: Airport, as: 'DepartureAirport' },
        { model: Airport, as: 'ArrivalAirport' },
        { model: FlightStatus, as: 'statuses', order: [['updated_at', 'DESC']] },
      ],
    });
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    return res.json(flight);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST create flight (admin only)
router.post('/', hasRole('admin'), async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    // Create initial status
    await FlightStatus.create({
      flight_id: flight.flight_id,
      status_type: 'scheduled',
      updated_at: new Date(),
    });
    return res.status(201).json(flight);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT update flight (admin only)
router.put('/:id', hasRole('admin'), async (req, res) => {
  try {
    const [updated] = await Flight.update(req.body, {
      where: { flight_id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: 'Flight not found' });
    const flight = await Flight.findByPk(req.params.id);
    return res.json(flight);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE flight (admin only)
router.delete('/:id', hasRole('admin'), async (req, res) => {
  try {
    const deleted = await Flight.destroy({ where: { flight_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Flight not found' });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST update flight status (admin only)
router.post('/:id/status', hasRole('admin'), async (req, res) => {
  try {
    const { status_type, delay_reason } = req.body;
    const status = await FlightStatus.create({
      flight_id: req.params.id,
      status_type,
      delay_reason: delay_reason || null,
      updated_at: new Date(),
    });
    return res.status(201).json(status);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
