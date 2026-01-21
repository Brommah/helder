/**
 * Auto-Phase Detection Service
 *
 * Analyzes recent photo classifications to detect construction phase transitions
 * and automatically advance project phases when completion indicators are present.
 */

import { db } from '@/lib/db';
import { ConstructionPhase } from '@prisma/client';
import type { ClassificationResult } from './classify-image';

// Extended construction phases for detailed detection
// Maps to the Prisma enum after analysis
export const CONSTRUCTION_PHASES_ORDERED = [
  'GRONDWERK',
  'FUNDERING',
  'RUWBOUW',
  'DAKCONSTRUCTIE',
  'GEVELWERK',
  'INSTALLATIES',
  'AFBOUW',
  'OPLEVERING',
] as const;

export type DetailedPhase = typeof CONSTRUCTION_PHASES_ORDERED[number];

// Phase detection keywords (Dutch)
export const PHASE_KEYWORDS: Record<DetailedPhase, string[]> = {
  GRONDWERK: [
    'grond', 'zand', 'klei', 'drainage', 'riool', 'bouwput',
    'graven', 'egaliseren', 'ontgraven', 'grondverzet', 'grondwater',
    'bouwrijp', 'heien', 'heipalen', 'sondering'
  ],
  FUNDERING: [
    'fundering', 'beton', 'wapening', 'bekisting', 'heipalen', 'poer',
    'funderingsplaat', 'betonvloer', 'storten', 'betonijzer', 'vloerisolatie',
    'kruipruimte', 'vloerplaat', 'ringbalk', 'constructie beton'
  ],
  RUWBOUW: [
    'metselwerk', 'baksteen', 'cellenbeton', 'muur', 'kozijn', 'vloer',
    'betonblokken', 'spouw', 'binnenmuur', 'buitenmuur', 'kalkzandsteen',
    'verdiepingsvloer', 'metselen', 'voegwerk', 'lateien', 'prefab'
  ],
  DAKCONSTRUCTIE: [
    'dakspant', 'gordingen', 'dakplaat', 'isolatie dak', 'spanten',
    'dakconstructie', 'nokgording', 'dakbeschot', 'dakhout', 'kapconstructie',
    'dakkapel', 'dakraam', 'dak hout', 'kepers', 'tengels'
  ],
  GEVELWERK: [
    'gevel', 'stucwerk', 'gevelbekleding', 'voegwerk', 'steenstrips',
    'gevelisolatie', 'buitenafwerking', 'rabatdelen', 'gevelbetimmering',
    'pleisterwerk', 'buitenstucwerk', 'kozijnafwerking', 'dorpels'
  ],
  INSTALLATIES: [
    'leiding', 'kabel', 'cv', 'warmtepomp', 'elektra', 'sanitair',
    'leidingwerk', 'bekabeling', 'verwarming', 'ventilatie', 'airco',
    'meterkast', 'leidingen', 'buizen', 'pvc', 'waterleiding', 'rioolleiding',
    'centrale verwarming', 'vloerverwarming', 'mechanische ventilatie'
  ],
  AFBOUW: [
    'stucen', 'schilderwerk', 'vloer afwerking', 'keuken', 'badkamer',
    'binnenstucwerk', 'latex', 'behangen', 'tegels', 'parket', 'laminaat',
    'plinten', 'binnendeuren', 'trappen', 'plafond', 'gipsplaten',
    'binnenkozijnen', 'sanitair montage', 'keuken montage'
  ],
  OPLEVERING: [
    'schoonmaak', 'opleverpunten', 'sleutels', 'eindcontrole',
    'oplevering', 'overdracht', 'keuring', 'inspectie', 'afgewerkt',
    'gebruiksklaar', 'gereed', 'voltooid', 'eindoplevering'
  ],
};

