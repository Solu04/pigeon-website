import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const databaseId = process.env.PIGEON_D1_DATABASE_ID?.trim() || '14c3cb75-e137-4772-8d31-e5b618ff36a6';
const databaseName = process.env.PIGEON_D1_DATABASE_NAME?.trim() || 'pigeon-waitlist';
const workerName = process.env.PIGEON_WORKER_NAME?.trim() || 'pigeon-arena';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://pigeon-arena.hamza-logs.workers.dev';

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
await writeFile(path.resolve('dist/server/wrangler.external.json'), JSON.stringify(config, null, 2) + '\n');
console.log('Prepared dist/server/wrangler.external.json');
