const express = require('express');
const { startGenerationPipeline } = require('../services/ai-video-pipeline');
const { assertWorkerAuth } = require('../middleware/auth');

const router = express.Router();

// POST /video/generate - Start AI video generation
router.post('/generate', assertWorkerAuth, async (req, res) => {
  try {
    const { jobId, projectId } = req.body;
    
    if (!jobId || !projectId) {
      return res.status(400).json({ error: 'Missing jobId or projectId' });
    }

    console.log(`🎬 Starting AI video generation for job ${jobId}, project ${projectId}`);
    
    // Start the pipeline asynchronously
    startGenerationPipeline({ jobId, projectId }).catch(error => {
      console.error(`❌ Pipeline error for job ${jobId}:`, error);
    });

    res.json({ 
      ok: true, 
      message: 'Generation pipeline started',
      jobId,
      projectId 
    });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to start generation' });
  }
});

// POST /video/regenerate - Regenerate specific step
router.post('/regenerate', assertWorkerAuth, async (req, res) => {
  try {
    const { projectId, step } = req.body;
    
    if (!projectId || !step) {
      return res.status(400).json({ error: 'Missing projectId or step' });
    }

    console.log(`🔄 Starting regeneration for project ${projectId}, step: ${step}`);
    
    // TODO: Implement regeneration logic
    // startRegeneration({ projectId, step }).catch(error => {
    //   console.error(`❌ Regeneration error for project ${projectId}:`, error);
    // });

    res.json({ 
      ok: true, 
      message: 'Regeneration started',
      projectId,
      step 
    });
  } catch (error) {
    console.error('Video regeneration error:', error);
    res.status(500).json({ error: 'Failed to start regeneration' });
  }
});

// GET /video/status/:jobId - Get job status
router.get('/status/:jobId', assertWorkerAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // TODO: Implement status check from database
    res.json({ 
      jobId,
      status: 'processing',
      step: 'generating_script',
      progress: 25
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

module.exports = router;
