const express = require('express');
const { processExportJob } = require('../services/export-processor');
const { assertWorkerAuth } = require('../middleware/auth');

const router = express.Router();

// POST /export/process - Process export job
router.post('/process', assertWorkerAuth, async (req, res) => {
  try {
    const { jobId, userId, formats, options, sourceVideoPath } = req.body;
    
    if (!jobId || !userId || !formats || !sourceVideoPath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`📦 Starting export processing for job ${jobId}`);
    
    // Start the export processing asynchronously
    processExportJob({ jobId, userId, formats, options, sourceVideoPath }).catch(error => {
      console.error(`❌ Export processing error for job ${jobId}:`, error);
    });

    res.json({ 
      ok: true, 
      message: 'Export processing started',
      jobId,
      formats: formats.length 
    });
  } catch (error) {
    console.error('Export processing error:', error);
    res.status(500).json({ error: 'Failed to start export processing' });
  }
});

module.exports = router;
