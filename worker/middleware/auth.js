const assertWorkerAuth = (req, res, next) => {
  const authHeader = req.headers['x-api-key'];
  const expectedKey = process.env.WORKER_API_KEY || 'dev-secret';

  if (!authHeader || authHeader !== expectedKey) {
    console.warn(`🚫 Unauthorized worker request from ${req.ip} (expected: ${expectedKey}, got: ${authHeader})`);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = { assertWorkerAuth };
