import { getDatabase } from '@/lib/database';
import { getWaitlistEnvironment } from '@/lib/waitlist-environment';

type DueJob = { id: string };

export async function POST(request: Request) {
  const environment = getWaitlistEnvironment();
  if (!environment.WAITLIST_JOB_SECRET || request.headers.get('x-pigeon-job-secret') !== environment.WAITLIST_JOB_SECRET) return new Response('Forbidden', { status: 403 });
  if (!environment.WAITLIST_EMAIL_QUEUE) return Response.json({ error: 'Queue unavailable.' }, { status: 503 });
  const jobs = await getDatabase().prepare(`SELECT id FROM waitlist_email_jobs
    WHERE status IN ('pending', 'retry') AND next_attempt_at <= ? ORDER BY created_at LIMIT 50`)
    .bind(new Date().toISOString()).all<DueJob>();
  await Promise.all(jobs.results.map((job) => environment.WAITLIST_EMAIL_QUEUE!.send({ jobId: job.id })));
  return Response.json({ ok: true, queued: jobs.results.length });
}
