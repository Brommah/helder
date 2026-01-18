# 🏠 Woningpaspoort

Digital housing passport - comprehensive property documentation platform.

## Overview

Woningpaspoort is a web application that allows homeowners to:
- Document property information and specifications
- Store and organize important documents (deeds, permits, energy labels)
- Track maintenance history and schedules
- Share property information securely with others

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js
- **API:** tRPC

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/woningpaspoort.git
cd woningpaspoort

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database URL and secrets
nano .env

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint

# Database studio
npm run db:studio
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utilities and helpers
├── server/           # API routes and tRPC
└── types/            # TypeScript types

prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Seed data

docs/
└── PRDs/             # Product requirements
```

## CI/CD

This project uses GitHub Actions for:
- **CI Pipeline:** Lint, typecheck, test, build
- **Claude Code Review:** Automated AI code review on PRs

Set up CI by running:
```bash
./scripts/setup-claude-ci.sh
```

## Environment Variables

See `.env.example` for required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - App URL
- `NEXTAUTH_SECRET` - Auth encryption key

## License

Private - All rights reserved.

---

Built with ❤️ in the Netherlands
