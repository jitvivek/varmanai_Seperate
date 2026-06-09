# VarmanAI — Armor for your AI

> Cybersecurity SaaS that protects users from harmful AI interactions. Scans messages sent to ChatGPT, Gemini, Claude, Copilot, and Perplexity — blocking prompt injection, harmful content, and personal-data leakage with special strength in Indian languages.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start infrastructure (Postgres + Redis)
docker compose up -d

# 3. Push database schema
pnpm db:push

# 4. Copy environment variables
cp .env.example .env
# Edit .env with your Clerk, Razorpay keys

# 5. Start all services in dev mode
pnpm dev
```

## Architecture

```
varmanai/
├── packages/core     — Shared detection engine (isomorphic)
├── apps/backend      — Express API (auth, billing, detection)
├── apps/website      — Next.js marketing + dashboard
└── apps/extension    — Browser extension (Manifest V3)
```

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Backend:** Node.js 20, Express, Prisma, Redis, Zod
- **Website:** Next.js 15 (App Router), React 19, Tailwind CSS
- **Extension:** Manifest V3, Vite, React, @crxjs/vite-plugin
- **Auth:** Clerk
- **Payments:** Razorpay (INR)
- **Database:** PostgreSQL 16 + Redis 7

## Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm db:push` | Push Prisma schema to DB |

## License

Proprietary — All rights reserved.
