import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { remixJobs } from '@/db/schema/trending-remix';
import { eq } from 'drizzle-orm';

/**
 * Webhook endpoint for remix worker to update job status
 * 
 * POST /api/remix/webhook
 * 
 * Body: {
 *   jobId: string,
 *   status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled',
 *   step: 'init' | 'fetch_transcript' | 'rewrite_script' | 'tts' | 'assemble' | 'upload' | 'done',
 *   transcriptUrl?: string,
 *   rewrittenScript?: string,
 *   outputVideoUrl?: string,
 *   outputThumbnailUrl?: string,
 *   tokensUsed?: number,
 *   ttsSeconds?: number,
 *   costEstimateCents?: number,
 *   error?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify webhook authentication
    const token = req.headers.get('x-auth');
    if (token !== process.env.REMIX_SERVICE_TOKEN) {
      console.error('[REMIX_WEBHOOK] Unauthorized request - invalid token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, ...rest } = body;

    if (!jobId) {
      console.error('[REMIX_WEBHOOK] Missing jobId in request');
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    console.log(`[REMIX_WEBHOOK] Updating job ${jobId}:`, {
      status: rest.status,
      step: rest.step,
      hasError: !!rest.error,
    });

    // Update job in database
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (rest.status) updateData.status = rest.status;
    if (rest.step) updateData.step = rest.step;
    if (rest.transcriptUrl !== undefined) updateData.transcriptUrl = rest.transcriptUrl;
    if (rest.rewrittenScript !== undefined) updateData.rewrittenScript = rest.rewrittenScript;
    if (rest.outputVideoUrl !== undefined) updateData.outputVideoUrl = rest.outputVideoUrl;
    if (rest.outputThumbnailUrl !== undefined) updateData.outputThumbnailUrl = rest.outputThumbnailUrl;
    if (rest.tokensUsed !== undefined) updateData.tokensUsed = rest.tokensUsed;
    if (rest.ttsSeconds !== undefined) updateData.ttsSeconds = rest.ttsSeconds;
    if (rest.costEstimateCents !== undefined) updateData.costEstimateCents = rest.costEstimateCents;
    if (rest.error !== undefined) updateData.error = rest.error;

    // Set timestamps based on status
    if (rest.step === 'init' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }
    if (rest.status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    await db.update(remixJobs)
      .set(updateData)
      .where(eq(remixJobs.id, jobId));

    console.log(`[REMIX_WEBHOOK] Successfully updated job ${jobId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[REMIX_WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
