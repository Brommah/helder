import { baseTemplate } from './base'

interface DocumentUploadedEmailProps {
  userName: string
  documentName: string
  documentType: string
  propertyName: string
  viewUrl: string
}

export function documentUploadedEmail({ 
  userName, 
  documentName, 
  documentType, 
  propertyName, 
  viewUrl 
}: DocumentUploadedEmailProps) {
  const content = `
    <h1>Document Toegevoegd</h1>
    <p>Beste ${userName},</p>
    <p>
      Er is een nieuw document toegevoegd aan uw Woningpaspoort voor <strong>${propertyName}</strong>.
    </p>
    
    <div class="card">
      <p class="card-title">Document Details</p>
      <table style="width: 100%; margin-top: 12px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Naam:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1a1a2e;">${documentName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Type:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1a1a2e;">${documentType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
          <td style="padding: 8px 0;"><span class="badge badge-success">Opgeslagen</span></td>
        </tr>
      </table>
    </div>
    
    <p>
      Bekijk het document in uw dashboard om de details te verifiëren.
    </p>
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${viewUrl}" class="button">Bekijk Document</a>
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      Dit document wordt automatisch blockchain-beveiligd voor maximale integriteit.
    </p>
  `

  return {
    subject: `Nieuw document toegevoegd: ${documentName}`,
    html: baseTemplate(content, `Document "${documentName}" is toegevoegd aan uw Woningpaspoort.`),
  }
}