// Completion indicators per phase - what signals a phase is done
export const PHASE_COMPLETION_INDICATORS: Record<DetailedPhase, string[]> = {
  GRONDWERK: [
    'grond vlak', 'bouwput gereed', 'drainage geplaatst', 'ontgraving compleet',
    'bouwrijp', 'grondwerk afgerond', 'heien voltooid'
  ],
  FUNDERING: [
    'beton gestort', 'fundering droog', 'wapening zichtbaar', 'fundering gereed',
    'funderingsplaat droog', 'uitharden', 'fundering afgewerkt', 'vloer gestort'
  ],
  RUWBOUW: [
    'muren opgetrokken', 'verdiepingsvloer', 'kozijnen geplaatst', 'ruwbouw dicht',
    'metselwerk gereed', 'wind- en waterdicht', 'casco gereed', 'alle muren staan'
  ],
  DAKCONSTRUCTIE: [
    'dakspanten', 'dakbeschot', 'dakpannen', 'dak dicht', 'dakconstructie gereed',
    'kapconstructie voltooid', 'dakvlak gesloten', 'dak waterdicht'
  ],
  GEVELWERK: [
    'gevel afgewerkt', 'stucwerk gereed', 'gevelbekleding compleet',
    'voegwerk voltooid', 'buitenwerk gereed', 'gevel waterdicht'
  ],
  INSTALLATIES: [
    'leidingen getest', 'elektra aangesloten', 'cv geinstalleerd',
    'installaties getest', 'waterdicht', 'systemen werkend',
    'meterkast gereed', 'aansluiting actief'
  ],
  AFBOUW: [
    'afbouw gereed', 'keuken geplaatst', 'badkamer compleet',
    'schilderwerk klaar', 'vloeren gelegd', 'interieur afgewerkt',
    'binnen volledig afgewerkt'
  ],
  OPLEVERING: [
    'oplevering voltooid', 'sleuteloverdracht', 'project afgerond',
    'woning opgeleverd', 'eindkeuring goedgekeurd'
  ],
};

// Map detailed phases to Prisma enum phases
export function mapDetailedToDbPhase(phase: DetailedPhase): ConstructionPhase {
  const mapping: Record<DetailedPhase, ConstructionPhase> = {
    GRONDWERK: ConstructionPhase.GRONDWERK,
    FUNDERING: ConstructionPhase.GRONDWERK, // Currently grouped
    RUWBOUW: ConstructionPhase.RUWBOUW,
    DAKCONSTRUCTIE: ConstructionPhase.DAK_GEVEL,
    GEVELWERK: ConstructionPhase.DAK_GEVEL,
    INSTALLATIES: ConstructionPhase.INSTALLATIES,
    AFBOUW: ConstructionPhase.AFBOUW,
    OPLEVERING: ConstructionPhase.OPLEVERING,
  };
  return mapping[phase];
}

// Get next phase in sequence
export function getNextPhase(currentPhase: DetailedPhase): DetailedPhase | null {
  const index = CONSTRUCTION_PHASES_ORDERED.indexOf(currentPhase);
  if (index === -1 || index >= CONSTRUCTION_PHASES_ORDERED.length - 1) {
    return null;
  }
  return CONSTRUCTION_PHASES_ORDERED[index + 1];
}

// Get phase order number
export function getPhaseOrder(phase: DetailedPhase): number {
  return CONSTRUCTION_PHASES_ORDERED.indexOf(phase);
}

// Phase analysis result interface
export interface PhaseAnalysis {
  currentPhase: DetailedPhase;
  currentPhaseConfidence: number;
  detectedPhases: Array<{
    phase: DetailedPhase;
    count: number;
    confidence: number;
  }>;
  suggestedNextPhase: DetailedPhase | null;
  phaseCompletionIndicators: string[];
  readyToAdvance: boolean;
  advanceReason: string | null;
  recentPhotosAnalyzed: number;
  phaseHistory: Array<{
    phase: DetailedPhase;
    detectedAt: Date;
    documentId?: string;
  }>;
}

/**
 * Detect which phase a classification indicates based on keywords and elements
 */
