# Woningpaspoort Profile

## Project Context
Woningpaspoort is a digital housing passport platform focused on **nieuwbouw (new construction)** for families building homes on **kavels (plots)** in the **€400,000-€700,000** price range.

## Core Value Proposition
- **Wedge**: Wkb compliance (Wet kwaliteitsborging) - mandatory since January 2024
- **Moat**: Complete housing DNA from first pile to handover
- **Trust**: Blockchain verification via Cere Network

## Target Users

### Primary: Homeowners (Families)
- Building their first custom home
- Want transparency in construction process
- Need Wkb-compliant documentation for handover
- Value long-term property records

### Secondary: Builders (Aannemers)
- Need to deliver consumentendossier
- Want efficient documentation workflow
- Managing multiple nieuwbouw projects

## Technical Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: tRPC, Prisma, PostgreSQL
- **Auth**: NextAuth.js
- **Blockchain**: Cere Network (mock for MVP)
- **Language**: TypeScript (strict mode)

## Key Features by Priority

### P0 - MVP Core
1. Property registration wizard (nieuwbouw focus)
2. Construction timeline with phases
3. Document management (Wkb categories)
4. Secure sharing via links

### P1 - Enhanced
1. Builder portal for documentation
2. Material tracking with warranties
3. Photo galleries per phase
4. Blockchain verification display

### P2 - Future
1. Smart glasses integration
2. AI video analysis
3. DigiD authentication
4. Municipality portal

## Domain Terminology (Dutch)
| Dutch | English | Usage |
|-------|---------|-------|
| Woningpaspoort | Housing Passport | Product name |
| Wkb | Quality Assurance Act | Legal compliance |
| Consumentendossier | Consumer file | Required Wkb documentation |
| Kwaliteitsborger | Quality controller | Third-party inspector |
| Oplevering | Handover | Project completion |
| Aannemer | Contractor | Builder/construction company |
| Kavel | Plot | Building plot/land |
| Nieuwbouw | New construction | Target segment |

## UI/UX Guidelines
- Language: Dutch (formal "u" form)
- Aesthetic: Professional, trustworthy, modern
- Colors: Deep blue primary, terracotta accent
- Key emotion: Confidence and transparency

## Verification & Quality
- All code changes must pass TypeScript strict mode
- Follow existing component patterns
- Test critical user flows
- Document API changes
