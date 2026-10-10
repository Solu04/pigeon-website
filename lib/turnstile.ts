import { getWaitlistEnvironment } from '@/lib/waitlist-environment';

type TurnstileResponse = { success?: boolean; hostname?: string; action?: string; 'error-codes'?: string[] };
const TEST_SECRET = '1x0000000000000000000000000000000AA';

export async function validateTurnstile(request: Request, token: string, expectedAction: string) {
  if (!token || token.length > 2048) return { ok: false as const, status: 403, message: 'Please complete the security check.' };
  const environment = getWaitlistEnvironment();
  const requestHost = new URL(request.url).hostname;
  const local = requestHost === 'localhost' || requestHost === '127.0.0.1';
  const secret = environment.TURNSTILE_SECRET_KEY || (local ? TEST_SECRET : '');
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return { ok: false as const, status: 503, message: 'Security check unavailable. Please try again shortly.' };
  }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: request.headers.get('CF-Connecting-IP') ?? '', idempotency_key: crypto.randomUUID() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Siteverify returned ${response.status}`);
    const result = await response.json() as TurnstileResponse;
    const allowedHostnames = new Set((environment.TURNSTILE_HOSTNAMES || 'pigeonarena.com,www.pigeonarena.com').split(',').map((hostname) => hostname.trim().toLowerCase()).filter(Boolean));
    const actionMatches = local || result.action === expectedAction;
    const hostnameMatches = local || (!!result.hostname && allowedHostnames.has(result.hostname.toLowerCase()));
    if (!result.success || !actionMatches || !hostnameMatches) {
      console.warn('Turnstile validation rejected', result['error-codes'] ?? []);
      return { ok: false as const, status: 403, message: 'Security check expired. Please try again.' };
    }
    return { ok: true as const };
  } catch (error) {
    console.error('Turnstile validation failed', error);
    return { ok: false as const, status: 503, message: 'Security check unavailable. Please try again shortly.' };
  }
}
