import { baseTemplate } from './base'

interface WeeklySummaryEmailProps {
  userName: string
  propertyName: string
  progress: number
  newDocuments: number
  completedTasks: number
  upcomingTasks: string[]
  viewUrl: string
}

export function weeklySummaryEmail({ 
  userName, 
  propertyName, 
  progress,
  newDocuments,
  completedTasks,
  upcomingTasks,
  viewUrl 
}: WeeklySummaryEmailProps) {
  const content = `
    <h1>Wekelijks Overzicht</h1>
    <p>Beste ${userName},</p>
    <p>
      Hier is uw wekelijkse update voor <strong>${propertyName}</strong>.
    </p>
    
    <div style="display: flex; gap: 12px; margin: 24px 0;">
      <div class="card" style="flex: 1; text-align: center;">
        <p class="card-title">Voortgang</p>
        <p class="card-value" style="color: #93b9e6;">${progress}%</p>
      </div>
      <div class="card" style="flex: 1; text-align: center;">
        <p class="card-title">Documenten</p>
        <p class="card-value">+${newDocuments}</p>
      </div>
      <div class="card" style="flex: 1; text-align: center;">
        <p class="card-title">Voltooid</p>
        <p class="card-value" style="color: #16a34a;">${completedTasks}</p>
      </div>
    </div>
    
    ${upcomingTasks.length > 0 ? `
    <h2>Aankomende Taken</h2>
    <ul style="padding-left: 20px; color: #475569;">
      ${upcomingTasks.map(task => `<li style="margin-bottom: 8px;">${task}</li>`).join('')}
    </ul>
    ` : ''}
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${viewUrl}" class="button">Bekijk Dashboard</a>
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      U ontvangt deze e-mail wekelijks. 
      <a href="${viewUrl}/settings" class="highlight">Voorkeuren aanpassen</a>
    </p>
  `

  return {
    subject: `Wekelijks overzicht: ${propertyName} - ${progress}% voltooid`,
    html: baseTemplate(content, `Uw wekelijkse update voor ${propertyName}.`),
  }
}
