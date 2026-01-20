# Woningpaspoort MVP PRD

## Overview
| | |
|---|---|
| **Author** | Martijn Broersma |
| **Date** | January 2026 |
| **Status** | In Development |
| **Brand** | Helder (by Broersma Engineering) |
| **Launch** | Open Beta |

---

## The Real Story

**Helder is the tech arm of Broersma Engineering** - a family construction company (dad, brother, sister, Martijn) established in 1956. After 19,000+ projects built the traditional way, we're bringing transparency and digital documentation to Dutch construction.

**Brand strategy:**
- Landing page: Premium, modern brand focused on the product
- About page: Family heritage story ("3 generations of builders, now with blockchain")

---

## Product Vision

**Woningpaspoort** is the definitive digital lifecycle system for Dutch new construction (nieuwbouw). It captures every material, contractor, and process used in building a home, creating an immutable record that serves as the single source of truth for a property's entire history.

**Core value proposition:** Progress tracking during construction + permanent proof of quality for resale.

---

## Problem Statement

| Problem | Impact | Our Solution |
|---------|--------|--------------|
| Dutch construction loses **€5B annually** from miscommunication | 19% average cost overruns | Real-time documentation with verified timestamps |
| **Wkb law (Jan 2024)** requires 20-year document retention | Massive admin overhead for builders | Automated Wkb-compliant document management |
| Property history scattered across WhatsApp, email, paper | Buyers can't verify construction quality | Single verified digital passport |
| Homeowners have no visibility into their build | Anxiety, surprises, disputes | Live progress tracking with photo evidence |

---

## Target Users

### Primary: Families Building on Kavels
| Attribute | Details |
|-----------|---------|
| **Budget** | €400K - €700K total (plot + build + finishing) |
| **Timeline** | 1-2 years from decision to move-in |
| **Location** | Dutch new development areas (Almere, Utrecht region, etc.) |
| **Motivation** | Want transparency, progress visibility, and future resale value |

### Secondary: Builders (Minimal Input Role)
- Send photos via WhatsApp at end of day
- Enter cost data for homeowner visibility
- No complex dashboard or project management (yet)

---

## MVP Scope (P0)

### Must Ship

| Feature | Description | Status |
|---------|-------------|--------|
| **Authentication** | Email/password login with NextAuth | To build |
| **Database** | PostgreSQL for persistent storage | To build |
| **Property creation** | Wizard saves to database | To build |
| **Document upload** | Basic file upload to S3/R2 | To build |
| **Share page** | Public URL to share woningpaspoort | Built (keep) |
| **Cost breakdown** | Category-level budget tracking | To build |
| **Notion integration** | Assessment leads → Notion + Slack notification | To build |
| **WhatsApp number** | Builders send photos, manual processing initially | To build |

### Deferred (P1+)

| Feature | Priority | Notes |
|---------|----------|-------|
| Cere blockchain integration | P1 | Mock badges for now ("Onveranderbaar Vastgelegd") |
| Kadaster/BAG lookup | P1 | Address validation |
| Builder dashboard | P1 | Code exists, routes hidden |
| AI photo classification | P1 | Gemini API preview for demo |
| RVO energy label lookup | P2 | User input only for MVP |
| Smart glasses integration | P2 | Future vision |
| Municipality portal | P2 | Wkb reporting |
| "Homey" AI assistant | P2 | Maintenance recommendations |

---

## Key Decisions

### Trust Badge Language
**"Onveranderbaar Vastgelegd"** (Immutably Recorded)
- Dutch language, benefit-focused
- No blockchain jargon for users who don't know Cere
- Clicking shows brief explanation

### Address Handling for Nieuwbouw
**Kavel number format** since addresses don't exist in BAG yet:
- "Kavel 12, Woonwijk De Buitenplaats, Almere"
- Free text input, no BAG validation
- Can update to real address after registration

### Timeline Estimation
**User enters in wizard:**
- Project start date
- Expected completion date
- Current construction phase

System calculates phase timeline based on typical durations per property type.

### Assessment Scoring
**Simplified to 3 tiers** (no numeric score shown):
- **Ready** - Green path to consultation
- **Almost** - Amber, specific recommendations
- **Exploring** - Guide download, nurture sequence

All assessment data still captured for Notion CRM.

### Builder Photo Input
**WhatsApp integration:**
- Dedicated WhatsApp Business number
- Builders send photos at end of work day
- Manual sorting initially, AI classification later (Gemini)
- Photos appear in homeowner's timeline

### Cost Tracking
**Full category breakdown:**
- Foundation
- Structure/Ruwbouw
- Roof & Facade
- Installations (E/W/HVAC)
- Finishing
- Other

Builder enters costs via WhatsApp or simple web form. Homeowner sees budget vs actuals.

