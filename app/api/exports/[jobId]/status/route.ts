import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { exportJobs } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(req: NextRequest, ctx: { params: { jobId: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [job] = await db.select().from(exportJobs)
    .where(and(eq(exportJobs.id, ctx.params.jobId as any), eq(exportJobs.userId, userId)));

  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ 
    status: job.status, 
    progress: job.progress, 
    error: job.error ?? null 
  });
}