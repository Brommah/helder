# CLAUDE.md - Woningpaspoort

## Project Overview
| | |
|---|---|
| **Project** | Woningpaspoort (Housing Passport) |
| **Owner** | Martijn Broersma |
| **Type** | Product Development |
| **Status** | 🟡 In Development |

### Description
Digital housing passport system — a comprehensive platform for documenting, tracking, and sharing property information, certifications, and history.

---

## Context Inheritance
Extends `~/.claude/CLAUDE.md`. Personal context, communication preferences, and skills apply.

**Project-specific overrides:**
- More technical detail welcome (this is a product build)
- Use Dutch terminology where appropriate for UI/UX discussions
- Focus on MVP features first

---

## Product Context

### What We're Building
A digital "paspoort" for residential properties that includes:
- Property specifications and floor plans
- Energy labels and sustainability certifications
- Maintenance history and schedules
- Ownership and transaction history
- Connected IoT/smart home data (future)

### Target Users
1. **Homeowners** — Track their property, plan maintenance
2. **Real estate agents** — Standardized property information
3. **Municipalities** — Compliance and sustainability tracking
4. **Buyers** — Due diligence before purchase

### Key Differentiators
- Single source of truth for property data
- Integration with government databases (Kadaster, RVO)
- Privacy-first: owner controls what's shared
- Mobile-first experience

---

## Technical Stack (Proposed)

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js 14+ / React | TypeScript, App Router |
| Styling | Tailwind CSS | Mobile-first |
| Backend | Node.js / tRPC | Type-safe API |
| Database | PostgreSQL | Prisma ORM |
| Auth | NextAuth.js | DigiD integration (future) |
| Hosting | Vercel | Easy deployment |
| Storage | S3/Cloudflare R2 | Documents, images |

---

## Project Structure
```
woningpaspoort/
├── CLAUDE.md                    ← You are here
├── .github/workflows/           ← CI automation
├── src/
│   ├── app/                     ← Next.js app router
│   ├── components/              ← React components
│   ├── lib/                     ← Utilities, helpers
│   ├── server/                  ← API routes, tRPC
│   └── types/                   ← TypeScript types
├── tests/                       ← Test files
├── docs/                        ← Documentation
│   └── PRDs/                    ← Product requirements
├── prisma/                      ← Database schema
├── public/                      ← Static assets
└── scripts/                     ← Utility scripts
```

---

## Development Standards

### Code Style
- **TypeScript:** Strict mode, no `any`
- **React:** Functional components, hooks only
- **Naming:** 
  - Components: PascalCase (`PropertyCard.tsx`)
  - Utilities: camelCase (`formatAddress.ts`)
  - Types: PascalCase with `T` or `I` prefix optional
- **Commits:** `feat|fix|chore|docs: <50 chars>`

### Dutch vs English
- **Code:** English (variables, functions, comments)
- **UI text:** Dutch (user-facing strings)
- **Documentation:** English (technical), Dutch (user docs)

### Testing
- **Unit:** Vitest for utilities and hooks
- **Component:** React Testing Library
- **E2E:** Playwright (future)
- **Coverage target:** 80% for critical paths

### Commands
```bash
# Development
npm install
npm run dev              # Start dev server (localhost:3000)

# Quality
npm run lint             # ESLint
npm run lint:fix         # Auto-fix
npm run typecheck        # TypeScript check
npm test                 # Run tests
npm run test:coverage    # With coverage

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio

# Build
npm run build            # Production build
npm run start            # Start production server
```

---

## Tool Permissions

### Allowed
- ✅ Read/write any file in project
- ✅ Run npm/pnpm commands
- ✅ Run Prisma commands
- ✅ Git read operations
- ✅ Create components and pages

### Ask First
- ⚠️ Database schema changes (migrations)
- ⚠️ Installing new dependencies
- ⚠️ Modifying authentication logic
- ⚠️ Changes to CI/CD

### Never
- ❌ Modify files outside project
- ❌ Hardcode API keys or secrets
- ❌ Delete database migrations
- ❌ Push directly to main

---

## MCP Configuration

| MCP | Status | Use Case |
|-----|--------|----------|
| GitHub | ✅ Enable | Issues, PRs |
| Notion | ✅ Enable | PRDs, documentation |
| Lemlist | ❌ Disable | Not relevant |
| Google Drive | ⚠️ As needed | Shared specs |

---

## Feature Roadmap

### MVP (Phase 1)
- [ ] User authentication (email/password)
- [ ] Property creation and basic info
- [ ] Document upload (PDF, images)
- [ ] Property dashboard view
- [ ] Share property with link

### Phase 2
- [ ] Energy label integration
- [ ] Maintenance scheduling
- [ ] Multi-property support
- [ ] Mobile app (React Native)

### Phase 3
- [ ] DigiD authentication
- [ ] Kadaster integration
- [ ] IoT device connections
- [ ] Marketplace features

---

## Key Decisions (ADRs)

| Decision | Reasoning | Date |
|----------|-----------|------|
| Next.js over plain React | SSR, App Router, Vercel integration | 2026-01 |
| PostgreSQL over MongoDB | Relational data, better for property records | 2026-01 |
| Prisma ORM | Type-safe, great DX, migrations | 2026-01 |
| Dutch UI, English code | Local market, international team potential | 2026-01 |

---

## Domain Terminology

| Dutch | English | Description |
|-------|---------|-------------|
| Woningpaspoort | Housing Passport | The product name |
| Eigenaar | Owner | Property owner |
| Woning | Property/Home | Residential property |
| Energielabel | Energy Label | A-G rating |
| Kadaster | Land Registry | Dutch property registry |
| WOZ-waarde | Property Tax Value | Municipal valuation |
| VvE | HOA | Homeowners association |
| Onderhoud | Maintenance | Property maintenance |
| Bouwjaar | Year Built | Construction year |

---

## Common Tasks

### Adding a New Feature
1. Create/update PRD in `docs/PRDs/`
2. Create branch: `git checkout -b feat/feature-name`
3. Write failing tests first
4. Implement components and API
5. Run full test suite
6. Create PR with description

### Adding a New Page
```bash
# Create page file
touch src/app/[route]/page.tsx

# Follow pattern:
# - Server component by default
# - 'use client' only when needed
# - Metadata export for SEO
```

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npm run db:push` (dev) or create migration
3. Update types: `npm run db:generate`
4. Test with `npm run db:studio`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Prisma types outdated | `npm run db:generate` |
| Hydration mismatch | Check for 'use client' directive |
| Build fails on Vercel | Check env vars in dashboard |

---

## Related Documents
- PRDs: `docs/PRDs/`
- Design: [Figma link TBD]
- API Spec: `docs/api.md`

---

*v1.0 | Created: 2026-01-18*