export function detectPhaseFromClassification(
  classification: ClassificationResult
): { phase: DetailedPhase; confidence: number } | null {
  // First check the AI-detected phase
  const aiPhase = classification.phase;

  // Map AI phases to our detailed phases
  const aiPhaseMapping: Record<string, DetailedPhase> = {
    'GRONDWERK': 'GRONDWERK',
    'FUNDERING': 'FUNDERING',
    'RUWBOUW': 'RUWBOUW',
    'DAKCONSTRUCTIE': 'DAKCONSTRUCTIE',
    'DAKBEDEKKING': 'DAKCONSTRUCTIE',
    'GEVEL': 'GEVELWERK',
    'KOZIJNEN': 'RUWBOUW', // Kozijnen is typically part of ruwbouw
    'INSTALLATIES': 'INSTALLATIES',
    'AFBOUW': 'AFBOUW',
    'OPLEVERING': 'OPLEVERING',
  };

  // Start with AI detection
  let detectedPhase: DetailedPhase = aiPhaseMapping[aiPhase] || 'RUWBOUW';
  let confidence = classification.confidence;

  // Boost confidence based on keyword matching
  const allText = [
    classification.description,
    classification.category,
    classification.title,
    ...classification.detectedElements,
    ...(classification.materials?.map(m => `${m.name} ${m.type || ''}`)),
    ...(classification.technicalSpecs || []),
  ].join(' ').toLowerCase();

  // Find phase with most keyword matches
  let bestMatch: { phase: DetailedPhase; score: number } | null = null;

  for (const [phase, keywords] of Object.entries(PHASE_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (allText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { phase: phase as DetailedPhase, score };
    }
  }

  // If keyword matching gives a strong signal, use it
  if (bestMatch && bestMatch.score >= 2) {
    // If keywords match AI detection, boost confidence
    if (bestMatch.phase === detectedPhase) {
      confidence = Math.min(0.95, confidence + 0.1);
    } else {
      // Keywords suggest different phase - use keywords if score is high
      if (bestMatch.score >= 3) {
        detectedPhase = bestMatch.phase;
        confidence = Math.min(0.85, 0.5 + bestMatch.score * 0.1);
      }
    }
  }

  return { phase: detectedPhase, confidence };
}

/**
 * Check if completion indicators are present for a phase
 */
export function checkCompletionIndicators(
  phase: DetailedPhase,
  classifications: ClassificationResult[]
): string[] {
  const indicators = PHASE_COMPLETION_INDICATORS[phase];
  const foundIndicators: string[] = [];

  for (const classification of classifications) {
    const allText = [
      classification.description,
      classification.title,
      ...(classification.nextSteps || []),
      ...(classification.technicalSpecs || []),
      ...(classification.quality?.notes || []),
    ].join(' ').toLowerCase();

    for (const indicator of indicators) {
      if (allText.includes(indicator.toLowerCase()) && !foundIndicators.includes(indicator)) {
        foundIndicators.push(indicator);
      }
    }

    // Also check if work status indicates completion
    if (classification.workStatus === 'completed' && classification.phase === phase) {
      const completeIndicator = `${classification.title} voltooid`;
      if (!foundIndicators.includes(completeIndicator)) {
        foundIndicators.push(completeIndicator);
      }
    }

    // Check progress percentage
    if (classification.progressPercentage && classification.progressPercentage >= 90) {
      const progressIndicator = `Voortgang ${classification.progressPercentage}%`;
      if (!foundIndicators.includes(progressIndicator)) {
        foundIndicators.push(progressIndicator);
      }
    }
  }

  return foundIndicators;
}

/**
 * Analyze phase progress for a project based on recent classifications
 */
export async function analyzePhaseProgress(
  projectId: string,
  recentClassifications?: ClassificationResult[]
): Promise<PhaseAnalysis> {
  // If classifications not provided, fetch from recent documents
  let classifications = recentClassifications;

  if (!classifications) {
    // Get recent documents with AI classification data
    const recentDocs = await db.document.findMany({
      where: {
        projectId,
        source: 'WHATSAPP',
        NOT: { extractedData: { equals: undefined } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        extractedData: true,
      },
    });

    classifications = recentDocs
      .map(doc => {
        const data = doc.extractedData as { aiClassification?: ClassificationResult } | null;
        return data?.aiClassification;
      })
      .filter((c): c is ClassificationResult => c !== null && c !== undefined);
  }

  // Get current property phase
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      Property: {
        select: { currentPhase: true },
      },
    },
  });

  const dbCurrentPhase = project?.Property?.currentPhase;

  // Map DB phase to detailed phase (expand if needed)
  let currentDetailedPhase: DetailedPhase = 'GRONDWERK';
  if (dbCurrentPhase) {
    const reverseMapping: Record<ConstructionPhase, DetailedPhase> = {
      [ConstructionPhase.GRONDWERK]: 'GRONDWERK',
      [ConstructionPhase.FUNDERING]: 'FUNDERING',
      [ConstructionPhase.RUWBOUW]: 'RUWBOUW',
      [ConstructionPhase.DAKCONSTRUCTIE]: 'DAKCONSTRUCTIE',
      [ConstructionPhase.GEVELWERK]: 'GEVELWERK',
      [ConstructionPhase.DAK_GEVEL]: 'DAKCONSTRUCTIE',
      [ConstructionPhase.INSTALLATIES]: 'INSTALLATIES',
      [ConstructionPhase.AFBOUW]: 'AFBOUW',
      [ConstructionPhase.OPLEVERING]: 'OPLEVERING',
    };
    currentDetailedPhase = reverseMapping[dbCurrentPhase];
  }

  // Count phases from classifications
  const phaseCounts: Record<DetailedPhase, { count: number; totalConfidence: number }> = {
    GRONDWERK: { count: 0, totalConfidence: 0 },
    FUNDERING: { count: 0, totalConfidence: 0 },
    RUWBOUW: { count: 0, totalConfidence: 0 },
    DAKCONSTRUCTIE: { count: 0, totalConfidence: 0 },
    GEVELWERK: { count: 0, totalConfidence: 0 },
    INSTALLATIES: { count: 0, totalConfidence: 0 },
    AFBOUW: { count: 0, totalConfidence: 0 },
    OPLEVERING: { count: 0, totalConfidence: 0 },
  };

  const phaseHistory: PhaseAnalysis['phaseHistory'] = [];

  for (const classification of classifications) {
    const detected = detectPhaseFromClassification(classification);
    if (detected) {
      phaseCounts[detected.phase].count++;
      phaseCounts[detected.phase].totalConfidence += detected.confidence;
      phaseHistory.push({
        phase: detected.phase,
        detectedAt: new Date(),
      });
    }
  }

  // Calculate average confidence per phase
  const detectedPhases = Object.entries(phaseCounts)
    .filter(([_, data]) => data.count > 0)
    .map(([phase, data]) => ({
      phase: phase as DetailedPhase,
      count: data.count,
      confidence: data.totalConfidence / data.count,
    }))
    .sort((a, b) => b.count - a.count);

  // Determine most likely current phase from recent photos
  let mostLikelyPhase = currentDetailedPhase;
  let mostLikelyConfidence = 0;

  if (detectedPhases.length > 0) {
    // Use the phase with most detections, weighted by confidence
    const sorted = detectedPhases.sort((a, b) => {
      const scoreA = a.count * a.confidence;
      const scoreB = b.count * b.confidence;
      return scoreB - scoreA;
    });
    mostLikelyPhase = sorted[0].phase;
    mostLikelyConfidence = sorted[0].confidence;
  }

  // Check if we should suggest advancing to next phase
  const nextPhase = getNextPhase(currentDetailedPhase);
  const completionIndicators = checkCompletionIndicators(currentDetailedPhase, classifications);

  // Determine if ready to advance
  let readyToAdvance = false;
  let advanceReason: string | null = null;

  if (nextPhase) {
    // Check if most photos are already showing next phase work
    const nextPhaseDetections = phaseCounts[nextPhase];
    const currentPhaseDetections = phaseCounts[currentDetailedPhase];

    const totalRelevant = (nextPhaseDetections?.count || 0) + (currentPhaseDetections?.count || 0);
    const nextPhaseRatio = totalRelevant > 0
      ? (nextPhaseDetections?.count || 0) / totalRelevant
      : 0;

    // Conditions for suggesting phase advance:
    // 1. Most photos (>60%) show next phase work
    // 2. OR completion indicators found AND some next phase photos
    // 3. AND minimum confidence threshold met

    if (nextPhaseRatio >= 0.6 && mostLikelyConfidence >= 0.7) {
      readyToAdvance = true;
      advanceReason = `${Math.round(nextPhaseRatio * 100)}% van recente foto's toont ${nextPhase} werkzaamheden`;
    } else if (completionIndicators.length >= 2 && nextPhaseDetections && nextPhaseDetections.count >= 1) {
      readyToAdvance = true;
      advanceReason = `Voltooiingsindicatoren gevonden voor ${currentDetailedPhase}: ${completionIndicators.slice(0, 2).join(', ')}`;
    } else if (
      classifications.length >= 5 &&
      mostLikelyPhase !== currentDetailedPhase &&
      getPhaseOrder(mostLikelyPhase) > getPhaseOrder(currentDetailedPhase) &&
      mostLikelyConfidence >= 0.75
    ) {
      readyToAdvance = true;
      advanceReason = `Consistent ${mostLikelyPhase} werkzaamheden gedetecteerd in ${detectedPhases[0]?.count} foto's`;
    }
  }

  return {
    currentPhase: mostLikelyPhase,
    currentPhaseConfidence: mostLikelyConfidence,
    detectedPhases,
    suggestedNextPhase: readyToAdvance ? nextPhase : null,
    phaseCompletionIndicators: completionIndicators,
    readyToAdvance,
    advanceReason,
    recentPhotosAnalyzed: classifications.length,
    phaseHistory,
  };
}

