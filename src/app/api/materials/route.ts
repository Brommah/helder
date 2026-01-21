import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface MaterialSpec {
  name: string;
  type?: string;
  brand?: string;
  color?: string;
  dimensions?: string;
  quantity?: string;
}

interface AggregatedMaterial {
  name: string;
  type?: string;
  brand?: string;
  color?: string;
  dimensions?: string;
  totalQuantity: string;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  phase: string;
  documents: { id: string; name: string; date: string }[];
}

/**
 * Get aggregated materials inventory for a project
 * GET /api/materials?projectId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get('projectId') || 'proj_villa_zonneweide_ams';

    // Fetch all documents with AI classification data
    const documents = await db.document.findMany({
      where: {
        projectId,
        source: 'WHATSAPP',
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        extractedData: true,
      },
    });

    // Aggregate materials from all documents
    const materialsMap = new Map<string, AggregatedMaterial>();

    for (const doc of documents) {
      const extractedData = doc.extractedData as any;
      const aiClassification = extractedData?.aiClassification;

      if (!aiClassification?.materials) continue;

      const materials = aiClassification.materials as MaterialSpec[];
      const phase = aiClassification.phaseName || aiClassification.phase || 'Onbekend';

      for (const mat of materials) {
        const key = `${mat.name.toLowerCase()}-${mat.type || ''}-${mat.brand || ''}`;

        if (materialsMap.has(key)) {
          const existing = materialsMap.get(key)!;
          existing.occurrences++;
          existing.lastSeen = doc.createdAt.toISOString();
          existing.documents.push({
            id: doc.id,
            name: doc.name,
            date: doc.createdAt.toISOString(),
          });
          // Try to aggregate quantities
          if (mat.quantity) {
            existing.totalQuantity = combineQuantities(existing.totalQuantity, mat.quantity);
          }
        } else {
          materialsMap.set(key, {
            name: mat.name,
            type: mat.type,
            brand: mat.brand,
            color: mat.color,
            dimensions: mat.dimensions,
            totalQuantity: mat.quantity || '-',
            occurrences: 1,
            firstSeen: doc.createdAt.toISOString(),
            lastSeen: doc.createdAt.toISOString(),
            phase,
            documents: [{
              id: doc.id,
              name: doc.name,
              date: doc.createdAt.toISOString(),
            }],
          });
        }
      }
    }

    // Convert to array and sort by occurrences
    const materials = Array.from(materialsMap.values())
      .sort((a, b) => b.occurrences - a.occurrences);

    // Group by phase
    const byPhase = materials.reduce((acc, mat) => {
      if (!acc[mat.phase]) acc[mat.phase] = [];
      acc[mat.phase].push(mat);
      return acc;
    }, {} as Record<string, AggregatedMaterial[]>);

    // Summary stats
    const stats = {
      totalMaterials: materials.length,
      totalDocuments: documents.length,
      phases: Object.keys(byPhase).length,
      topMaterials: materials.slice(0, 5).map(m => m.name),
    };

    return NextResponse.json({
      materials,
      byPhase,
      stats,
    });
  } catch (error) {
    console.error('[Materials API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Try to combine quantity strings intelligently
 */
function combineQuantities(existing: string, newQty: string): string {
  if (existing === '-') return newQty;
  if (!newQty || newQty === '-') return existing;

  // Try to parse numbers
  const existingNum = parseFloat(existing.replace(/[^0-9.,]/g, '').replace(',', '.'));
  const newNum = parseFloat(newQty.replace(/[^0-9.,]/g, '').replace(',', '.'));

  if (!isNaN(existingNum) && !isNaN(newNum)) {
    // Extract unit from existing
    const unit = existing.replace(/[0-9.,\s]/g, '').trim();
    return `${existingNum + newNum}${unit ? ' ' + unit : ''}`;
  }

  // Can't combine, just note multiple
  return `${existing}, ${newQty}`;
}
