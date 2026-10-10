import { getDatabase } from '@/lib/database';
import { verificationEmail, welcomeEmail } from '@/lib/waitlist-email';
import { getWaitlistEnvironment } from '@/lib/waitlist-environment';

type Job = { id: string; email: string; kind: 'verification' | 'welcome'; payload: string | null; attempts: number };
type Signup = { name: string | null; reward_reserved: number };

function authorized(request: Request, expected?: string) {
  const actual = request.headers.get('x-pigeon-job-secret') ?? '';
  if (!expected || actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  return difference === 0;
}

function errorMessage(error: unknown) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}

export async function POST(request: Request) {
  const environment = getWaitlistEnvironment();
  if (!authorized(request, environment.WAITLIST_JOB_SECRET)) return new Response('Forbidden', { status: 403 });
  const input = await request.json().catch(() => null) as { jobId?: unknown } | null;
  const jobId = typeof input?.jobId === 'string' ? input.jobId : '';
  if (!jobId) return Response.json({ error: 'Missing job ID.' }, { status: 400 });

  const db = getDatabase();
  const now = new Date();
  const nowIso = now.toISOString();
  const job = await db.prepare(`UPDATE waitlist_email_jobs
    SET status = 'processing', attempts = attempts + 1, updated_at = ?
    WHERE id = ? AND status IN ('pending', 'retry') AND next_attempt_at <= ?
    RETURNING id, email, kind, payload, attempts`).bind(nowIso, jobId, nowIso).first<Job>();
  if (!job) return Response.json({ ok: true, skipped: true });

  const signup = await db.prepare('SELECT name, reward_reserved FROM waitlist WHERE email = ?').bind(job.email).first<Signup>();
  if (!signup) {
    await db.prepare("UPDATE waitlist_email_jobs SET status = 'failed', last_error = 'Signup record missing', updated_at = ? WHERE id = ?").bind(nowIso, job.id).run();
    return Response.json({ ok: true, failed: true });
  }

  let sentResult: { messageId?: string };
  try {
    if (!environment.WAITLIST_OUTBOUND_EMAIL || !environment.WAITLIST_EMAIL_FROM) throw new Error('Outbound email binding is unavailable');
    let message;
    if (job.kind === 'verification') {
      const payload = JSON.parse(job.payload ?? '{}') as { token?: unknown };
      if (typeof payload.token !== 'string' || !payload.token) throw new Error('Verification token missing');
      const verifyUrl = new URL('/api/waitlist/verify', request.url);
      verifyUrl.searchParams.set('token', payload.token);
      message = verificationEmail({ name: signup.name, verifyUrl: verifyUrl.toString() });
    } else {
      message = welcomeEmail({ name: signup.name, rewardReserved: signup.reward_reserved === 1 });
    }

    sentResult = await environment.WAITLIST_OUTBOUND_EMAIL.send({
      to: job.email,
      from: environment.WAITLIST_EMAIL_FROM,
      replyTo: environment.WAITLIST_NOTIFY_TO,
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: { 'X-Pigeon-Job-ID': job.id },
    });
  } catch (error) {
    const failed = job.attempts >= 5;
    const nextAttempt = new Date(now.getTime() + Math.min(3600, 60 * 2 ** Math.max(0, job.attempts - 1)) * 1000).toISOString();
    const message = errorMessage(error);
    await db.batch([
      db.prepare(`UPDATE waitlist_email_jobs SET status = ?, next_attempt_at = ?, last_error = ?, updated_at = ?
        WHERE id = ? AND status = 'processing'`).bind(failed ? 'failed' : 'retry', nextAttempt, message, nowIso, job.id),
      job.kind === 'verification'
        ? db.prepare('UPDATE waitlist SET verification_email_status = ? WHERE email = ?').bind(failed ? 'failed' : 'retry', job.email)
        : db.prepare(`UPDATE waitlist SET email_status = ?, email_attempts = ?, email_last_error = ?, email_updated_at = ? WHERE email = ?`)
            .bind(failed ? 'failed' : 'retry', job.attempts, message, nowIso, job.email),
    ]);
    console.error(`Waitlist ${job.kind} email failed`, error);
    return Response.json({ ok: true, retryScheduled: !failed, failed });
  }

  const sentAt = new Date().toISOString();
  try {
    await db.batch([
      db.prepare(`UPDATE waitlist_email_jobs SET status = 'sent', payload = NULL, message_id = ?,
        last_error = NULL, sent_at = ?, updated_at = ? WHERE id = ? AND status = 'processing'`)
        .bind(sentResult.messageId ?? null, sentAt, sentAt, job.id),
      job.kind === 'verification'
        ? db.prepare("UPDATE waitlist SET verification_email_status = 'sent', verification_email_sent_at = ? WHERE email = ?").bind(sentAt, job.email)
        : db.prepare(`UPDATE waitlist SET email_status = 'sent', email_sent_at = ?, email_message_id = ?,
            email_attempts = ?, email_last_error = NULL, email_updated_at = ? WHERE email = ?`)
            .bind(sentAt, sentResult.messageId ?? null, job.attempts, sentAt, job.email),
    ]);
    return Response.json({ ok: true, sent: true });
  } catch (error) {
    // The provider accepted the email, but the sent-state update did not persist. Keeping the
    // job in `processing` avoids an automatic resend and therefore a duplicate welcome email.
    console.error(`Waitlist ${job.kind} email sent but status persistence failed; manual review required`, error);
    return Response.json({ ok: true, sent: true, statusPersistenceFailed: true });
  }
}
