import { env } from 'cloudflare:workers';
export function getDatabase(): D1Database {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error('Waitlist database unavailable');
  return db;
}
