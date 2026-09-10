# External deployment guide

This project targets Cloudflare Workers because its waitlist API stores submissions in Cloudflare D1. The website design and behavior are unchanged in this external build.

## 1. Install and authenticate

Install Node.js 22.13 or newer, then run:

```bash
npm ci
npx wrangler login
```

For automated deployment, use Cloudflare's documented CI authentication instead of `wrangler login`.

## 2. Create the waitlist database

```bash
npx wrangler d1 create pigeon-waitlist
```

Cloudflare returns a database ID. Copy `.env.production.example` to `.env.production` and enter:

- `NEXT_PUBLIC_SITE_URL`: the final HTTPS origin, such as `https://pigeon.example.com`
- `PIGEON_WORKER_NAME`: the Cloudflare Worker name
- `PIGEON_D1_DATABASE_NAME`: the D1 database name
- `PIGEON_D1_DATABASE_ID`: the database ID returned by Cloudflare

Do not commit `.env.production`; it is ignored by Git.

## 3. Load the environment and deploy

The variables must be present in the shell that runs the build. On macOS or Linux:

```bash
set -a
. ./.env.production
set +a
npm run deploy:external
```

On PowerShell:

```powershell
Get-Content .env.production | ForEach-Object {
  if ($_ -match '^(?<name>[^#=]+)=(?<value>.*)$') {
    Set-Item -Path "Env:$($Matches.name)" -Value $Matches.value
  }
}
npm run deploy:external
```

The deployment command performs a fresh production build, generates an external Wrangler configuration, applies the versioned D1 migrations, and deploys the Worker and static assets.

## 4. Attach the custom domain

In Cloudflare, open **Workers & Pages → your Worker → Settings → Domains & Routes**, add the custom domain, and confirm that `NEXT_PUBLIC_SITE_URL` matches it. Rebuild and redeploy if the domain changes so canonical Open Graph image URLs use the correct origin.

## CI variables

Configure these in the deployment platform rather than committing them:

- `NEXT_PUBLIC_SITE_URL`
- `PIGEON_WORKER_NAME`
- `PIGEON_D1_DATABASE_NAME`
- `PIGEON_D1_DATABASE_ID`
- Cloudflare authentication variables required by Wrangler

Use `npm ci`, `npm run typecheck`, and `npm run build:external` as the CI validation commands. Run `node scripts/deploy-cloudflare.mjs` only from an authorized deployment job.
