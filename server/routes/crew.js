const router = require('express').Router();
const { Crew, Flight, Airline, Airport, Aircraft } = require('../models');
const { isAuthenticated, hasRole } = require('../middleware/auth');

// GET my assigned flights (crew member)
router.get('/my-flights', hasRole('crew'), async (req, res) => {
  try {
    const crewMember = await Crew.findOne({ where: { user_id: req.user.user_id } });
    if (!crewMember) return res.status(404).json({ error: 'Crew profile not found' });

    const flights = await crewMember.getFlights({
      include: [
        { model: Airline },
        { model: Aircraft },
        { model: Airport, as: 'DepartureAirport' },
        { model: Airport, as: 'ArrivalAirport' },
      ],
      order: [['departure_time', 'ASC']],
    });

    return res.json(flights);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET crew roster for a flight
router.get('/flight/:flightId', isAuthenticated, async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.flightId);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    const crewMembers = await flight.getCrews();
    return res.json(crewMembers);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET my crew profile
router.get('/profile', hasRole('crew'), async (req, res) => {
  try {
    const crewMember = await Crew.findOne({ where: { user_id: req.user.user_id } });
    return res.json(crewMember);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT update my crew profile (certification, role)
router.put('/profile', hasRole('crew'), async (req, res) => {
  try {
    const { role, certification } = req.body;
    await Crew.update(
      { role, certification },
      { where: { user_id: req.user.user_id } }
    );
    const updated = await Crew.findOne({ where: { user_id: req.user.user_id } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET all crew members (admin)
router.get('/', hasRole('admin'), async (req, res) => {
  try {
    const crew = await Crew.findAll({ order: [['name', 'ASC']] });
    return res.json(crew);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST assign crew to flight (admin)
router.post('/assign', hasRole('admin'), async (req, res) => {
  try {
    const { flight_id, crew_id } = req.body;
    const flight = await Flight.findByPk(flight_id);
    const crewMember = await Crew.findByPk(crew_id);
    if (!flight || !crewMember) return res.status(404).json({ error: 'Flight or crew not found' });

    await flight.addCrew(crewMember);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
