import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ProgressByPhase {
  phase: string;
  phaseName: string;
  documentCount: number;
  avgQuality: number;
  issues: string[];
  attentionPoints: string[];
  materials: string[];
  lastUpdate: string;
}

/**
 * Get progress report data for a project
 * GET /api/reports/progress?projectId=xxx&format=json|html
 */
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get('projectId') || 'proj_villa_zonneweide_ams';
    const format = req.nextUrl.searchParams.get('format') || 'json';
    const fromDate = req.nextUrl.searchParams.get('from');
    const toDate = req.nextUrl.searchParams.get('to');

    // Build date filter
    const dateFilter: any = {};
    if (fromDate) dateFilter.gte = new Date(fromDate);
    if (toDate) dateFilter.lte = new Date(toDate);

    // Fetch project info
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        Property: true,
      },
    });

    // Fetch all documents with AI classification
    const documents = await db.document.findMany({
      where: {
        projectId,
        source: 'WHATSAPP',
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        extractedData: true,
        fileUrl: true,
      },
    });

    // Aggregate by phase
    const phaseMap = new Map<string, ProgressByPhase>();
    const allIssues: string[] = [];
    const allAttentionPoints: string[] = [];
    const allMaterials: string[] = [];
    let totalQuality = 0;
    let qualityCount = 0;

    for (const doc of documents) {
      const extractedData = doc.extractedData as any;
      const ai = extractedData?.aiClassification;

      if (!ai) continue;

      const phase = ai.phase || 'UNKNOWN';
      const phaseName = ai.phaseName || phase;

      if (!phaseMap.has(phase)) {
        phaseMap.set(phase, {
          phase,
          phaseName,
          documentCount: 0,
          avgQuality: 0,
          issues: [],
          attentionPoints: [],
          materials: [],
          lastUpdate: doc.createdAt.toISOString(),
        });
      }

      const phaseData = phaseMap.get(phase)!;
      phaseData.documentCount++;

      if (ai.quality?.score) {
        totalQuality += ai.quality.score;
        qualityCount++;
      }

      if (ai.quality?.issues) {
        phaseData.issues.push(...ai.quality.issues);
        allIssues.push(...ai.quality.issues);
      }

      if (ai.attentionPoints) {
        phaseData.attentionPoints.push(...ai.attentionPoints);
        allAttentionPoints.push(...ai.attentionPoints);
      }

      if (ai.materials) {
        const matNames = ai.materials.map((m: any) => m.name);
        phaseData.materials.push(...matNames);
        allMaterials.push(...matNames);
      }

      // Update last update if newer
      if (new Date(doc.createdAt) > new Date(phaseData.lastUpdate)) {
        phaseData.lastUpdate = doc.createdAt.toISOString();
      }
    }

    // Calculate average quality per phase
    const phases = Array.from(phaseMap.values()).map(p => ({
      ...p,
      issues: [...new Set(p.issues)],
      attentionPoints: [...new Set(p.attentionPoints)],
      materials: [...new Set(p.materials)],
    }));

    // Build report data
    const report = {
      generatedAt: new Date().toISOString(),
      period: {
        from: fromDate || documents[documents.length - 1]?.createdAt?.toISOString() || null,
        to: toDate || documents[0]?.createdAt?.toISOString() || null,
      },
      project: {
        id: projectId,
        name: project?.name || 'Onbekend project',
        property: project?.Property ? `${project.Property.street || ''} ${project.Property.houseNumber || ''}, ${project.Property.city}`.trim() : null,
      },
      summary: {
        totalDocuments: documents.length,
        totalPhases: phases.length,
        avgQuality: qualityCount > 0 ? Math.round((totalQuality / qualityCount) * 10) / 10 : null,
        totalIssues: allIssues.length,
        totalAttentionPoints: allAttentionPoints.length,
        uniqueMaterials: [...new Set(allMaterials)].length,
      },
      phases,
      issues: [...new Set(allIssues)],
      attentionPoints: [...new Set(allAttentionPoints)],
      materials: [...new Set(allMaterials)],
      recentDocuments: documents.slice(0, 10).map(d => ({
        id: d.id,
        name: d.name,
        date: d.createdAt.toISOString(),
        phase: (d.extractedData as any)?.aiClassification?.phaseName || 'Onbekend',
      })),
    };

    if (format === 'html') {
      return new NextResponse(generateHTMLReport(report), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('[Progress Report API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate HTML report for printing/PDF
 */
function generateHTMLReport(report: any): string {
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voortgangsrapport - ${report.project.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; max-width: 900px; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    h2 { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 3px solid #93b9e6; }
    h3 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 16px 0 8px; }
    .header { margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; }
    .meta { color: #64748b; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .stat { background: #f8fafc; padding: 16px; }
    .stat-value { font-size: 32px; font-weight: 900; color: #1e293b; }
    .stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; }
    .phase { background: #f8fafc; padding: 16px; margin-bottom: 12px; border-left: 4px solid #93b9e6; }
    .phase-header { display: flex; justify-content: space-between; align-items: center; }
    .phase-name { font-weight: 700; }
    .phase-count { background: #93b9e6; color: #1e293b; padding: 2px 8px; font-size: 12px; font-weight: 700; }
    .issues { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 16px 0; }
    .issues h3 { color: #dc2626; }
    .attention { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; }
    .attention h3 { color: #d97706; }
    ul { padding-left: 20px; margin: 8px 0; }
    li { margin: 4px 0; }
    .materials { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0; }
    .material { background: #e2e8f0; padding: 4px 12px; font-size: 12px; font-weight: 600; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    .quality-good { color: #16a34a; }
    .quality-medium { color: #ca8a04; }
    .quality-bad { color: #dc2626; }
    @media print {
      body { padding: 20px; }
      .phase { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Voortgangsrapport</h1>
    <p class="meta">${report.project.name}</p>
    <p class="meta">Periode: ${report.period.from ? formatDate(report.period.from) : '-'} - ${report.period.to ? formatDate(report.period.to) : '-'}</p>
    <p class="meta">Gegenereerd: ${formatDate(report.generatedAt)}</p>
  </div>

  <h2>Samenvatting</h2>
  <div class="grid">
    <div class="stat">
      <div class="stat-value">${report.summary.totalDocuments}</div>
      <div class="stat-label">Foto's</div>
    </div>
    <div class="stat">
      <div class="stat-value">${report.summary.totalPhases}</div>
      <div class="stat-label">Fases</div>
    </div>
    <div class="stat">
      <div class="stat-value ${report.summary.avgQuality >= 7 ? 'quality-good' : report.summary.avgQuality >= 5 ? 'quality-medium' : 'quality-bad'}">${report.summary.avgQuality || '-'}</div>
      <div class="stat-label">Gem. Kwaliteit</div>
    </div>
    <div class="stat">
      <div class="stat-value">${report.summary.uniqueMaterials}</div>
      <div class="stat-label">Materialen</div>
    </div>
  </div>

  ${report.issues.length > 0 ? `
  <div class="issues">
    <h3>⚠️ Openstaande Issues (${report.issues.length})</h3>
    <ul>
      ${report.issues.map((i: string) => `<li>${i}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  ${report.attentionPoints.length > 0 ? `
  <div class="attention">
    <h3>🔔 Aandachtspunten (${report.attentionPoints.length})</h3>
    <ul>
      ${report.attentionPoints.map((a: string) => `<li>${a}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <h2>Voortgang per Fase</h2>
  ${report.phases.map((p: any) => `
  <div class="phase">
    <div class="phase-header">
      <span class="phase-name">🏗️ ${p.phaseName}</span>
      <span class="phase-count">${p.documentCount} foto's</span>
    </div>
    ${p.materials.length > 0 ? `
    <div class="materials">
      ${p.materials.slice(0, 8).map((m: string) => `<span class="material">${m}</span>`).join('')}
    </div>
    ` : ''}
    ${p.issues.length > 0 ? `<p style="color: #dc2626; font-size: 13px; margin-top: 8px;">⚠️ ${p.issues.join(' | ')}</p>` : ''}
  </div>
  `).join('')}

  <h2>Gebruikte Materialen</h2>
  <div class="materials">
    ${report.materials.map((m: string) => `<span class="material">${m}</span>`).join('')}
  </div>

  <div class="footer">
    <p>Dit rapport is automatisch gegenereerd door Helder AI op basis van ${report.summary.totalDocuments} ingediende foto's.</p>
    <p>Powered by Helder - Woningpaspoort Platform</p>
  </div>
</body>
</html>
  `;
}
