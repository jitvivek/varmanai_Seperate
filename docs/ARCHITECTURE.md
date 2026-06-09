# VarmanAI Architecture

## Overview

VarmanAI is a real-time AI prompt security platform that intercepts, analyzes, and blocks malicious prompts before they reach LLMs. The system is designed as a monorepo with three main applications.

## System Components

```
┌──────────────────────────────────────────────────────────────────┐
│                     Browser Extension (MV3)                       │
│  ┌───────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Content   │  │ Background │  │    Popup     │  │ Options  │ │
│  │  Scripts   │  │  Service   │  │    (React)   │  │ (React)  │ │
│  │ intercept  │──│  Worker    │  └──────────────┘  └──────────┘ │
│  └───────────┘  └─────┬──────┘                                   │
└────────────────────────┼─────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼─────────────────────────────────────────┐
│                      Backend API (Express)                         │
│  ┌──────────┐  ┌────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Routes   │  │ Middleware │  │  Services    │  │  Prisma   │ │
│  │ /detect   │  │ clerk auth │  │  detection   │  │  ORM      │ │
│  │ /usage    │  │ rate limit │  │  usage       │  └─────┬─────┘ │
│  │ /billing  │  │ usage cap  │  │  subscription│        │       │
│  └──────────┘  └────────────┘  └──────────────┘        │       │
└──────────────────────────────────────────────────┬──────┼───────┘
                                                   │      │
                                          ┌────────▼┐  ┌──▼──────┐
                                          │  Redis  │  │PostgreSQL│
                                          │ (usage) │  │ (data)  │
                                          └─────────┘  └─────────┘
```

## Detection Pipeline

1. **Preprocessing** — Unicode normalization, leetspeak decode, encoding detection, transliteration
2. **PII Scanning** — Detects Aadhaar, PAN, phone numbers, emails before they leave the browser
3. **Entropy Analysis** — Detects encoded/obfuscated payloads via Shannon entropy
4. **Rule Engine** — Pattern matching against 30+ rules covering injections, bias, harmful content
5. **Score Fusion** — Weighted combination of all signals → final risk score (0-1)

## Key Design Decisions

- **Isomorphic Core**: The detection engine (`packages/core`) runs in both Node.js and browser with zero platform-specific dependencies
- **Privacy First**: Text is never stored. SHA-256 hashes are used for deduplication only.
- **Atomic Usage Tracking**: Redis INCR ensures accurate rate limiting under concurrency
- **Shadow DOM Overlays**: Extension UI is isolated from host page styles

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| Website | Next.js 15, React 19, Tailwind CSS |
| Extension | Vite 6, @crxjs/vite-plugin, React 19 |
| Backend | Express 4.21, Prisma 6.1, ioredis |
| Auth | Clerk |
| Payments | Razorpay (INR) |
| Database | PostgreSQL 16, Redis 7 |

## Directory Structure

```
varmanai/
├── apps/
│   ├── website/      # Next.js marketing + dashboard
│   ├── extension/    # Chrome/Safari extension
│   └── backend/      # Express API
├── packages/
│   └── core/         # Shared detection engine
├── docker-compose.yml
└── turbo.json
```
