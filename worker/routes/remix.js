const express = require('express');
const { startRemixPipeline } = require('../services/remix-pipeline');
const { assertWorkerAuth } = require('../middleware/auth');

const router = express.Router();

// POST /remix/generate - Start trending remix generation
router.post('/generate', assertWorkerAuth, async (req, res) => {
  try {
    const { jobId, userId, source, options, webhookUrl } = req.body;
    
    if (!jobId || !userId || !source) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`🎭 Starting remix generation for job ${jobId}`);
    
    // Start the remix pipeline asynchronously
    startRemixPipeline({ jobId, userId, source, options, webhookUrl }).catch(error => {
      console.error(`❌ Remix pipeline error for job ${jobId}:`, error);
    });

    res.json({ 
      ok: true, 
      message: 'Remix pipeline started',
      jobId,
      source: source.title 
    });
  } catch (error) {
    console.error('Remix generation error:', error);
    res.status(500).json({ error: 'Failed to start remix generation' });
  }
});

// POST /remix/cancel/:jobId - Cancel remix job
router.post('/cancel/:jobId', assertWorkerAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    console.log(`🛑 Cancelling remix job ${jobId}`);
    
    // TODO: Implement cancellation logic
    // await cancelRemixJob(jobId);

    res.json({ 
      ok: true, 
      message: 'Remix job cancelled',
      jobId 
    });
  } catch (error) {
    console.error('Remix cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel remix job' });
  }
});

module.exports = router;
