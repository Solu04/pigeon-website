import { getWaitlistEnvironment } from '@/lib/waitlist-environment';

const TEST_SITE_KEY = '1x00000000000000000000AA';

export async function GET(request: Request) {
  const hostname = new URL(request.url).hostname;
  const local = hostname === 'localhost' || hostname === '127.0.0.1';
  const siteKey = getWaitlistEnvironment().TURNSTILE_SITE_KEY || (local ? TEST_SITE_KEY : '');
  if (!siteKey) return Response.json({ error: 'Security check unavailable.' }, { status: 503 });
  return Response.json({ siteKey }, { headers: { 'Cache-Control': 'no-store' } });
}
