# Email Flows - Helder Woningpaspoort

Dit document beschrijft alle automatische e-mailflows in het Helder systeem.

## Overzicht

| Email Type | Trigger | Ontvanger | Frequentie |
|------------|---------|-----------|------------|
| Welcome | Registratie | Nieuwe gebruiker | Eenmalig |
| Password Reset | Reset aanvraag | Gebruiker | Op aanvraag |
| Document Uploaded | Upload | Eigenaar | Per document |
| Phase Completed | Fase afgerond | Eigenaar | Per fase |
| Issue Alert | Issue gedetecteerd | Bouwer | Direct |
| Share Link | Link aangemaakt | Eigenaar | Per link |
| Weekly Summary | Zondag 20:00 | Eigenaar | Wekelijks |
| Builder Digest | Ma-Vr 07:00 | Bouwer | Dagelijks |

---

## 1. Welcome Email

**Trigger:** Succesvolle registratie  
**Ontvanger:** Nieuwe gebruiker  
**Template:** `welcomeEmail`

### Inhoud
- Welkomstbericht
- Overzicht van features
- Link naar dashboard
- Support contactgegevens

### Implementatie
```typescript
import { sendEmail, welcomeEmail } from '@/lib/email'

await sendEmail({
  to: user.email,
  ...welcomeEmail({
    userName: user.name,
    loginUrl: `${process.env.APP_URL}/auth/login`,
  }),
})
```

---

## 2. Password Reset Email

**Trigger:** Gebruiker vraagt wachtwoord reset aan  
**Ontvanger:** Gebruiker  
**Template:** `passwordResetEmail`

### Inhoud
- Reset instructies
- Veilige reset link (24 uur geldig)
- Waarschuwing bij onbekende aanvraag

### Implementatie
```typescript
import { sendEmail, passwordResetEmail } from '@/lib/email'

await sendEmail({
  to: user.email,
  ...passwordResetEmail({
    userName: user.name,
    resetUrl: `${process.env.APP_URL}/auth/reset?token=${token}`,
    expiresIn: '24 uur',
  }),
})
```

---

## 3. Document Uploaded Email

**Trigger:** Nieuw document geüpload naar property of project  
**Ontvanger:** Eigenaar van de property  
**Template:** `documentUploadedEmail`

### Inhoud
- Document naam en type
- Property naam
- Link naar document
- Blockchain verificatie status

### Implementatie
```typescript
import { sendEmail, documentUploadedEmail } from '@/lib/email'

await sendEmail({
  to: owner.email,
  ...documentUploadedEmail({
    userName: owner.name,
    documentName: document.name,
    documentType: document.type,
    propertyName: property.name,
    viewUrl: `${process.env.APP_URL}/dashboard/documents/${document.id}`,
  }),
})
```

---

## 4. Phase Completed Email

**Trigger:** Bouwfase wordt gemarkeerd als afgerond  
**Ontvanger:** Eigenaar  
**Template:** `phaseCompletedEmail`

### Inhoud
- Fase naam
- Voortgangspercentage (visueel)
- Volgende fase
- Link naar tijdlijn

### Implementatie
```typescript
import { sendEmail, phaseCompletedEmail } from '@/lib/email'

await sendEmail({
  to: owner.email,
  ...phaseCompletedEmail({
    userName: owner.name,
    phaseName: phase.name,
    propertyName: property.name,
    progress: 65,
    nextPhase: 'Installaties',
    viewUrl: `${process.env.APP_URL}/dashboard/timeline`,
  }),
})
```

---

## 5. Issue Alert Email

**Trigger:** AI detecteert probleem of bouwer rapporteert issue  
**Ontvanger:** Bouwer / Projectmanager  
**Template:** `issueAlertEmail`

### Inhoud
- Issue titel en beschrijving
- Ernst niveau (low/medium/high/critical)
- Project naam
- Link naar issue

