import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import crypto from 'crypto';
import archiver from 'archiver';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Client } from 'pg';
import { createSupabaseAdminClient } from '../lib/supabase/admin';

// Set FFmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const app = express();
app.use(express.json());

const MAX_CONCURRENT = Number(process.env.EXPORT_MAX_CONCURRENT || 1);
let running = 0;

// Database client for worker
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

// Connect to database
client.connect().then(() => {
  console.log('âœ… Worker connected to database');
}).catch(err => {
  console.error('âŒ Failed to connect to database:', err);
  process.exit(1);
});

// Function to claim next job from the queue
async function claimNextJob() {
  try {
    const result = await client.query(`
      UPDATE export_jobs
      SET status = 'processing', started_at = NOW(), updated_at = NOW(), processing_started_at = NOW()
      WHERE id = (
        SELECT id FROM export_jobs
        WHERE status = 'queued'
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      RETURNING *;
    `);
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error claiming job:', error);
    return null;
  }
}

// Function to update job progress
async function updateJobProgress(jobId: string, progress: number, status?: string) {
  try {
    let query = 'UPDATE export_jobs SET progress = $1, updated_at = NOW()';
    const params: any[] = [progress];
    
    if (status) {
      query += ', status = $2';
      params.push(status);
    }
    
    query += ' WHERE id = $' + (params.length + 1);
    params.push(jobId);
    
    await client.query(query, params);
  } catch (error) {
    console.error('Error updating job progress:', error);
  }
}