### Mobile Strategy
**WhatsApp is the mobile app** for builders.
Homeowners use responsive web (PWA consideration for P1).

### Wkb Compliance
**Pilot with disclaimer:**
- Beta label during launch
- Terms acceptance at account creation includes "not legal advice" language
- Document categories follow Wkb structure
- Full compliance review before removing beta label

---

## Data Model

### Property
```typescript
{
  id: string
  name: string // "Villa Zonneweide"

  // Address (kavel format for nieuwbouw)
  kavelNumber: string // "Kavel 12"
  projectName: string // "Woonwijk De Buitenplaats"
  city: string // "Almere"
  futureAddress?: string // Once registered in BAG

  propertyType: 'VRIJSTAAND' | 'TWEE_ONDER_EEN_KAP' | 'HOEKWONING' | 'TUSSENWONING'

  // Specs
  woonoppervlakte: number // m²
  perceelOppervlakte: number // m²
  aantalKamers: number
  aantalVerdiepingen: number
  energielabel?: string // User input

  // Timeline
  startDate: Date
  expectedCompletion: Date
  currentPhase: ConstructionPhase

  // Verification
  verificationBadge: boolean // "Onveranderbaar Vastgelegd"
  cereVaultId?: string // Future: real Cere integration

  // Ownership
  ownerId: string
  createdAt: Date
}
```

### Cost Breakdown
```typescript
{
  propertyId: string
  category: 'FOUNDATION' | 'STRUCTURE' | 'ROOF_FACADE' | 'INSTALLATIONS' | 'FINISHING' | 'OTHER'
  budgeted: number
  actual: number
  updatedAt: Date
  updatedBy: 'OWNER' | 'BUILDER'
}
```

### Document Categories (Wkb-Compliant)
| Category | Dutch | Required |
|----------|-------|----------|
| Drawings | Tekeningen | Yes |
| Calculations | Berekeningen | Yes |
| Materials | Materiaalspecificaties | Yes |
| Installations | Installatie-instructies | Yes |
| Maintenance | Onderhoudsvoorschriften | Yes |
| Warranties | Garantiebewijzen | Yes |
| Inspections | Keuringsrapporten | Yes |
| Energy | BENG / Energielabel | Yes |
| Photos | Foto's & Video's | No |
| Invoices | Facturen | No |
| Other | Overige documenten | No |

### Construction Phases
1. Grondwerk & Fundering (Foundation)
2. Ruwbouw (Structure)
3. Dak & Gevel (Roof & Facade)
4. Installaties (Installations)
5. Afbouw & Afwerking (Finishing)
6. Oplevering (Handover)

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL (Railway/Supabase) |
| Auth | NextAuth.js (email/password) |
| Storage | Cloudflare R2 or AWS S3 |
| UI | Tailwind CSS, Lucide icons |
| CRM | Notion API |
| Notifications | Slack webhook |
| WhatsApp | Twilio or WhatsApp Business API |

### Integrations Roadmap
| Integration | MVP | P1 | P2 |
|-------------|-----|----|----|
| PostgreSQL | ✅ | | |
| NextAuth | ✅ | | |
| S3/R2 storage | ✅ | | |
| Notion API | ✅ | | |
| Slack notifications | ✅ | | |
| WhatsApp Business | ✅ | | |
| Cere Network | Mock | ✅ | |
| Kadaster/BAG | | ✅ | |
| Gemini AI | Demo | ✅ | |
| RVO energy labels | | | ✅ |

---

## User Flows

### Homeowner Onboarding
```
Landing page → Assessment quiz → Results (3 tiers)
                                      ↓
                    [If Ready/Almost] → Consultation CTA
                                      ↓
                              Account creation
                                      ↓
                         Property wizard (5 steps):
                         1. Intro + Wkb disclaimer accept
                         2. Location (kavel format)
                         3. Property type + specs
                         4. Timeline (start/end dates)
                         5. Account details
                                      ↓
                              Dashboard with:
                              - Progress timeline
                              - Document library
                              - Cost breakdown
                              - Share link
```

### Builder Photo Input
```
Builder completes work → Opens WhatsApp
                              ↓
                    Sends photos to Helder number
                    (with project name in message)
                              ↓
                    Manual review (MVP) / AI sort (P1)
                              ↓
                    Photos added to homeowner timeline
                              ↓
                    Homeowner gets notification
```

### Lead Capture Flow
```
User completes assessment → Data sent to Notion
                                  ↓
                         Slack notification to Martijn
                                  ↓
                         Manual follow-up call
                                  ↓
                    [If qualified] → Invite to create account
```

---

## Current Implementation Status

### Complete (Keep As-Is)
- [x] Landing page with Helder branding
- [x] Assessment quiz (update scoring display to 3 tiers)
- [x] Homeowner dashboard UI
- [x] Timeline view with phases
- [x] Share page UI
- [x] UI component library

