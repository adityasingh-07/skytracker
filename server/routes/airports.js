const router = require('express').Router();
const { Airport } = require('../models');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const airports = await Airport.findAll({ order: [['name', 'ASC']] });
    return res.json(airports);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', hasRole('admin'), async (req, res) => {
  try {
    const airport = await Airport.create(req.body);
    return res.status(201).json(airport);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', hasRole('admin'), async (req, res) => {
  try {
    await Airport.update(req.body, { where: { airport_id: req.params.id } });
    const airport = await Airport.findByPk(req.params.id);
    return res.json(airport);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', hasRole('admin'), async (req, res) => {
  try {
    await Airport.destroy({ where: { airport_id: req.params.id } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