// Function to get brand kit details
async function getBrandKitForJob(brandKitId: string) {
  try {
    const result = await client.query(
      'SELECT * FROM brand_kits WHERE id = $1 AND is_active = true',
      [brandKitId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching brand kit:', error);
    return null;
  }
}

// Main job processing function
async function processJob(job: any) {
  running++;
  const jobId = job.id;
  
  try {
    console.log(`ðŸš€ Processing job ${jobId}...`);
    
    const supa = createSupabaseAdminClient();
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), `export-${jobId}-`));
    const outDir = path.join(tmpRoot, 'out');
    await fs.mkdir(outDir, { recursive: true });

    // Prepare brand kit assets
    const brandKit = job.brand_kit_id ? await getBrandKitForJob(job.brand_kit_id) : null;
    console.log(`ðŸ“¦ Brand kit: ${brandKit ? brandKit.name : 'None'}`);

    // Download source video from Supabase Storage
    const sourceTmp = path.join(tmpRoot, 'source.mp4');
    console.log(`ðŸ“¥ Downloading source video: ${job.source_video_path}`);
    
    const { data: videoData, error: downloadError } = await supa.storage
      .from(job.storage_bucket || 'source-videos')
      .download(job.source_video_path);
      
    if (downloadError) {
      throw new Error(`Failed to download source video: ${downloadError.message}`);
    }
    
    await fs.writeFile(sourceTmp, Buffer.from(await videoData.arrayBuffer()));
    console.log('âœ… Source video downloaded');

    // Process formats
    const assets: Array<{ type: 'video'|'thumbnail'|'metadata', variant: string, filePath: string }> = [];
    const formats = job.formats || [];
    
    let processed = 0;
    const totalSteps = formats.length + (job.options?.generateThumbnails ? formats.length : 0) + 2; // +2 for metadata + zip

    const updateProgress = (stepInc = 1) => {
      processed += stepInc;
      const pct = Math.min(95, Math.round((processed / totalSteps) * 100));
      updateJobProgress(jobId, pct);
    };

    // Generate metadata text files
    console.log('ðŸ“ Generating metadata files...');
    const metadataDir = path.join(outDir, 'metadata');
    await fs.mkdir(metadataDir, { recursive: true });
    
    const title = job.options?.metadataOverrides?.title || `Export ${jobId}`;
    const description = job.options?.metadataOverrides?.description || '';
    const hashtags = (job.options?.metadataOverrides?.hashtags || []).map((h: string) => h.startsWith('#') ? h : `#${h}`);
    
    await fs.writeFile(path.join(metadataDir, 'title.txt'), title);
    await fs.writeFile(path.join(metadataDir, 'description.txt'), description);
    await fs.writeFile(path.join(metadataDir, 'hashtags.txt'), hashtags.join(' '));
    
    assets.push({ type: 'metadata', variant: 'title.txt', filePath: path.join(metadataDir, 'title.txt') });
    assets.push({ type: 'metadata', variant: 'description.txt', filePath: path.join(metadataDir, 'description.txt') });
    assets.push({ type: 'metadata', variant: 'hashtags.txt', filePath: path.join(metadataDir, 'hashtags.txt') });
    updateProgress();

    // Process each format
    for (const fmt of formats) {
      console.log(`ðŸŽ¬ Processing format: ${fmt.ratio} ${fmt.resolution}`);
      
      const variant = `${fmt.ratio}-${fmt.resolution}`;
      const videoOutDir = path.join(outDir, fmt.ratio.replace(':', 'x'));
      await fs.mkdir(videoOutDir, { recursive: true });
      const videoPath = path.join(videoOutDir, 'video.mp4');

      const [w, h] = fmt.resolution.split('x').map((n: string) => parseInt(n, 10));

      // Build filter chain: scale, pad, brand overlay
      const filters: string[] = [
        `scale=${w}:${h}:force_original_aspect_ratio=decrease`,
        `pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`
      ];
      
      if (brandKit?.overlay_filter) {
        filters.push(brandKit.overlay_filter);
      }

      await new Promise<void>((resolve, reject) => {
        const cmd = ffmpeg(sourceTmp)
          .videoFilters(filters)
          .outputOptions(['-movflags +faststart'])
          .size(`${w}x${h}`)
          .videoBitrate(fmt.bitrate || '6M')
          .fps(fmt.fps || 30)
          .output(videoPath);

        cmd.on('error', (err) => {
          console.error(`FFmpeg error for ${variant}:`, err);
          reject(err);
        }).on('end', () => {
          console.log(`âœ… Video processed: ${variant}`);
          resolve();
        }).run();
      });

      assets.push({ type: 'video', variant, filePath: videoPath });
      updateProgress();

      // Generate thumbnail if requested
      if (job.options?.generateThumbnails) {
        console.log(`ðŸ–¼ï¸ Generating thumbnail for ${variant}`);
        
        const thumbDir = path.join(outDir, 'thumbnails');
        await fs.mkdir(thumbDir, { recursive: true });
        const thumbPath = path.join(thumbDir, `thumb_${fmt.ratio.replace(':', 'x')}.png`);

        const time = job.options?.thumbnailTimecode || '00:00:01';
        
        await new Promise<void>((resolve, reject) => {
          const cmd = ffmpeg(videoPath);
          cmd.screenshots({
            count: 1,
            timemarks: [time],
            filename: path.basename(thumbPath),
            folder: thumbDir,
          });
          cmd.on('error', reject);
          cmd.on('end', () => resolve());
        });

        // Apply brand overlay to thumbnail if needed
        if (brandKit?.thumbnail_overlay_filter) {
          const brandedThumb = thumbPath.replace('.png', '_branded.png');
          await new Promise<void>((resolve, reject) => {
            const cmd = ffmpeg(thumbPath);
            cmd.videoFilters([brandKit.thumbnail_overlay_filter]);
            cmd.output(brandedThumb);
            cmd.on('error', reject);
            cmd.on('end', () => resolve());
            cmd.run();
          });
          await fs.rm(thumbPath);
          assets.push({ type: 'thumbnail', variant: `${fmt.ratio}-thumb`, filePath: brandedThumb });
        } else {
          assets.push({ type: 'thumbnail', variant: `${fmt.ratio}-thumb`, filePath: thumbPath });
        }

        console.log(`âœ… Thumbnail generated: ${variant}`);
        updateProgress();
      }
    }

    // Create ZIP file
    console.log('ðŸ“¦ Creating ZIP package...');
    updateJobProgress(jobId, 97, 'packaging');
    
    const zipPath = path.join(tmpRoot, 'export.zip');
    await new Promise<void>((resolve, reject) => {
      const output = require('fs').createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`âœ… ZIP created: ${archive.pointer()} bytes`);
        resolve();
      });
      
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(outDir, false);
      archive.finalize();
    });

    // Upload ZIP to Supabase Storage
    console.log('â˜ï¸ Uploading ZIP to storage...');
    updateJobProgress(jobId, 98, 'uploaded');
    
    const bucket = 'exports';
    const storageKey = `${job.user_id}/${jobId}/export.zip`;

    const zipBuf = await fs.readFile(zipPath);
    const { error: uploadError } = await supa.storage.from(bucket).upload(storageKey, zipBuf, {
      contentType: 'application/zip',
      upsert: true,
    });
    
    if (uploadError) {
      throw new Error(`Failed to upload ZIP: ${uploadError.message}`);
    }

    // Save assets to database
    console.log('ðŸ’¾ Saving assets to database...');
    for (const asset of assets) {
      const stat = await fs.stat(asset.filePath);
      const checksum = crypto.createHash('md5').update(await fs.readFile(asset.filePath)).digest('hex');
      
      await client.query(`
        INSERT INTO export_assets (job_id, type, variant, storage_path, size_bytes, checksum)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [jobId, asset.type, asset.variant, 'N/A (packed in zip)', stat.size, checksum]);
    }

    // Mark job as complete
    await client.query(`
      UPDATE export_jobs 
      SET status = 'ready', progress = 100, zip_storage_path = $1, zip_size_bytes = $2, completed_at = NOW(), updated_at = NOW()
      WHERE id = $3
    `, [storageKey, zipBuf.length, jobId]);

    console.log(`ðŸŽ‰ Job ${jobId} completed successfully!`);
    
    // Cleanup temp files
    await fs.rm(tmpRoot, { recursive: true, force: true });

  } catch (err: any) {
    console.error(`âŒ Job ${jobId} failed:`, err);
    
    await client.query(`
      UPDATE export_jobs 
      SET status = 'failed', error = $1, updated_at = NOW()
      WHERE id = $2
    `, [err.message, jobId]);
  } finally {
    running--;
  }
}

// Main worker loop
async function workerLoop() {
  if (running < MAX_CONCURRENT) {
    const job = await claimNextJob();
    if (job) {
      console.log(`ðŸ“‹ Claimed job ${job.id} for user ${job.user_id}`);
      processJob(job); // Don't await - let it run in background
    }
  }
  
  setTimeout(workerLoop, 2000); // Check every 2 seconds
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    running, 
    maxConcurrent: MAX_CONCURRENT,
    timestamp: new Date().toISOString()
  });
});

// Start worker
const PORT = process.env.WORKER_PORT || 3030;
app.listen(PORT, () => {
  console.log(`ðŸš€ Export worker running on port ${PORT}`);
  console.log(`ðŸ“Š Max concurrent jobs: ${MAX_CONCURRENT}`);
  console.log('ðŸ”„ Starting worker loop...');
  workerLoop();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('ðŸ›‘ Shutting down worker...');
  await client.end();
  process.exit(0);
});