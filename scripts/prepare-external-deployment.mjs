import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const databaseId = process.env.PIGEON_D1_DATABASE_ID?.trim() || '14c3cb75-e137-4772-8d31-e5b618ff36a6';
const databaseName = process.env.PIGEON_D1_DATABASE_NAME?.trim() || 'pigeon-waitlist';
const workerName = process.env.PIGEON_WORKER_NAME?.trim() || 'pigeon-arena';
const customDomain = process.env.PIGEON_CUSTOM_DOMAIN?.trim() || 'pigeonarena.com';
const siteUrl = process.env.PIGEON_SITE_URL?.trim() || `https://${customDomain}`;
const notificationEmail = process.env.PIGEON_WAITLIST_NOTIFY_TO?.trim() || 'hello@pigeonarena.com';
const senderEmail = process.env.PIGEON_WAITLIST_EMAIL_FROM?.trim() || `hello@${customDomain}`;
const turnstileSiteKey = process.env.PIGEON_TURNSTILE_SITE_KEY?.trim() || '0x4AAAAAAFTYedrfVeRjHgEB';
const emailQueue = process.env.PIGEON_WAITLIST_EMAIL_QUEUE?.trim() || 'pigeon-waitlist-email';

if (!databaseId || databaseId === 'replace-with-your-cloudflare-d1-database-id') {
  throw new Error('PIGEON_D1_DATABASE_ID must contain your Cloudflare D1 database ID.');
}
if (!siteUrl || !/^https:\/\/[^/]+(?:\/.*)?$/.test(siteUrl)) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS URL such as https://example.com.');
}

const configPath = path.resolve('dist/server/wrangler.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
config.name = workerName;
config.d1_databases = [{
  binding: 'DB',
  database_name: databaseName,
  database_id: databaseId,
  migrations_dir: '../../drizzle',
}];
config.routes = [{ pattern: customDomain, custom_domain: true }];
config.main = 'pigeon-worker.mjs';
config.send_email = [
  { name: 'WAITLIST_NOTIFY_EMAIL', destination_address: notificationEmail },
  { name: 'WAITLIST_OUTBOUND_EMAIL', allowed_sender_addresses: [senderEmail] },
];
config.queues = {
  producers: [{ binding: 'WAITLIST_EMAIL_QUEUE', queue: emailQueue }],
  consumers: [{ queue: emailQueue, max_batch_size: 10, max_batch_timeout: 5, max_retries: 5 }],
};
config.triggers = { crons: ['*/5 * * * *'] };
config.vars = {
  ...config.vars,
  WAITLIST_NOTIFY_TO: notificationEmail,
  WAITLIST_NOTIFY_FROM: `waitlist@${customDomain}`,
  WAITLIST_EMAIL_FROM: senderEmail,
  TURNSTILE_SITE_KEY: turnstileSiteKey,
  TURNSTILE_HOSTNAMES: `${customDomain},www.${customDomain}`,
  PIGEON_SITE_URL: siteUrl,
};
await copyFile(path.resolve('workers/pigeon-worker.mjs'), path.resolve('dist/server/pigeon-worker.mjs'));
await writeFile(path.resolve('dist/server/wrangler.external.json'), JSON.stringify(config, null, 2) + '\n');
console.log('Prepared dist/server/wrangler.external.json');