/**
 * Auto-advance project phase if conditions are met
 * Returns true if phase was advanced
 */
export async function autoAdvancePhase(
  projectId: string,
  analysis: PhaseAnalysis,
  createdById: string
): Promise<{ advanced: boolean; newPhase?: DetailedPhase; message?: string }> {
  if (!analysis.readyToAdvance || !analysis.suggestedNextPhase) {
    return { advanced: false };
  }

  const newPhase = analysis.suggestedNextPhase;
  const dbPhase = mapDetailedToDbPhase(newPhase);

  try {
    // Get project and property
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        Property: {
          select: { id: true, currentPhase: true },
        },
      },
    });

    if (!project?.Property) {
      return { advanced: false, message: 'Project of property niet gevonden' };
    }

    // Update property's current phase
    await db.property.update({
      where: { id: project.Property.id },
      data: { currentPhase: dbPhase },
    });

    // Create timeline event for phase transition
    const phaseNames: Record<DetailedPhase, string> = {
      GRONDWERK: 'Grondwerk',
      FUNDERING: 'Fundering',
      RUWBOUW: 'Ruwbouw',
      DAKCONSTRUCTIE: 'Dakconstructie',
      GEVELWERK: 'Gevelwerk',
      INSTALLATIES: 'Installaties',
      AFBOUW: 'Afbouw',
      OPLEVERING: 'Oplevering',
    };

    await db.timelineEvent.create({
      data: {
        id: `evt_phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'CUSTOM',
        title: `Fase overgang: ${phaseNames[newPhase]}`,
        description: `Project automatisch doorgeschoven naar ${phaseNames[newPhase]} fase.\n\nReden: ${analysis.advanceReason}\n\nVoltooiingsindicatoren: ${analysis.phaseCompletionIndicators.join(', ') || 'n.v.t.'}`,
        occurredAt: new Date(),
        propertyId: project.Property.id,
        projectId,
        createdById,
        metadata: {
          phaseTransition: true,
          fromPhase: analysis.currentPhase,
          toPhase: newPhase,
          confidence: analysis.currentPhaseConfidence,
          completionIndicators: analysis.phaseCompletionIndicators,
          advanceReason: analysis.advanceReason,
          photosAnalyzed: analysis.recentPhotosAnalyzed,
        },
      },
    });

    // Update ProjectPhase if exists
    const currentProjectPhase = await db.projectPhase.findFirst({
      where: {
        projectId,
        status: 'IN_PROGRESS',
      },
      orderBy: { order: 'desc' },
    });

    if (currentProjectPhase) {
      // Mark current phase as completed
      await db.projectPhase.update({
        where: { id: currentProjectPhase.id },
        data: {
          status: 'COMPLETED',
          actualEnd: new Date(),
        },
      });

      // Start next phase if exists
      const nextProjectPhase = await db.projectPhase.findFirst({
        where: {
          projectId,
          order: currentProjectPhase.order + 1,
        },
      });

      if (nextProjectPhase) {
        await db.projectPhase.update({
          where: { id: nextProjectPhase.id },
          data: {
            status: 'IN_PROGRESS',
            actualStart: new Date(),
          },
        });
      }
    }

    return {
      advanced: true,
      newPhase,
      message: `Fase automatisch doorgeschoven naar ${phaseNames[newPhase]}`,
    };
  } catch (error) {
    console.error('[Phase Detection] Error advancing phase:', error);
    return { advanced: false, message: 'Fout bij het bijwerken van de fase' };
  }
}

/**
 * Get phase status summary for a project
 */
export async function getPhaseStatus(projectId: string): Promise<{
  currentPhase: DetailedPhase;
  dbPhase: ConstructionPhase | null;
  phaseProgress: number;
  analysis: PhaseAnalysis;
  phases: Array<{
    phase: DetailedPhase;
    name: string;
    status: 'completed' | 'current' | 'upcoming';
    photoCount: number;
  }>;
}> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      Property: {
        select: { currentPhase: true },
      },
    },
  });

  const analysis = await analyzePhaseProgress(projectId);

  // Count photos per phase
  const docs = await db.document.findMany({
    where: {
      projectId,
      source: 'WHATSAPP',
      NOT: { extractedData: { equals: undefined } },
    },
    select: { extractedData: true },
  });

  const photoCounts: Record<DetailedPhase, number> = {
    GRONDWERK: 0,
    FUNDERING: 0,
    RUWBOUW: 0,
    DAKCONSTRUCTIE: 0,
    GEVELWERK: 0,
    INSTALLATIES: 0,
    AFBOUW: 0,
    OPLEVERING: 0,
  };

  for (const doc of docs) {
    const data = doc.extractedData as { aiClassification?: ClassificationResult } | null;
    if (data?.aiClassification) {
      const detected = detectPhaseFromClassification(data.aiClassification);
      if (detected) {
        photoCounts[detected.phase]++;
      }
    }
  }

  const phaseNames: Record<DetailedPhase, string> = {
    GRONDWERK: 'Grondwerk',
    FUNDERING: 'Fundering',
    RUWBOUW: 'Ruwbouw',
    DAKCONSTRUCTIE: 'Dakconstructie',
    GEVELWERK: 'Gevelwerk',
    INSTALLATIES: 'Installaties',
    AFBOUW: 'Afbouw',
    OPLEVERING: 'Oplevering',
  };

  const currentPhaseOrder = getPhaseOrder(analysis.currentPhase);

  const phases = CONSTRUCTION_PHASES_ORDERED.map((phase) => {
    const order = getPhaseOrder(phase);
    let status: 'completed' | 'current' | 'upcoming';

    if (order < currentPhaseOrder) {
      status = 'completed';
    } else if (order === currentPhaseOrder) {
      status = 'current';
    } else {
      status = 'upcoming';
    }

    return {
      phase,
      name: phaseNames[phase],
      status,
      photoCount: photoCounts[phase],
    };
  });

  // Calculate overall progress
  const phaseProgress = Math.round((currentPhaseOrder / (CONSTRUCTION_PHASES_ORDERED.length - 1)) * 100);

  return {
    currentPhase: analysis.currentPhase,
    dbPhase: project?.Property?.currentPhase || null,
    phaseProgress,
    analysis,
    phases,
  };
}

/**
 * Build WhatsApp notification message for phase transition
 */
export function buildPhaseTransitionMessage(
  fromPhase: DetailedPhase,
  toPhase: DetailedPhase,
  reason: string
): string {
  const phaseNames: Record<DetailedPhase, string> = {
    GRONDWERK: 'Grondwerk',
    FUNDERING: 'Fundering',
    RUWBOUW: 'Ruwbouw',
    DAKCONSTRUCTIE: 'Dakconstructie',
    GEVELWERK: 'Gevelwerk',
    INSTALLATIES: 'Installaties',
    AFBOUW: 'Afbouw',
    OPLEVERING: 'Oplevering',
  };

  return [
    `*Helder: Fase Automatisch Bijgewerkt*`,
    ``,
    `Fase ${phaseNames[fromPhase]} lijkt voltooid.`,
    `Automatisch doorgeschoven naar fase *${phaseNames[toPhase]}*.`,
    ``,
    `Reden: ${reason}`,
    ``,
    `Klopt dit niet? Reageer met "fase terug" om de vorige fase te herstellen.`,
  ].join('\n');
}
