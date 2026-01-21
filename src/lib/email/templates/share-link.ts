import { baseTemplate } from './base'

interface ShareLinkEmailProps {
  userName: string
  propertyName: string
  shareUrl: string
  expiresAt?: string
  accessLevel: 'basic' | 'standard' | 'full' | 'buyer'
}

const ACCESS_LEVEL_INFO = {
  basic: { label: 'Basis', description: 'Overzicht en energielabel' },
  standard: { label: 'Standaard', description: 'Documenten en tijdlijn' },
  full: { label: 'Volledig', description: 'Alle informatie inclusief kosten' },
  buyer: { label: 'Koper', description: 'Volledige koperspakket' },
}

export function shareLinkEmail({ 
  userName, 
  propertyName, 
  shareUrl, 
  expiresAt,
  accessLevel 
}: ShareLinkEmailProps) {
  const accessInfo = ACCESS_LEVEL_INFO[accessLevel]
  
  const content = `
    <h1>Deellink Aangemaakt</h1>
    <p>Beste ${userName},</p>
    <p>
      U heeft een deellink aangemaakt voor uw Woningpaspoort van <strong>${propertyName}</strong>. 
      Deze link kan worden gedeeld met geïnteresseerde partijen.
    </p>
    
    <div class="card">
      <p class="card-title">Link Details</p>
      <table style="width: 100%; margin-top: 12px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Toegangsniveau:</td>
          <td style="padding: 8px 0;"><span class="badge badge-info">${accessInfo.label}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Inhoud:</td>
          <td style="padding: 8px 0; color: #475569;">${accessInfo.description}</td>
        </tr>
        ${expiresAt ? `
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Geldig tot:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1a1a2e;">${expiresAt}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <p style="font-size: 14px; color: #475569; background-color: #f8fafc; padding: 12px; word-break: break-all;">
      ${shareUrl}
    </p>
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${shareUrl}" class="button">Bekijk Deelpagina</a>
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      U kunt deze link op elk moment deactiveren via uw dashboard onder "Delen".
    </p>
  `

  return {
    subject: `Deellink aangemaakt voor ${propertyName}`,
    html: baseTemplate(content, `Uw deellink voor ${propertyName} is klaar.`),
  }
}
