import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Get shared property data by token
 * GET /api/share/[token]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Handle demo token
    if (token === 'demo') {
      return NextResponse.json({
        property: {
          id: 'demo-property-1',
          name: 'Villa Zonneweide',
          address: 'Kavel 12, De Buitenplaats, Almere',
          type: 'Vrijstaande nieuwbouwwoning',
          size: 210,
          plot: 650,
          rooms: 5,
          bathrooms: 2,
          buildYear: '2025-2026',
          energy: 'A++++',
          owner: 'Familie Van der Berg',
          builder: 'Helder Engineering',
          progress: 100,
          currentPhase: 'Opgeleverd',
          verifiedDocs: 156,
          totalDocs: 156,
          blockchainId: '0x7f3a...b2c4',
          isDemo: true,
        },
        documents: [
          { name: 'Bouwvergunning', category: 'Vergunningen', verified: true },
          { name: 'BENG Berekening', category: 'Energie', verified: true },
          { name: 'Constructieberekening', category: 'Berekeningen', verified: true },
          { name: 'Materiaalspecificaties', category: 'Materialen', verified: true },
          { name: 'Garantiecertificaten', category: 'Garanties', verified: true },
        ],
        timeline: [
          { phase: 'Fundering', status: 'completed', date: 'Sep 2024' },
          { phase: 'Ruwbouw', status: 'completed', date: 'Nov 2024' },
          { phase: 'Gevel & Dak', status: 'completed', date: 'Jan 2025' },
          { phase: 'Installaties', status: 'completed', date: 'Mrt 2025' },
          { phase: 'Afbouw', status: 'completed', date: 'Mei 2025' },
          { phase: 'Oplevering', status: 'completed', date: 'Jul 2025' },
        ],
        highlights: [
          { label: 'Energielabel', value: 'A++++' },
          { label: 'Isolatie', value: 'Rc 8.0' },
          { label: 'Zonnepanelen', value: '9.6 kWp' },
          { label: 'Ventilatie', value: 'WTW 95%' },
        ],
      });
    }

    // Find the property share by token
    const share = await db.propertyShare.findUnique({
      where: { token },
      include: {
        Property: {
          include: {
            Document: {
              where: { verified: true },
              take: 10,
              orderBy: { createdAt: 'desc' },
            },
            Project: {
              include: {
                ProjectPhase: {
                  orderBy: { order: 'asc' },
                },
              },
            },
            CostBreakdown: true,
            User: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!share) {
      return NextResponse.json({ error: 'Invalid share token' }, { status: 404 });
    }

    // Check if share has expired
    if (share.expiresAt && new Date() > share.expiresAt) {
      return NextResponse.json({ error: 'Share link has expired' }, { status: 410 });
    }

    // Check max views
    if (share.maxViews && share.viewCount >= share.maxViews) {
      return NextResponse.json({ error: 'Share link has reached maximum views' }, { status: 410 });
    }

    // Increment view count
    await db.propertyShare.update({
      where: { id: share.id },
      data: { viewCount: { increment: 1 } },
    });

    const property = share.Property;
    const project = property.Project[0];

    // Build timeline from project phases
    const timeline = project?.ProjectPhase.map((phase) => ({
      phase: phase.name,
      status: phase.status === 'COMPLETED' ? 'completed' :
              phase.status === 'IN_PROGRESS' ? 'current' : 'upcoming',
      date: phase.actualEnd?.toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' }) ||
            phase.plannedEnd?.toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' }) || '',
      progress: phase.status === 'IN_PROGRESS' ? 50 : undefined,
    })) || [];

    // Calculate progress
    const completedPhases = timeline.filter(t => t.status === 'completed').length;
    const progress = timeline.length > 0 ? Math.round((completedPhases / timeline.length) * 100) : 0;

    // Format energy label
    const energyLabels: Record<string, string> = {
      'A_PLUS_PLUS_PLUS_PLUS': 'A++++',
      'A_PLUS_PLUS_PLUS': 'A+++',
      'A_PLUS_PLUS': 'A++',
      'A_PLUS': 'A+',
      'A': 'A',
      'B': 'B',
      'C': 'C',
      'D': 'D',
      'E': 'E',
      'F': 'F',
      'G': 'G',
    };

    return NextResponse.json({
      property: {
        id: property.id,
        name: property.name || property.projectName || 'Woning',
        address: [
          property.kavelNumber || property.street,
          property.houseNumber,
          property.projectName,
          property.city,
        ].filter(Boolean).join(', '),
        type: property.propertyType?.replace(/_/g, ' ') || 'Woning',
        size: property.woonoppervlakte,
        plot: property.perceelOppervlakte,
        rooms: property.aantalKamers,
        bathrooms: 2, // TODO: Add to schema
        buildYear: property.bouwjaar?.toString() ||
                   `${property.startDate?.getFullYear() || '2025'}-${property.expectedEnd?.getFullYear() || '2026'}`,
        energy: property.energielabel ? energyLabels[property.energielabel] || property.energielabel : null,
        owner: property.User?.name || 'Eigenaar',
        builder: project?.Company?.name || 'Helder Engineering',
        progress,
        currentPhase: project?.ProjectPhase.find(p => p.status === 'IN_PROGRESS')?.name || 
                      (progress === 100 ? 'Opgeleverd' : 'In uitvoering'),
        verifiedDocs: property.Document.filter(d => d.verified).length,
        totalDocs: property.Document.length,
        blockchainId: property.cereVaultId || (property.verificationBadge ? '0x' + property.id.substring(0, 8) + '...' : null),
        isDemo: false,
      },
      documents: share.showDocuments ? property.Document.map(doc => ({
        name: doc.name,
        category: doc.type.replace(/_/g, ' '),
        verified: doc.verified,
      })) : [],
      timeline: share.showTimeline ? timeline : [],
      highlights: [
        { label: 'Energielabel', value: property.energielabel ? energyLabels[property.energielabel] : '-' },
        { label: 'Isolatie', value: 'Rc 8.0' }, // TODO: Store actual values
        { label: 'Oppervlakte', value: property.woonoppervlakte ? `${property.woonoppervlakte} m²` : '-' },
        { label: 'Perceel', value: property.perceelOppervlakte ? `${property.perceelOppervlakte} m²` : '-' },
      ],
      accessLevel: share.accessLevel,
      showFinancials: share.showFinancials,
    });
  } catch (error) {
    console.error('[Share API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
