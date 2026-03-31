// Authentication & role-based authorization middleware

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated. Please sign in.' });
}

function hasRole(...roles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    if (!req.user.role) {
      return res.status(403).json({ error: 'No role selected. Please select a role first.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
    }
    return next();
  };
}

module.exports = { isAuthenticated, hasRole };
