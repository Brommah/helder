import { baseTemplate } from './base'

interface PhaseCompletedEmailProps {
  userName: string
  phaseName: string
  propertyName: string
  progress: number
  nextPhase?: string
  viewUrl: string
}

export function phaseCompletedEmail({ 
  userName, 
  phaseName, 
  propertyName, 
  progress,
  nextPhase,
  viewUrl 
}: PhaseCompletedEmailProps) {
  const content = `
    <h1>🎉 Fase Afgerond!</h1>
    <p>Beste ${userName},</p>
    <p>
      Geweldig nieuws! De <strong>${phaseName}</strong> fase voor uw woning 
      <strong>${propertyName}</strong> is succesvol afgerond.
    </p>
    
    <div class="card">
      <p class="card-title">Voortgang</p>
      <p class="card-value">${progress}%</p>
      <div style="background-color: #e2e8f0; height: 8px; margin-top: 12px;">
        <div style="background-color: #93b9e6; height: 8px; width: ${progress}%;"></div>
      </div>
    </div>
    
    ${nextPhase ? `
    <div class="card">
      <p class="card-title">Volgende Fase</p>
      <p style="margin: 8px 0 0 0; font-weight: 600; color: #1a1a2e;">${nextPhase}</p>
    </div>
    ` : ''}
    
    <p>
      Alle documentatie van deze fase is opgeslagen in uw Woningpaspoort.
    </p>
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${viewUrl}" class="button">Bekijk Voortgang</a>
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      Heeft u vragen over de bouw? Neem contact op met uw aannemer of bekijk de tijdlijn in uw dashboard.
    </p>
  `

  return {
    subject: `Fase "${phaseName}" afgerond - ${progress}% voltooid`,
    html: baseTemplate(content, `De ${phaseName} fase is afgerond. Uw woning is nu ${progress}% klaar.`),
  }
}