### Complete (Needs Wiring)
- [x] Property wizard UI → needs database connection
- [x] Document list UI → needs upload functionality
- [x] Cost display UI → needs data entry

### To Build
- [ ] NextAuth authentication
- [ ] PostgreSQL schema + Prisma
- [ ] Property CRUD operations
- [ ] Document upload to S3
- [ ] Cost breakdown data entry
- [ ] Notion API integration
- [ ] Slack webhook
- [ ] WhatsApp Business setup

### Hidden (P1)
- [ ] Builder dashboard (routes hidden, code kept)
- [ ] Project management features

### Deleted
- ~~Calculator page~~ (not needed for MVP)
- ~~Portfolio with filtering~~ (static case studies sufficient)

---

## Success Metrics

| Metric | Target | Timeline | Failure Signal |
|--------|--------|----------|----------------|
| Assessment completions | 500 | 3 months | <50 |
| Real users (not family/friends) | 50 | 3 months | **0 = MVP failed** |
| Properties created | 30 | 3 months | <5 |
| Consultation requests | 50 | 3 months | <10 |
| Documents uploaded | 500 | 3 months | <50 |

**Primary failure signal:** Zero real users outside family/friends network.

---

## Sales & Operations

### Sales Process
1. Assessment completion triggers Slack notification
2. Martijn reviews lead data in Notion
3. Martijn calls qualified leads (Ready/Almost tiers)
4. Qualified leads invited to create account
5. Onboarding call to set up property

### Who Does What
| Role | Person | Responsibilities |
|------|--------|------------------|
| Sales | Martijn | All inbound calls, qualification |
| Tech | Martijn | Product development, AI features |
| Operations | Family | Construction delivery |
| Photo processing | Manual (MVP) | Sort WhatsApp photos to projects |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Zero real users | Medium | **Critical** | Launch to Broersma existing clients first |
| WhatsApp photo volume overwhelming | Low | Medium | Start with 5 projects max, then scale |
| Wkb compliance wrong | Low | High | Beta disclaimer, legal review before V1 |
| Cere integration delays | Medium | Low | Mock badges work fine for MVP |
| Cost tracking too complex | Medium | Medium | Start with totals only, add categories if requested |

---

## Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| ~~Cere SDK timeline?~~ | Mock for MVP, integrate P1 |
| ~~Pricing model?~~ | Free for MVP, monetize later |
| ~~Which builders for pilot?~~ | Broersma projects only initially |
| ~~Minimum Wkb compliance?~~ | Disclaimer + document categories |
| ~~Share page in/out?~~ | In - core value prop |
| ~~Builder dashboard?~~ | Hidden, code kept |

---

## Appendix: Updated File Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing (complete)
│   ├── wizard/page.tsx             # Onboarding (wire to DB)
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard (wire to DB)
│   │   ├── layout.tsx              # Auth-protected layout
│   │   ├── timeline/page.tsx       # Timeline (complete)
│   │   ├── documents/page.tsx      # Documents (build upload)
│   │   ├── costs/page.tsx          # Cost breakdown (new)
│   │   └── share/page.tsx          # Share controls (build)
│   ├── share/[token]/page.tsx      # Public share (keep)
│   ├── (marketing)/
│   │   ├── assessment/page.tsx     # Quiz (update scoring UI)
│   │   └── about/page.tsx          # Family story (new)
│   ├── auth/
│   │   ├── login/page.tsx          # Login (build)
│   │   └── register/page.tsx       # Register (build)
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth routes
│       ├── properties/             # CRUD
│       ├── documents/              # Upload
│       ├── costs/                  # Cost tracking
│       ├── webhooks/
│       │   ├── notion/             # Lead capture
│       │   └── whatsapp/           # Photo intake
│       └── share/                  # Generate share tokens
├── components/
│   ├── ui/                         # Design system
│   └── layout/                     # Nav, footer
├── lib/
│   ├── db/                         # Prisma client
│   ├── auth.ts                     # NextAuth config
│   ├── notion.ts                   # Notion API
│   ├── storage.ts                  # S3/R2 upload
│   └── whatsapp.ts                 # Twilio/WA Business
└── prisma/
    └── schema.prisma               # Database schema
```

---

## Next Steps

1. **Set up infrastructure** - PostgreSQL, S3, NextAuth
2. **Build auth flow** - Login, register, protected routes
3. **Wire wizard to database** - Property creation
4. **Add document upload** - Basic file handling
5. **Build cost breakdown page** - New feature
6. **Notion integration** - Assessment → CRM
7. **WhatsApp setup** - Photo intake number
8. **Update assessment UI** - 3 tiers, no numeric score
9. **Create About page** - Family story
10. **Launch open beta** - Announce to network

---

*Last updated: January 2026*
*Interview decisions incorporated from PRD review session*
