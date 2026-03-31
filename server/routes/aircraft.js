const router = require('express').Router();
const { Aircraft } = require('../models');
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const aircraft = await Aircraft.findAll({ order: [['model', 'ASC']] });
    return res.json(aircraft);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', hasRole('admin'), async (req, res) => {
  try {
    const plane = await Aircraft.create(req.body);
    return res.status(201).json(plane);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', hasRole('admin'), async (req, res) => {
  try {
    await Aircraft.update(req.body, { where: { aircraft_id: req.params.id } });
    const plane = await Aircraft.findByPk(req.params.id);
    return res.json(plane);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', hasRole('admin'), async (req, res) => {
  try {
    await Aircraft.destroy({ where: { aircraft_id: req.params.id } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
