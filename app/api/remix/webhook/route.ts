import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { remixJobs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-auth');
    if (token !== process.env.REMIX_SERVICE_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    // body: { jobId, status, step, transcriptUrl?, rewrittenScript?, outputVideoUrl?, outputThumbnailUrl?, tokensUsed?, ttsSeconds?, costEstimateCents?, error? }
    const { jobId, ...rest } = body;
    
    await db.update(remixJobs).set({
      status: rest.status,
      step: rest.step,
      transcriptUrl: rest.transcriptUrl ?? null,
      rewrittenScript: rest.rewrittenScript ?? null,
      outputVideoUrl: rest.outputVideoUrl ?? null,
      outputThumbnailUrl: rest.outputThumbnailUrl ?? null,
      tokensUsed: rest.tokensUsed ?? undefined,
      ttsSeconds: rest.ttsSeconds ?? undefined,
      costEstimateCents: rest.costEstimateCents ?? undefined,
      error: rest.error ?? null,
      updatedAt: new Date(),
      startedAt: rest.step === 'init' ? new Date() : undefined,
      completedAt: rest.status === 'completed' ? new Date() : undefined,
    }).where(eq(remixJobs.id, jobId));
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Remix webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
