import { getDatabase } from '@/lib/database';
import { getWaitlistEnvironment } from '@/lib/waitlist-environment';
import { createVerificationToken, hashVerificationToken, verificationExpiry } from '@/lib/waitlist-security';
import { validateTurnstile } from '@/lib/turnstile';

type WaitlistInput = {
  email?: unknown; website?: unknown; name?: unknown; interests?: unknown;
  launchAmount?: unknown; turnstileToken?: unknown;
};

function genericSuccess() {
  return Response.json({ ok: true, verificationRequired: true }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Please submit from the Pigeon website.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Invalid request.' }, { status: 415 });

  try {
    const body = await request.text();
    if (body.length > 6144) return Response.json({ error: 'Request too large.' }, { status: 413 });
    let input: WaitlistInput;
    try { input = JSON.parse(body) as WaitlistInput; } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
    if (!input || typeof input !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400 });
    if (input.website) return genericSuccess();

    const turnstileToken = typeof input.turnstileToken === 'string' ? input.turnstileToken : '';
    const turnstile = await validateTurnstile(request, turnstileToken, 'waitlist_signup');
    if (!turnstile.ok) return Response.json({ error: turnstile.message }, { status: turnstile.status });

    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
    const name = typeof input.name === 'string' ? input.name.trim().replace(/\s+/g, ' ') : '';
    const allowed = ['sports', 'politics', 'entertainment', 'tech', 'business'];
    const interests = Array.isArray(input.interests) ? [...new Set(input.interests)] : [];
    if (!name || name.length > 100) return Response.json({ error: 'Please enter your name (up to 100 characters).' }, { status: 400 });
    if (interests.length < 2 || interests.length > 5 || interests.some((topic) => typeof topic !== 'string' || !allowed.includes(topic))) return Response.json({ error: 'Choose at least two prediction interests.' }, { status: 400 });
    const amount = typeof input.launchAmount === 'string' ? input.launchAmount.trim() : '';
    if (amount && (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) > 1_000_000_000)) return Response.json({ error: 'Please enter a valid amount in naira.' }, { status: 400 });

    const db = getDatabase();
    const now = new Date();
    const nowIso = now.toISOString();
    const token = createVerificationToken();
    const tokenHash = await hashVerificationToken(token);
    const jobId = crypto.randomUUID();
    const [insertResult] = await db.batch([
      db.prepare(`INSERT INTO waitlist (
        email, created_at, name, interests, launch_amount, verification_token_hash,
        verification_expires_at, reward_reserved, email_status, email_updated_at, verification_email_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending_verification', ?, 'queued')
      ON CONFLICT(email) DO NOTHING`).bind(email, nowIso, name, JSON.stringify(interests), amount || null, tokenHash, verificationExpiry(now), nowIso),
      db.prepare(`INSERT INTO waitlist_email_jobs (
        id, email, kind, status, payload, attempts, next_attempt_at, created_at, updated_at
      ) SELECT ?, email, 'verification', 'pending', ?, 0, ?, ?, ?
      FROM waitlist WHERE email = ? AND verification_token_hash = ?
      ON CONFLICT(email, kind) DO NOTHING`).bind(jobId, JSON.stringify({ token }), nowIso, nowIso, nowIso, email, tokenHash),
    ]);

    if (insertResult.meta.changes > 0) {
      const environment = getWaitlistEnvironment();
      try { await environment.WAITLIST_EMAIL_QUEUE?.send({ jobId }); }
      catch (error) { console.error('Verification email queueing failed; scheduled sweep will retry', error); }

      if (environment.WAITLIST_NOTIFY_EMAIL && environment.WAITLIST_NOTIFY_TO && environment.WAITLIST_NOTIFY_FROM) {
        const details = [
          'New Pigeon Arena waitlist submission (email verification pending)', '',
          `Name: ${name}`, `Email: ${email}`, `Interests: ${interests.join(', ')}`,
          `Estimated launch-day amount: ${amount ? `NGN ${amount}` : 'Not provided'}`,
          `Submitted: ${nowIso}`,
        ].join('\n');
        try {
          await environment.WAITLIST_NOTIFY_EMAIL.send({
            to: environment.WAITLIST_NOTIFY_TO, from: environment.WAITLIST_NOTIFY_FROM,
            replyTo: email, subject: `New Pigeon waitlist signup: ${name.replace(/[\r\n]+/g, ' ')}`, text: details,
          });
        } catch (error) { console.error('Waitlist notification email failed', error); }
      }
    }
    return genericSuccess();
  } catch (error) {
    console.error('Waitlist submission failed', error);
    return Response.json({ error: 'We couldn’t save your email. Please try again shortly.' }, { status: 503 });
  }
}
