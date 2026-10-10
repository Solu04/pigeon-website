import { getDatabase } from '@/lib/database';
import { getWaitlistEnvironment } from '@/lib/waitlist-environment';
import { hashVerificationToken } from '@/lib/waitlist-security';

type VerifiedRow = { email: string; reward_reserved: number; reward_position: number | null };

function confirmationRedirect(request: Request, result: 'reward' | 'standard' | 'invalid') {
  const url = new URL('/waitlist/confirmed', request.url);
  url.searchParams.set('result', result);
  return Response.redirect(url, 303);
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!token || token.length > 256) return confirmationRedirect(request, 'invalid');

  const db = getDatabase();
  const tokenHash = await hashVerificationToken(token);
  const now = new Date().toISOString();
  const jobId = crypto.randomUUID();
  try {
    const [verification] = await db.batch([
      db.prepare(`WITH next_reward AS (
        SELECT CASE
          WHEN (SELECT COUNT(*) FROM waitlist WHERE reward_reserved = 1) < 50
          THEN (SELECT COALESCE(MAX(reward_position), 0) + 1 FROM waitlist WHERE reward_reserved = 1)
          ELSE NULL
        END AS position
      )
      UPDATE waitlist SET
        email_verified_at = ?,
        reward_position = (SELECT position FROM next_reward),
        reward_reserved = CASE WHEN (SELECT position FROM next_reward) IS NULL THEN 0 ELSE 1 END,
        email_status = 'queued',
        email_updated_at = ?
      WHERE verification_token_hash = ?
        AND email_verified_at IS NULL
        AND verification_expires_at > ?
      RETURNING email, reward_reserved, reward_position`).bind(now, now, tokenHash, now),
      db.prepare(`INSERT INTO waitlist_email_jobs (
        id, email, kind, status, payload, attempts, next_attempt_at, created_at, updated_at
      ) SELECT ?, email, 'welcome', 'pending', NULL, 0, ?, ?, ?
      FROM waitlist
      WHERE verification_token_hash = ? AND email_verified_at = ?
      ON CONFLICT(email, kind) DO NOTHING`).bind(jobId, now, now, now, tokenHash, now),
    ]);
    const verified = (verification.results?.[0] ?? null) as VerifiedRow | null;
    if (!verified) return confirmationRedirect(request, 'invalid');

    try { await getWaitlistEnvironment().WAITLIST_EMAIL_QUEUE?.send({ jobId }); }
    catch (error) { console.error('Welcome email queueing failed; scheduled sweep will retry', error); }
    return confirmationRedirect(request, verified.reward_reserved === 1 ? 'reward' : 'standard');
  } catch (error) {
    console.error('Waitlist verification failed', error);
    return confirmationRedirect(request, 'invalid');
  }
}
