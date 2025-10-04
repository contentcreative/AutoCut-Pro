const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3030;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    worker: 'simple-ai-video-processor'
  });
});

// Simple video generation endpoint
app.post('/video/generate', (req, res) => {
  console.log('🎬 Received video generation request');
  console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
  
  // Just acknowledge the request
  res.json({ 
    status: 'received',
    message: 'Video generation request received successfully',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Simple AI Video Worker running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('✅ Ready to receive video generation requests!');
});

module.exports = app;
