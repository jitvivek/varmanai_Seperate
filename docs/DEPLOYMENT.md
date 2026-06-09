# VarmanAI Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+
- pnpm 9+
- PostgreSQL 16
- Redis 7

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/varmanai
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

## Local Development

```bash
# Install dependencies
pnpm install

# Start databases
docker compose up -d postgres redis

# Run migrations
pnpm --filter backend exec prisma migrate dev

# Start all apps in dev mode
pnpm dev
```

## Production Deployment

### Docker Compose

```bash
docker compose -f docker-compose.yml up -d
```

### Individual Services

#### Backend API
```bash
cd apps/backend
pnpm build
node dist/index.js
```

#### Website
```bash
cd apps/website
pnpm build
pnpm start
```

### Extension

1. Build: `cd apps/extension && pnpm build`
2. Output in `dist/` — upload to Chrome Web Store

## Health Check

```
GET /health → { "status": "ok", "version": "1.0.0" }
```

## Scaling Notes

- Backend is stateless — scale horizontally behind a load balancer
- Redis handles usage counters with atomic INCR (no race conditions)
- PostgreSQL handles subscription/user data
- Use connection pooling (PgBouncer) for >100 concurrent connections
