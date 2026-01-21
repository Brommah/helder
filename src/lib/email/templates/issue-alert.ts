import { baseTemplate } from './base'

interface IssueAlertEmailProps {
  userName: string
  issueTitle: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  projectName: string
  description?: string
  viewUrl: string
}

const SEVERITY_LABELS = {
  low: { label: 'Laag', badge: 'badge-info' },
  medium: { label: 'Gemiddeld', badge: 'badge-warning' },
  high: { label: 'Hoog', badge: 'badge-warning' },
  critical: { label: 'Kritiek', badge: 'badge-warning' },
}

export function issueAlertEmail({ 
  userName, 
  issueTitle, 
  severity, 
  projectName, 
  description,
  viewUrl 
}: IssueAlertEmailProps) {
  const severityInfo = SEVERITY_LABELS[severity]
  
  const content = `
    <h1>⚠️ Aandachtspunt Gedetecteerd</h1>
    <p>Beste ${userName},</p>
    <p>
      Onze AI heeft een aandachtspunt gedetecteerd bij project <strong>${projectName}</strong> 
      dat uw aandacht vereist.
    </p>
    
    <div class="card">
      <p class="card-title">Issue Details</p>
      <table style="width: 100%; margin-top: 12px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Titel:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #1a1a2e;">${issueTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Ernst:</td>
          <td style="padding: 8px 0;"><span class="badge ${severityInfo.badge}">${severityInfo.label}</span></td>
        </tr>
        ${description ? `
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Beschrijving:</td>
          <td style="padding: 8px 0; color: #475569;">${description}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <p>
      Bekijk de details in uw dashboard en onderneem de nodige actie.
    </p>
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${viewUrl}" class="button">Bekijk Issue</a>
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      Deze melding is automatisch gegenereerd door onze AI-gestuurde kwaliteitscontrole.
    </p>
  `

  return {
    subject: `⚠️ Aandachtspunt: ${issueTitle} - ${projectName}`,
    html: baseTemplate(content, `Er is een ${severityInfo.label.toLowerCase()} prioriteit issue gedetecteerd.`),
  }
}
