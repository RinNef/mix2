const jwt = require('jsonwebtoken');

const ADMIN = { username: 'admin', password: 'admin123' };

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
};
