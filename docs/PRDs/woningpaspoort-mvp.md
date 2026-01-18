# Woningpaspoort MVP PRD

## Overview
**Author:** Martijn Broersma  
**Date:** January 2026  
**Status:** Draft  
**Target Release:** Q1 2026

---

## Problem Statement

The Dutch construction industry loses **€5 billion annually** due to miscommunication, with average project cost overruns of 19%. The new Wkb law (January 2024) now requires builders to retain comprehensive documentation for 20 years, but current solutions are fragmented across WhatsApp, email, and paper files.

### User Pain Points

**Homeowners:**
- No single view of their property's construction history
- Can't verify what materials/methods were used
- Difficulty sharing property info when selling
- No guidance on maintenance or improvements

**Builders:**
- Manual documentation is time-consuming and error-prone
- Wkb compliance requires massive administrative overhead
- No efficient way to prove quality of work
- Fragmented communication with subcontractors

**Municipalities:**
- Limited visibility into construction compliance
- Manual inspection scheduling and tracking
- No standardized documentation format

---

## Goals & Success Metrics

### Primary Goal
Launch an MVP that allows homeowners to create a digital property profile and builders to document construction projects, establishing product-market fit in the Dutch market.

### Success Metrics
| Metric | Target | Timeline |
|--------|--------|----------|
| Homeowner signups | 1,000 | 3 months |
| Properties created | 500 | 3 months |
| Builder pilots | 5 companies | 3 months |
| Document uploads | 5,000 | 3 months |
| NPS score | >40 | 3 months |

---

## User Stories

### Homeowner Persona: Jan (45, Amsterdam)
Jan recently bought a 1970s townhouse and wants to track renovations.

- As Jan, I want to **create a digital profile of my house** so that I have all information in one place
- As Jan, I want to **upload existing documents** (deeds, energy labels) so they're organized and searchable
- As Jan, I want to **see my house's maintenance history** so I know what needs attention
- As Jan, I want to **share my woningpaspoort with a buyer** when I sell, so they trust the property

### Builder Persona: Klaas (52, Rotterdam)
Klaas runs a mid-size construction company and needs Wkb compliance.

- As Klaas, I want to **document each construction phase** to comply with Wkb requirements
- As Klaas, I want to **upload photos with automatic timestamps** to prove when work was done
- As Klaas, I want to **generate compliance reports** to submit to municipalities
- As Klaas, I want to **share project progress with homeowners** to maintain transparency

---

## Functional Requirements

### Must Have (P0) - MVP Scope

#### Homeowner App
- [ ] Email/password authentication
- [ ] Property creation wizard (address, type, year built, size)
- [ ] Basic property dashboard with key stats
- [ ] Document upload (PDF, images) with categorization
- [ ] Simple timeline view of property events
- [ ] Shareable link generation (public/private toggle)
- [ ] Basic maintenance reminder system

#### Builder Dashboard
- [ ] Company registration and verification
- [ ] Project creation linked to property address
- [ ] Phase-based documentation (foundation, framing, etc.)
- [ ] Photo upload with automatic EXIF timestamp extraction
- [ ] Basic Wkb compliance checklist
- [ ] Project sharing with homeowner

#### Shared
- [ ] Responsive web design (mobile-first)
- [ ] Dutch language UI
- [ ] Basic search and filtering
- [ ] File storage with encryption at rest

### Should Have (P1) - Post-MVP

- [ ] Multiple properties per homeowner
- [ ] Subcontractor invitation system
- [ ] Material specification database
- [ ] Weather condition logging
- [ ] Export to PDF report
- [ ] Push notifications for updates

### Nice to Have (P2) - Future

- [ ] Smart glasses integration
- [ ] AI-powered document classification
- [ ] Kadaster/BAG data import
- [ ] DigiD authentication
- [ ] Municipality portal
- [ ] "Homey" AI assistant

---

## Technical Considerations

### Architecture
- **Monorepo** with shared packages for types, utils, database
- **Next.js** for both homeowner and builder apps (SSR, good SEO)
- **tRPC** for type-safe API communication
- **PostgreSQL** with Prisma ORM
- **S3-compatible storage** for documents (migrate to Cere DDC later)

### Cere Integration (Future)
The MVP will use standard cloud storage, but the architecture must support migration to Cere's decentralized data vaults:
- Individual encryption per property
- Zero-knowledge proof verification
- User-controlled access permissions

### Data Model Highlights
```
Property
├── BasicInfo (address, type, year, size)
├── Documents[] (categorized files)
├── Timeline[] (events with timestamps)
├── MaintenanceRecords[]
└── Shares[] (access links)

Project (builder)
├── Property (linked)
├── Phases[] (foundation, framing, etc.)
├── Documentation[] (photos, notes)
├── Contractors[]
└── ComplianceChecks[]
```

### Security Requirements
- All data encrypted at rest (AES-256)
- HTTPS only
- JWT tokens with short expiry
- Rate limiting on API
- GDPR compliance (data export, deletion)

---

## Dependencies

| Dependency | Team/System | Status |
|------------|-------------|--------|
| Cloud hosting (Vercel) | External | Ready |
| PostgreSQL (Railway/Supabase) | External | Ready |
| File storage (S3/R2) | External | Ready |
| Email service (Resend) | External | Ready |
| Cere SDK | Cere team | Future (P2) |

---

## Timeline & Milestones

| Milestone | Target Date | Owner |
|-----------|-------------|-------|
| Design complete | Week 2 | Martijn |
| Auth + property creation | Week 3 | Dev |
| Document upload system | Week 4 | Dev |
| Builder dashboard | Week 5-6 | Dev |
| Sharing system | Week 7 | Dev |
| Beta testing | Week 8-9 | Martijn |
| Public launch | Week 10 | All |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low builder adoption | Medium | High | Start with 5 pilot partners, iterate on feedback |
| Wkb compliance complexity | Medium | Medium | Consult with legal expert, start simple |
| Data security concerns | Low | High | Standard encryption now, Cere integration later |
| Scope creep | High | Medium | Strict P0 focus, defer all P1/P2 features |

---

## Open Questions

- [ ] What's the minimum Wkb compliance for MVP?
- [ ] Should we require builder verification before project creation?
- [ ] Pricing model: freemium vs paid from start?
- [ ] Which 5 builders for pilot program?

---

## Appendix

### Competitive Landscape
- **Bouwdossier Online**: Document storage, no smart features
- **PlanRadar**: Construction management, expensive, complex
- **Woningwaarde.nl**: Value estimation only
- **Gap**: No comprehensive lifecycle platform with AI and privacy-first approach

### Related Documents
- [Wkb Law Summary](https://www.rijksoverheid.nl/onderwerpen/bouwregelgeving/wet-kwaliteitsborging-voor-het-bouwen)
- Technical Architecture (TBD)
- Design Mockups (TBD)
