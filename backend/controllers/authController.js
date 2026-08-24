exports.login = (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@test.com' && password === 'Ranfer20') {
    return res.status(200).json({
      message: 'Authentication successful',
      token: 'cyber-jwt-token-rm-2026',
      user: { email: 'admin@test.com', role: 'Club Administrator' }
    });
  }
  return res.status(401).json({ message: 'Invalid credentials. Access Denied.' });
};