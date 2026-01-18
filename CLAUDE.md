# CLAUDE.md - Woningpaspoort

## Project Overview
| | |
|---|---|
| **Project** | Woningpaspoort (Housing Passport) |
| **Owner** | Martijn Broersma |
| **Type** | Construction Tech Platform |
| **Status** | 🟡 In Development |
| **Market** | Dutch construction industry (€5B annual loss from miscommunication) |

### Vision
The **definitive digital lifecycle system** for buildings — capturing every detail from construction through decades of ownership. An immutable, cryptographically-secured database serving as the single source of truth for a property's entire history.

---

## Context Inheritance
Extends `~/.claude/CLAUDE.md`. Personal context, communication preferences, and skills apply.

**Project-specific overrides:**
- This is an ambitious, complex product — think big but build incrementally
- Integration with Cere's data vault technology is a key differentiator
- Dutch regulatory compliance (Wkb law) is a core driver
- Focus on both B2B (builders) and B2C (homeowners) experiences

---

## Product Vision

### The Problem
- **€5 billion annual loss** in Dutch construction due to miscommunication
- **19% average cost overruns** on projects
- **Fragmented documentation**: WhatsApp, email, paper scattered everywhere
- **Wkb law (Jan 2024)**: New Dutch quality assurance law requires 20-year document retention
- **No single source of truth** for property history

### The Solution
A comprehensive digital record system that captures:
- Every material, contractor, and process used in construction
- Real-time documentation via smart glasses + AI
- Immutable, cryptographically-secured records
- User-controlled data sharing with zero-knowledge proofs
- Predictive AI for maintenance and improvements

---

## Core Components

### 1. Construction Documentation
| What We Capture | Details |
|-----------------|---------|
| **Materials** | Paint colors, brands, application dates, batch numbers |
| **Processes** | Step-by-step phases with photo/video evidence |
| **Weather** | Environmental conditions during each phase |
| **Contractors** | Who did what, when, certifications, quality ratings |
| **Compliance** | Permits, inspections, regulatory approvals |

### 2. Smart Documentation System
- **Smart glasses integration**: Real-time video recording of workdays
- **AI frame analysis**: Automatic identification of materials and processes
- **Zero manual input**: Administrative records generated automatically
- **Human-in-the-loop**: QA when AI confidence is low

### 3. Legal Compliance (Wkb)
- 20-year retention periods
- Real-time project tracking
- Municipality oversight access (non-personal data)
- Automated compliance reporting

### 4. Data Security (Cere Integration)
- **Individual encryption**: Each house timeline separately encrypted
- **Zero-knowledge proofs**: Verification without exposing sensitive data
- **User-controlled access**: Homeowners control all data sharing
- **Immutable records**: Blockchain-style cryptographic verification

### 5. AI-Powered Features ("Homey")
- Predictive maintenance recommendations
- Personalized improvement offers based on budget
- Multi-year timeline planning (solar, extensions, renovations)
- Specialist team guidance throughout lifecycle

---

## User Personas & Interfaces

### Homeowners (B2C)
**Experience:**
- Mobile-first wizard: Design dream house in 3 minutes
- Real-time construction progress tracking
- Budget-based improvement timeline (2-3 year plans)
- Complete transparency on all work and materials
- "Homey" AI assistant for maintenance advice

**Key screens:**
- Dashboard: Property overview, upcoming maintenance
- Timeline: Construction history, photo/video evidence
- Planning: Future improvements with cost estimates
- Sharing: Control who sees what data

### Builders & Contractors (B2B)
**Experience:**
- Real-time construction operating system
- Unified dashboard across all projects
- Smart glasses integration for auto-documentation
- Automated compliance reporting
- Supply chain integration

**Key screens:**
- Project dashboard: All active builds
- Documentation: Auto-captured evidence
- Compliance: Permit status, inspection schedules
- Team: Subcontractor coordination

### Municipalities (B2G)
**Experience:**
- Non-personal workflow transparency
- Real-time project oversight
- Automated permit verification
- Inspection scheduling integration

---

## Business Model

### Revenue Streams
| Stream | Description | Priority |
|--------|-------------|----------|
| **Builder SaaS** | Per-project or subscription for construction companies | P0 |
| **Homeowner Freemium** | Free basic, premium for AI features | P1 |
| **Data Marketplace** | Anonymized insights for insurance, banks | P2 |
| **Municipality Licensing** | Compliance platform access | P2 |

### Data Monetization (with user consent)
- **Insurance**: Personalized rates based on actual construction quality
- **Banks**: Enhanced lending decisions with complete property history
- **Building companies**: Targeted offers for specific house configurations
- **Maintenance services**: Predictive scheduling based on installed components

---

## Technical Architecture

### Stack
| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Next.js 14 / React Native | Web + Mobile |
| **Backend** | Node.js / tRPC | Type-safe API |
| **Database** | PostgreSQL + TimescaleDB | Relational + time-series |
| **Storage** | Cere DDC / S3 | Decentralized + backup |
| **Auth** | NextAuth + DigiD (future) | Dutch gov integration |
| **AI/ML** | Python / FastAPI | Video analysis, predictions |
| **Data Vault** | Cere Network | Individual encryption, ZK proofs |

