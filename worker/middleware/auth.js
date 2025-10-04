const assertWorkerAuth = (req, res, next) => {
  const authHeader = req.headers['x-api-key'];
  const expectedKey = process.env.WORKER_API_KEY;

  if (!expectedKey) {
    console.error('❌ WORKER_API_KEY not configured');
    return res.status(500).json({ error: 'Worker authentication not configured' });
  }

  if (!authHeader || authHeader !== expectedKey) {
    console.warn(`🚫 Unauthorized worker request from ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = { assertWorkerAuth };
