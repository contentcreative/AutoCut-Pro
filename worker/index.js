const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.WORKER_PORT || 3030;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const videoRoutes = require('./routes/video');
const remixRoutes = require('./routes/remix');
const exportRoutes = require('./routes/export');

// Routes
app.use('/video', videoRoutes);
app.use('/remix', remixRoutes);
app.use('/export', exportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    worker: 'autocut-pro-video-processor'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Worker error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 AutoCut Pro Worker running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
