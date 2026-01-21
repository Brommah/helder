import { baseTemplate } from './base'

interface WelcomeEmailProps {
  userName: string
  loginUrl: string
}

export function welcomeEmail({ userName, loginUrl }: WelcomeEmailProps) {
  const content = `
    <h1>Welkom bij Helder</h1>
    <p>Beste ${userName},</p>
    <p>
      Bedankt voor uw registratie bij Helder. Uw persoonlijke Woningpaspoort is nu actief 
      en klaar om al uw bouwdocumentatie veilig op te slaan.
    </p>
    
    <div class="card">
      <p class="card-title">Wat u kunt verwachten</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #475569;">
        ✓ Volledige documentatie van uw woning<br>
        ✓ AI-gestuurde inzichten en onderhoudstips<br>
        ✓ Blockchain-beveiligde verificatie<br>
        ✓ Eenvoudig delen met kopers en makelaars
      </p>
    </div>
    
    <p>
      Log in op uw dashboard om uw woningpaspoort te bekijken en documenten toe te voegen.
    </p>
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${loginUrl}" class="button">Naar mijn Dashboard</a>
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      Heeft u vragen? Neem contact met ons op via <a href="mailto:support@helder.nl" class="highlight">support@helder.nl</a>
    </p>
  `

  return {
    subject: 'Welkom bij Helder - Uw Woningpaspoort is klaar',
    html: baseTemplate(content, 'Welkom bij Helder! Uw Woningpaspoort is nu actief.'),
  }
}