### Implementatie
```typescript
import { sendEmail, issueAlertEmail } from '@/lib/email'

await sendEmail({
  to: builder.email,
  ...issueAlertEmail({
    userName: builder.name,
    issueTitle: issue.title,
    severity: issue.severity,
    projectName: project.name,
    description: issue.description,
    viewUrl: `${process.env.APP_URL}/builder/issues/${issue.id}`,
  }),
})
```

---

## 6. Share Link Created Email

**Trigger:** Gebruiker maakt een deellink aan  
**Ontvanger:** Gebruiker  
**Template:** `shareLinkEmail`

### Inhoud
- Share URL
- Toegangsniveau
- Verloopdatum (indien van toepassing)
- Instructies voor beheer

### Implementatie
```typescript
import { sendEmail, shareLinkEmail } from '@/lib/email'

await sendEmail({
  to: user.email,
  ...shareLinkEmail({
    userName: user.name,
    propertyName: property.name,
    shareUrl: `${process.env.APP_URL}/share/${share.token}`,
    expiresAt: '31 december 2025',
    accessLevel: 'standard',
  }),
})
```

---

## 7. Weekly Summary Email (Homeowner)

**Trigger:** Scheduled job - Zondag 20:00  
**Ontvanger:** Eigenaren met actieve projecten  
**Template:** `weeklySummaryEmail`

### Inhoud
- Voortgangspercentage
- Aantal nieuwe documenten
- Voltooide taken
- Aankomende taken/mijlpalen

### Implementatie
```typescript
import { sendEmail, weeklySummaryEmail } from '@/lib/email'

// In scheduled job
await sendEmail({
  to: owner.email,
  ...weeklySummaryEmail({
    userName: owner.name,
    propertyName: property.name,
    progress: 65,
    newDocuments: 12,
    completedTasks: 3,
    upcomingTasks: ['Dakbedekking', 'Kozijnen plaatsen'],
    viewUrl: `${process.env.APP_URL}/dashboard`,
  }),
})
```

---

## 8. Builder Daily Digest Email

**Trigger:** Scheduled job - Ma-Vr 07:00  
**Ontvanger:** Bouwers met actieve projecten  
**Template:** `builderDailyDigestEmail`

### Inhoud
- Totaal aantal projecten
- Foto's ontvangen vandaag
- Open issues
- Per-project overzicht

### Implementatie
```typescript
import { sendEmail, builderDailyDigestEmail } from '@/lib/email'

// In scheduled job
await sendEmail({
  to: builder.email,
  ...builderDailyDigestEmail({
    userName: builder.name,
    companyName: company.name,
    totalProjects: 5,
    totalPhotosToday: 23,
    totalIssues: 2,
    projects: [
      { name: 'Villa Zonneweide', newPhotos: 12, issues: 0, phase: 'Afbouw' },
      { name: 'Kavel 24', newPhotos: 11, issues: 2, phase: 'Ruwbouw' },
    ],
    viewUrl: `${process.env.APP_URL}/builder/dashboard`,
  }),
})
```

---

## Configuratie

### Environment Variables

```env
# Resend API Key (required)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Sender email address
EMAIL_FROM=Helder <noreply@helder.nl>

# App URL for email links
NEXT_PUBLIC_APP_URL=https://helder.nl
```

### Resend Setup

1. Maak een account aan op [resend.com](https://resend.com)
2. Verifieer uw domein
3. Genereer een API key
4. Voeg de key toe aan `.env`

---

## Testing

In development mode worden emails gelogd naar de console in plaats van verzonden:

```typescript
// src/lib/email/send.ts
if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
  console.log('📧 Email would be sent:', { to, subject })
  return { id: 'dev-mock-id', success: true }
}
```

---

## Future Improvements

- [ ] Email preferences per gebruiker
- [ ] Unsubscribe links
- [ ] Email templates in database (voor A/B testing)
- [ ] Delivery tracking / analytics
- [ ] Retry logic voor gefaalde verzendingen