### Key Integrations
- **Smart glasses**: RealWear, Vuzix (construction-grade)
- **IoT sensors**: Temperature, humidity, energy monitoring
- **Kadaster**: Dutch land registry
- **RVO**: Energy label database
- **BAG**: Building address registry

---

## Project Structure
```
woningpaspoort/
├── CLAUDE.md                    ← You are here
├── apps/
│   ├── web/                     ← Next.js homeowner app
│   ├── builder/                 ← Next.js builder dashboard
│   └── mobile/                  ← React Native app
├── packages/
│   ├── database/                ← Prisma schema, migrations
│   ├── ai/                      ← ML models, video analysis
│   ├── cere-sdk/                ← Data vault integration
│   └── shared/                  ← Common types, utils
├── services/
│   ├── api/                     ← tRPC API server
│   ├── ai-worker/               ← Video processing queue
│   └── compliance/              ← Wkb reporting service
├── docs/
│   └── PRDs/                    ← Product requirements
└── infrastructure/              ← Terraform, K8s configs
```

---

## Development Phases

### Phase 1: MVP (Current Focus)
- [ ] Homeowner onboarding wizard
- [ ] Basic property profile creation
- [ ] Document upload & organization
- [ ] Simple sharing via secure links
- [ ] Builder dashboard (manual entry)

### Phase 2: Smart Documentation
- [ ] Smart glasses SDK integration
- [ ] AI video analysis pipeline
- [ ] Automatic material recognition
- [ ] Human-in-the-loop QA interface

### Phase 3: Compliance & Integrations
- [ ] Wkb compliance reporting
- [ ] Municipality portal
- [ ] Kadaster/BAG integration
- [ ] DigiD authentication

### Phase 4: AI & Monetization
- [ ] "Homey" AI assistant
- [ ] Predictive maintenance
- [ ] Data marketplace (anonymized)
- [ ] Insurance/bank integrations

---

## Domain Terminology

| Dutch | English | Context |
|-------|---------|---------|
| Woningpaspoort | Housing Passport | Product name |
| Wkb | Quality Assurance Act | Jan 2024 law requiring documentation |
| Kadaster | Land Registry | Property ownership records |
| BAG | Building Address Registry | Official address database |
| WOZ | Property Tax Value | Municipal valuation |
| Bouwbesluit | Building Code | Construction regulations |
| Oplevering | Handover | Project completion milestone |
| Aannemer | Contractor | General contractor |
| Onderaannemer | Subcontractor | Specialist trades |
| Bouwdossier | Construction File | Traditional paper documentation |
| Energielabel | Energy Label | A-G rating |
| Vergunning | Permit | Building permit |
| Keuring | Inspection | Compliance check |

---

## Key Decisions (ADRs)

| Decision | Reasoning | Date |
|----------|-----------|------|
| Cere for data vaults | Individual encryption, ZK proofs, Martijn's company | 2026-01 |
| Monorepo structure | Multiple apps share code, easier maintenance | 2026-01 |
| tRPC over REST | Type-safe API, excellent DX with TypeScript | 2026-01 |
| TimescaleDB for time-series | Construction timeline data, efficient queries | 2026-01 |
| Smart glasses first (vs phone) | Hands-free for construction workers | 2026-01 |

---

## Development Standards

### Code Style
- **TypeScript:** Strict mode, no `any`, explicit return types
- **React:** Functional components, hooks, server components where possible
- **Naming:** English code, Dutch UI text
- **Commits:** `feat|fix|chore|docs: <50 chars>`

### Testing
- Unit: Vitest
- Component: React Testing Library
- E2E: Playwright
- AI: Golden dataset validation

### Commands
```bash
# Development (from root)
pnpm install
pnpm dev                 # All apps
pnpm dev:web             # Homeowner app only
pnpm dev:builder         # Builder app only

# Quality
pnpm lint
pnpm typecheck
pnpm test

# Database
pnpm db:push
pnpm db:studio
pnpm db:seed
```

---

## Tool Permissions

### Allowed
- ✅ Read/write project files
- ✅ Run pnpm/npm commands
- ✅ Database operations (dev)
- ✅ Git read operations

### Ask First
- ⚠️ Schema changes (affects multiple services)
- ⚠️ New dependencies
- ⚠️ CI/CD modifications
- ⚠️ Infrastructure changes

### Never
- ❌ Modify Cere SDK internals
- ❌ Expose API keys
- ❌ Delete migrations
- ❌ Push to main

---

## Related Resources
- PRD: `docs/PRDs/woningpaspoort-mvp.md`
- Cere docs: Internal
- Wkb law: [Rijksoverheid](https://www.rijksoverheid.nl/onderwerpen/bouwregelgeving/wet-kwaliteitsborging-voor-het-bouwen)

---

*v2.0 | Updated: 2026-01-18 | Reflects full product vision*
