const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid token' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
