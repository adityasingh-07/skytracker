const router = require('express').Router();
const { Airline } = require('../models');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const airlines = await Airline.findAll({ order: [['name', 'ASC']] });
    return res.json(airlines);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', hasRole('admin'), async (req, res) => {
  try {
    const airline = await Airline.create(req.body);
    return res.status(201).json(airline);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', hasRole('admin'), async (req, res) => {
  try {
    await Airline.update(req.body, { where: { airline_id: req.params.id } });
    const airline = await Airline.findByPk(req.params.id);
    return res.json(airline);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', hasRole('admin'), async (req, res) => {
  try {
    await Airline.destroy({ where: { airline_id: req.params.id } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
