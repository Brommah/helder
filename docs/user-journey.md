# User Journey Documentation - Helder Woningpaspoort

*Versie 1.0 — Januari 2026*

---

## Overzicht User Flows

Dit document beschrijft de complete user journeys voor alle gebruikersrollen in het Helder platform.

---

## 1. Homeowner Journey

### 1.1 Registratie & Onboarding

```
Landing Page (/)
    │
    └─→ Assessment (/assessment)
         │
         └─→ Registratie (/auth/register)
              │
              ├─→ Email: Welkom email verzonden
              │
              └─→ Dashboard (/dashboard)
                   │
                   └─→ Onboarding Tour gestart (automatisch)
```

**Touchpoints:**
1. **Landing Page**: Hero sectie met "ONTDEK OF BOUWEN PAST" CTA
2. **Assessment**: Vragenlijst om geschiktheid te bepalen
3. **Registratie**: Email, wachtwoord, naam
4. **Welkom Email**: Link naar dashboard, overzicht features
5. **Onboarding Tour**: 8-staps rondleiding door dashboard

### 1.2 Dashboard Navigatie

```
Dashboard (/dashboard)
    │
    ├─→ Overzicht
    │    ├── Property Card
    │    ├── Voortgangspercentage
    │    └── Recente documenten
    │
    ├─→ Documenten (/dashboard/documents)
    │    ├── Upload document
    │    ├── Bekijk document
    │    └── Filter/zoek
    │
    ├─→ Tijdlijn (/dashboard/timeline)
    │    ├── Chronologische events
    │    └── Fase markers
    │
    ├─→ Materialen (/dashboard/materials)
    │    ├── Materiaallijst
    │    └── Garantie info
    │
    ├─→ Kosten (/dashboard/costs)
    │    ├── Budget vs Actual
    │    └── Categorieën
    │
    ├─→ AI Intelligence (/dashboard/ai)
    │    ├── Vraag stellen
    │    └── Inzichten
    │
    ├─→ Delen (/dashboard/share)
    │    ├── Link genereren
    │    └── Toegangsbeheer
    │
    └─→ Instellingen (/dashboard/settings)
         ├── Profiel
         ├── Notificaties
         └── Tour herstarten
```

### 1.3 Document Upload Flow

```
Documenten pagina
    │
    └─→ "Upload" button klik
         │
         └─→ File selector
              │
              └─→ File geselecteerd
                   │
                   ├─→ Upload progress indicator
                   │
                   └─→ Succes
                        │
                        ├─→ Toast notificatie
                        ├─→ Email: Document uploaded
                        └─→ In-app notificatie
```

### 1.4 Share Link Flow

```
Delen pagina
    │
    └─→ "Maak link" klik
         │
         └─→ Configuratie modal
              │
              ├── Toegangsniveau selecteren
              ├── Verloopdatum instellen
              └── Wachtwoord (optioneel)
                   │
                   └─→ Link gegenereerd
                        │
                        ├─→ Kopieer naar clipboard
                        ├─→ Email: Share link created
                        └─→ Link actief op /share/[token]
```

---

## 2. Builder Journey

### 2.1 Builder Onboarding

```
Landing Page (/)
    │
    └─→ Contact/Demo request
         │
         └─→ Account setup (admin)
              │
              └─→ Login (/auth/login)
                   │
                   └─→ Builder Dashboard (/builder/dashboard)
                        │
                        └─→ Onboarding Tour (6 stappen)
```

### 2.2 Project Management

```
Builder Dashboard
    │
    ├─→ Projecten overzicht
    │    ├── Actieve projecten
    │    ├── Foto's deze week
    │    └── Open issues
    │
    ├─→ Project detail (/builder/projects/[id])
    │    ├── Overview tab
    │    │    ├── Stats
    │    │    └── Fases
    │    │
    │    ├── Photos tab
    │    │    └── Foto grid per fase
    │    │
    │    ├── Timeline tab
    │    │    └── Event lijst
    │    │
    │    ├── Materials tab
    │    │    └── Materiaal tracking
    │    │
    │    └── Costs tab
    │         └── Budget overzicht
    │
    └─→ WhatsApp Integration
         └─→ Koppel nummer
```

### 2.3 WhatsApp Photo Upload Flow

```
WhatsApp (externe app)
    │
    └─→ Foto sturen naar gekoppeld nummer
         │
         └─→ Twilio Webhook ontvangen
              │
              └─→ Foto opslaan
                   │
                   ├─→ AI Classification
                   │    ├── Fase detectie
                   │    ├── Issue detectie
                   │    └── Kwaliteitscheck
                   │
                   └─→ Document aangemaakt
                        │
                        ├─→ Builder notificatie
                        └─→ Homeowner notificatie (optioneel)
```

