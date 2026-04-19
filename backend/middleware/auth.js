const authenticateToken = (req, res, next) => {
  // Simple authentication - just check if user exists in session or basic auth
  // For now, we'll just pass through (no authentication required)
  // You can implement session-based auth later if needed
  req.user = {
    id: 3, // Admin user is the 3rd user in seeders (index 2)
    role: 'admin',
    fullName: 'Admin User',
    email: 'admin@geniussocietyhotel.com'
  };
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
