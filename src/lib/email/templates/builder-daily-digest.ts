import { baseTemplate } from './base'

interface ProjectUpdate {
  name: string
  newPhotos: number
  issues: number
  phase: string
}

interface BuilderDailyDigestEmailProps {
  userName: string
  companyName: string
  totalProjects: number
  totalPhotosToday: number
  totalIssues: number
  projects: ProjectUpdate[]
  viewUrl: string
}

export function builderDailyDigestEmail({ 
  userName, 
  companyName,
  totalProjects,
  totalPhotosToday,
  totalIssues,
  projects,
  viewUrl 
}: BuilderDailyDigestEmailProps) {
  const content = `
    <h1>Dagelijks Overzicht</h1>
    <p>Beste ${userName},</p>
    <p>
      Hier is uw dagelijkse samenvatting voor <strong>${companyName}</strong>.
    </p>
    
    <div style="display: flex; gap: 12px; margin: 24px 0;">
      <div class="card" style="flex: 1; text-align: center;">
        <p class="card-title">Projecten</p>
        <p class="card-value">${totalProjects}</p>
      </div>
      <div class="card" style="flex: 1; text-align: center;">
        <p class="card-title">Foto's Vandaag</p>
        <p class="card-value" style="color: #93b9e6;">+${totalPhotosToday}</p>
      </div>
      <div class="card" style="flex: 1; text-align: center;">
        <p class="card-title">Open Issues</p>
        <p class="card-value" style="color: ${totalIssues > 0 ? '#d97706' : '#16a34a'};">${totalIssues}</p>
      </div>
    </div>
    
    ${projects.length > 0 ? `
    <h2>Project Updates</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f8fafc;">
          <th style="padding: 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Project</th>
          <th style="padding: 12px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Fase</th>
          <th style="padding: 12px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Foto's</th>
          <th style="padding: 12px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Issues</th>
        </tr>
      </thead>
      <tbody>
        ${projects.map(p => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: 600; color: #1a1a2e;">${p.name}</td>
          <td style="padding: 12px; text-align: center;"><span class="badge badge-info">${p.phase}</span></td>
          <td style="padding: 12px; text-align: center; color: ${p.newPhotos > 0 ? '#93b9e6' : '#94a3b8'};">+${p.newPhotos}</td>
          <td style="padding: 12px; text-align: center; color: ${p.issues > 0 ? '#d97706' : '#16a34a'};">${p.issues}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}
    
    <p style="text-align: center; margin: 32px 0;">
      <a href="${viewUrl}" class="button">Naar Builder Portal</a>
    </p>
    
    <div class="divider"></div>
    
    <p style="font-size: 14px; color: #94a3b8;">
      U ontvangt deze e-mail dagelijks op werkdagen. 
      <a href="${viewUrl}/settings" class="highlight">Voorkeuren aanpassen</a>
    </p>
  `

  return {
    subject: `Dagelijks overzicht: ${totalPhotosToday} foto's, ${totalIssues} issues`,
    html: baseTemplate(content, `Dagelijkse update: ${totalPhotosToday} nieuwe foto's vandaag.`),
  }
}