### 2.4 Issue Management

```
Issue gedetecteerd (AI of handmatig)
    │
    └─→ Issue aangemaakt
         │
         ├─→ Email alert naar builder
         ├─→ In-app notificatie
         │
         └─→ Issue detail pagina
              │
              ├── Status wijzigen
              ├── Toewijzen aan team
              └── Oplossen/afwijzen
                   │
                   └─→ Issue resolved notificatie
```

---

## 3. Admin Journey

### 3.1 Admin Dashboard (Future)

```
Admin Login
    │
    └─→ Admin Dashboard
         │
         ├── User management
         ├── Company management
         ├── System health
         └── Analytics
```

---

## 4. Public/Shared Access

### 4.1 Share Link Access

```
Gedeelde link (/share/[token])
    │
    ├─→ Wachtwoord check (indien ingesteld)
    │
    └─→ Shared View
         │
         ├── Property overzicht
         ├── Documenten (indien toegestaan)
         ├── Tijdlijn (indien toegestaan)
         └── Geen edit toegang
```

---

## 5. Notificatie Flows

### 5.1 In-App Notificaties

| Event | Ontvanger | Type | Link |
|-------|-----------|------|------|
| Document uploaded | Owner | DOCUMENT_UPLOADED | /dashboard/documents |
| Document verified | Owner | DOCUMENT_VERIFIED | /dashboard/documents |
| Phase completed | Owner | PHASE_COMPLETED | /dashboard/timeline |
| Phase started | Owner | PHASE_STARTED | /dashboard/timeline |
| Issue detected | Builder | ISSUE_DETECTED | /builder/issues |
| Issue resolved | Builder, Owner | ISSUE_RESOLVED | /builder/issues |
| Message received | Builder | MESSAGE_RECEIVED | /builder/messages |
| Share link created | Owner | SHARE_LINK_CREATED | /dashboard/share |
| Milestone reached | Owner | MILESTONE_REACHED | /dashboard |
| Maintenance due | Owner | MAINTENANCE_DUE | /dashboard |

### 5.2 Email Notificaties

| Email | Trigger | Ontvanger |
|-------|---------|-----------|
| Welcome | Registratie | Nieuwe user |
| Password Reset | Reset aanvraag | User |
| Document Uploaded | Upload complete | Owner |
| Phase Completed | Fase afgerond | Owner |
| Issue Alert | Issue detected | Builder |
| Share Link | Link created | Owner |
| Weekly Summary | Zondag 20:00 | Owner (actief project) |
| Builder Digest | Ma-Vr 07:00 | Builder |

---

## 6. Error Flows

### 6.1 Authentication Errors

```
Login poging
    │
    ├─→ Succes → Dashboard
    │
    └─→ Fout
         │
         ├── "Ongeldige inloggegevens"
         │    └─→ Opnieuw proberen / Reset wachtwoord
         │
         └── "Account niet gevonden"
              └─→ Registreren link
```

### 6.2 Document Upload Errors

```
Upload poging
    │
    ├─→ Succes → Succes toast
    │
    └─→ Fout
         │
         ├── Bestand te groot
         │    └─→ Error toast + max size info
         │
         ├── Ongeldig formaat
         │    └─→ Error toast + toegestane formaten
         │
         └── Server fout
              └─→ Error toast + probeer later
```

---

## 7. Mobile Responsiveness

### 7.1 Breakpoints

| Breakpoint | Size | Layout |
|------------|------|--------|
| Mobile | < 640px | Single column, hamburger nav |
| Tablet | 640-1024px | Two column, sidebar visible |
| Desktop | > 1024px | Full layout, sidebar always visible |

### 7.2 Touch Targets

- Minimum button size: 44x44px
- Tap-friendly spacing
- Swipe gestures for sidebar (mobile)

---

## 8. Accessibility

### 8.1 Keyboard Navigation

- Tab navigation through all interactive elements
- Focus indicators visible
- Skip links for main content
- Modal trap handling

### 8.2 Screen Reader Support

- Semantic HTML structure
- ARIA labels where needed
- Alt text for images
- Status announcements

---

## 9. Performance Considerations

### 9.1 Loading States

- Skeleton loaders for data
- Progress indicators for uploads
- Optimistic UI updates

### 9.2 Caching

- API response caching
- Image optimization
- Static page generation where possible

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial documentation |

---

*© 2026 Helder Woningbouw B.V.*
