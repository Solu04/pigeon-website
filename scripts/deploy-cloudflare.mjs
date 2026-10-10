import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const databaseName = process.env.PIGEON_D1_DATABASE_NAME?.trim() || 'pigeon-waitlist';
const wranglerCli = path.resolve('node_modules/wrangler/bin/wrangler.js');
const config = 'dist/server/wrangler.external.json';

function run(args) {
  const result = spawnSync(process.execPath, [wranglerCli, ...args], { stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(['d1', 'migrations', 'apply', databaseName, '--remote', '--config', config]);
run(['deploy', '--config', config]);
