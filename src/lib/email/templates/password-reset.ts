import { baseTemplate } from './base'

interface PasswordResetEmailProps {
  userName: string
  resetUrl: string
  expiresIn: string
}

export function passwordResetEmail({ userName, resetUrl, expiresIn }: PasswordResetEmailProps) {
  const content = `
    <h1>Wachtwoord Resetten</h1>
    <p>Beste ${userName},</p>
    <p>
      We hebben een verzoek ontvangen om uw wachtwoord te resetten. 
      Klik op de onderstaande knop om een nieuw wachtwoord in te stellen.
    </p>
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="button">Reset Wachtwoord</a>
    </p>
    
    <div class="card">
      <p style="margin: 0; font-size: 14px; color: #475569;">
        <strong>Let op:</strong> Deze link is ${expiresIn} geldig. 
        Na verlopen kunt u een nieuwe aanvraag doen.
      </p>
    </div>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      Heeft u dit verzoek niet gedaan? Dan kunt u deze e-mail negeren. 
      Uw wachtwoord blijft ongewijzigd.
    </p>
    
    <p style="font-size: 14px; color: #94a3b8;">
      Voor vragen, neem contact op via <a href="mailto:support@helder.nl" class="highlight">support@helder.nl</a>
    </p>
  `

  return {
    subject: 'Reset uw wachtwoord - Helder',
    html: baseTemplate(content, 'Klik hier om uw wachtwoord te resetten.'),
  }
}
