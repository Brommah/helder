import { describe, it, expect } from 'vitest'
import { welcomeEmail } from '@/lib/email/templates/welcome'
import { passwordResetEmail } from '@/lib/email/templates/password-reset'
import { documentUploadedEmail } from '@/lib/email/templates/document-uploaded'
import { phaseCompletedEmail } from '@/lib/email/templates/phase-completed'
import { issueAlertEmail } from '@/lib/email/templates/issue-alert'
import { shareLinkEmail } from '@/lib/email/templates/share-link'
import { weeklySummaryEmail } from '@/lib/email/templates/weekly-summary'
import { builderDailyDigestEmail } from '@/lib/email/templates/builder-daily-digest'

describe('Email Templates', () => {
  describe('welcomeEmail', () => {
    it('should generate valid welcome email', () => {
      const email = welcomeEmail({
        userName: 'Jan Jansen',
        loginUrl: 'https://helder.nl/auth/login',
      })

      expect(email.subject).toBe('Welkom bij Helder - Uw Woningpaspoort is klaar')
      expect(email.html).toContain('Jan Jansen')
      expect(email.html).toContain('https://helder.nl/auth/login')
      expect(email.html).toContain('HELDER')
      expect(email.html).toContain('Welkom')
    })

    it('should include all required sections', () => {
      const email = welcomeEmail({
        userName: 'Test User',
        loginUrl: 'https://example.com/login',
      })

      expect(email.html).toContain('Wat u kunt verwachten')
      expect(email.html).toContain('Dashboard')
      expect(email.html).toContain('support@helder.nl')
    })
  })

  describe('passwordResetEmail', () => {
    it('should generate valid password reset email', () => {
      const email = passwordResetEmail({
        userName: 'Jan Jansen',
        resetUrl: 'https://helder.nl/auth/reset?token=abc123',
        expiresIn: '24 uur',
      })

      expect(email.subject).toBe('Reset uw wachtwoord - Helder')
      expect(email.html).toContain('Jan Jansen')
      expect(email.html).toContain('https://helder.nl/auth/reset?token=abc123')
      expect(email.html).toContain('24 uur')
    })

    it('should include security warning', () => {
      const email = passwordResetEmail({
        userName: 'Test',
        resetUrl: 'https://example.com/reset',
        expiresIn: '1 uur',
      })

      expect(email.html).toContain('Heeft u dit verzoek niet gedaan')
    })
  })

  describe('documentUploadedEmail', () => {
    it('should generate valid document uploaded email', () => {
      const email = documentUploadedEmail({
        userName: 'Jan Jansen',
        documentName: 'BENG Berekening.pdf',
        documentType: 'PDF',
        propertyName: 'Villa Zonneweide',
        viewUrl: 'https://helder.nl/dashboard/documents/123',
      })

      expect(email.subject).toContain('BENG Berekening.pdf')
      expect(email.html).toContain('Villa Zonneweide')
      expect(email.html).toContain('PDF')
      expect(email.html).toContain('Opgeslagen')
    })
  })

  describe('phaseCompletedEmail', () => {
    it('should generate valid phase completed email', () => {
      const email = phaseCompletedEmail({
        userName: 'Jan Jansen',
        phaseName: 'Fundering',
        propertyName: 'Villa Zonneweide',
        progress: 35,
        nextPhase: 'Ruwbouw',
        viewUrl: 'https://helder.nl/dashboard/timeline',
      })

      expect(email.subject).toContain('Fundering')
      expect(email.subject).toContain('35%')
      expect(email.html).toContain('Ruwbouw')
      expect(email.html).toContain('35%')
    })

    it('should work without next phase', () => {
      const email = phaseCompletedEmail({
        userName: 'Jan',
        phaseName: 'Oplevering',
        propertyName: 'Test Property',
        progress: 100,
        viewUrl: 'https://helder.nl/dashboard',
      })

      expect(email.html).toContain('100%')
    })
  })

  describe('issueAlertEmail', () => {
    it('should generate valid issue alert email', () => {
      const email = issueAlertEmail({
        userName: 'Bouwer Bakker',
        issueTitle: 'Vochtschade gedetecteerd',
        severity: 'high',
        projectName: 'Villa Zonneweide',
        description: 'Vochtplekken zichtbaar in zuidmuur',
        viewUrl: 'https://helder.nl/builder/issues/123',
      })

      expect(email.subject).toContain('⚠️')
      expect(email.subject).toContain('Vochtschade gedetecteerd')
      expect(email.html).toContain('Hoog')
      expect(email.html).toContain('Villa Zonneweide')
    })

    it('should handle all severity levels', () => {
      const severities = ['low', 'medium', 'high', 'critical'] as const
      
      severities.forEach(severity => {
        const email = issueAlertEmail({
          userName: 'Test',
          issueTitle: 'Test Issue',
          severity,
          projectName: 'Test Project',
          viewUrl: 'https://example.com',
        })
        
        expect(email.html).toBeTruthy()
      })
    })
  })

  describe('shareLinkEmail', () => {
    it('should generate valid share link email', () => {
      const email = shareLinkEmail({
        userName: 'Jan Jansen',
        propertyName: 'Villa Zonneweide',
        shareUrl: 'https://helder.nl/share/abc123',
        expiresAt: '31 december 2025',
        accessLevel: 'standard',
      })

      expect(email.subject).toContain('Villa Zonneweide')
      expect(email.html).toContain('https://helder.nl/share/abc123')
      expect(email.html).toContain('Standaard')
      expect(email.html).toContain('31 december 2025')
    })

    it('should handle all access levels', () => {
      const levels = ['basic', 'standard', 'full', 'buyer'] as const
      
      levels.forEach(level => {
        const email = shareLinkEmail({
          userName: 'Test',
          propertyName: 'Test Property',
          shareUrl: 'https://example.com/share/test',
          accessLevel: level,
        })
        
        expect(email.html).toBeTruthy()
      })
    })
  })

  describe('weeklySummaryEmail', () => {
    it('should generate valid weekly summary email', () => {
      const email = weeklySummaryEmail({
        userName: 'Jan Jansen',
        propertyName: 'Villa Zonneweide',
        progress: 65,
        newDocuments: 12,
        completedTasks: 3,
        upcomingTasks: ['Dakbedekking', 'Kozijnen plaatsen'],
        viewUrl: 'https://helder.nl/dashboard',
      })

      expect(email.subject).toContain('65%')
      expect(email.html).toContain('12')
      expect(email.html).toContain('Dakbedekking')
      expect(email.html).toContain('Kozijnen plaatsen')
    })

    it('should handle empty upcoming tasks', () => {
      const email = weeklySummaryEmail({
        userName: 'Test',
        propertyName: 'Test Property',
        progress: 100,
        newDocuments: 0,
        completedTasks: 0,
        upcomingTasks: [],
        viewUrl: 'https://example.com',
      })

      expect(email.html).toBeTruthy()
      expect(email.html).not.toContain('<li>')
    })
  })

  describe('builderDailyDigestEmail', () => {
    it('should generate valid builder daily digest email', () => {
      const email = builderDailyDigestEmail({
        userName: 'Bouwer Bakker',
        companyName: 'Bakker Bouw B.V.',
        totalProjects: 5,
        totalPhotosToday: 23,
        totalIssues: 2,
        projects: [
          { name: 'Villa Zonneweide', newPhotos: 12, issues: 0, phase: 'Afbouw' },
          { name: 'Kavel 24', newPhotos: 11, issues: 2, phase: 'Ruwbouw' },
        ],
        viewUrl: 'https://helder.nl/builder/dashboard',
      })

      expect(email.subject).toContain('23')
      expect(email.subject).toContain('2 issues')
      expect(email.html).toContain('Bakker Bouw B.V.')
      expect(email.html).toContain('Villa Zonneweide')
      expect(email.html).toContain('Afbouw')
    })

    it('should handle empty project list', () => {
      const email = builderDailyDigestEmail({
        userName: 'Test',
        companyName: 'Test Company',
        totalProjects: 0,
        totalPhotosToday: 0,
        totalIssues: 0,
        projects: [],
        viewUrl: 'https://example.com',
      })

      expect(email.html).toBeTruthy()
    })
  })
})

describe('Email Template Structure', () => {
  it('all emails should contain Helder branding', () => {
    const emails = [
      welcomeEmail({ userName: 'Test', loginUrl: 'https://test.com' }),
      passwordResetEmail({ userName: 'Test', resetUrl: 'https://test.com', expiresIn: '1h' }),
      documentUploadedEmail({
        userName: 'Test',
        documentName: 'test.pdf',
        documentType: 'PDF',
        propertyName: 'Test',
        viewUrl: 'https://test.com',
      }),
    ]

    emails.forEach(email => {
      expect(email.html).toContain('HELDER')
      expect(email.html).toContain('#93b9e6') // Brand color
      expect(email.html).toContain('© ') // Copyright
    })
  })

  it('all emails should have valid HTML structure', () => {
    const email = welcomeEmail({ userName: 'Test', loginUrl: 'https://test.com' })
    
    expect(email.html).toContain('<!DOCTYPE html>')
    expect(email.html).toContain('<html')
    expect(email.html).toContain('</html>')
    expect(email.html).toContain('<head>')
    expect(email.html).toContain('</head>')
    expect(email.html).toContain('<body>')
    expect(email.html).toContain('</body>')
  })
})
