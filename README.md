# Pigeon Arena website

Production source for the Pigeon Arena marketing website, About page, Operations page, and D1-backed early-access waitlist.

## Requirements

- Node.js 22.13 or newer
- npm
- A Cloudflare account for production deployment
- A Cloudflare D1 database for waitlist submissions

## Local development

```bash
npm ci
npm run dev
```

The local site opens at `http://localhost:3000`. The included development configuration supplies a local D1 binding.

## Production build

```bash
npm ci
npm run typecheck
npm run build
```

The Cloudflare Worker is emitted to `dist/server` and public files to `dist/client`.

## External deployment

See [EXTERNAL-DEPLOYMENT.md](./EXTERNAL-DEPLOYMENT.md) for the complete Cloudflare setup, migration, deployment, and custom-domain instructions.
