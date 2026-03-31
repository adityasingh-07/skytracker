const router = require('express').Router();
const passport = require('passport');
const { User, Passenger, Crew } = require('../models');
const { isAuthenticated } = require('../middleware/auth');

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
);

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  return res.json({ user: null });
});

// Select role (first-time login)
router.post('/select-role', isAuthenticated, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['passenger', 'admin', 'crew'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be: passenger, admin, or crew' });
    }
    if (req.user.role) {
      return res.status(400).json({ error: 'Role already selected.' });
    }

    await User.update({ role }, { where: { user_id: req.user.user_id } });

    // Auto-create passenger profile if passenger role
    if (role === 'passenger') {
      const nameParts = req.user.name.split(' ');
      await Passenger.create({
        user_id: req.user.user_id,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
      });
    }

    // Auto-create crew profile if crew role
    if (role === 'crew') {
      await Crew.create({
        user_id: req.user.user_id,
        name: req.user.name,
        role: 'Flight Attendant',
        certification: null,
      });
    }

    const updatedUser = await User.findByPk(req.user.user_id);
    return res.json({ user: updatedUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    req.session.destroy();
    return res.json({ success: true });
  });
});

module.exports = router;
