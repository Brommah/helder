import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Construction phases for Dutch residential construction
const CONSTRUCTION_PHASES = [
  { id: 'GRONDWERK', name: 'Grondwerk', keywords: ['fundering', 'graven', 'bouwput', 'heien', 'drainage'] },
  { id: 'FUNDERING', name: 'Fundering', keywords: ['beton', 'wapening', 'fundering', 'vloer', 'kelder'] },
  { id: 'RUWBOUW', name: 'Ruwbouw', keywords: ['muren', 'stenen', 'metselwerk', 'beton', 'kozijnen'] },
  { id: 'DAKCONSTRUCTIE', name: 'Dakconstructie', keywords: ['dak', 'spanten', 'dakkapel', 'gordingen', 'hout', 'constructie'] },
  { id: 'DAKBEDEKKING', name: 'Dakbedekking', keywords: ['dakpannen', 'isolatie', 'bitumen', 'dakbedekking', 'zink'] },
  { id: 'GEVEL', name: 'Gevelwerk', keywords: ['gevel', 'stucwerk', 'gevelbekleding', 'isolatie', 'steenstrips'] },
  { id: 'KOZIJNEN', name: 'Kozijnen & Ramen', keywords: ['kozijnen', 'ramen', 'deuren', 'glas', 'beglazing'] },
  { id: 'INSTALLATIES', name: 'Installaties', keywords: ['leidingen', 'elektra', 'cv', 'warmtepomp', 'ventilatie'] },
  { id: 'AFBOUW', name: 'Afbouw', keywords: ['stucwerk', 'vloeren', 'tegels', 'schilderwerk', 'keuken', 'badkamer'] },
  { id: 'OPLEVERING', name: 'Oplevering', keywords: ['oplevering', 'eindcontrole', 'sleutel', 'overdracht'] },
];

export interface MaterialSpec {
  name: string;
  type?: string;
  brand?: string;
  color?: string;
  dimensions?: string;
  quantity?: string;
}

export interface LocationSpec {
  floor?: string;
  room?: string;
  wall?: string;
  position?: string;
}

export interface QualityAssessment {
  score: number; // 1-10
  notes: string[];
  issues: string[];
}

export interface ClassificationResult {
  // Basic classification
  phase: string;
  phaseName: string;
  category: string;
  title: string;
  description: string;
  confidence: number;

  // Detailed elements
  detectedElements: string[];
  materials: MaterialSpec[];

  // Location in building
  location: LocationSpec;

  // Quality & Safety
  quality: QualityAssessment;
  safetyObservations: string[];
  complianceNotes: string[];

  // Progress & Status
  progressPercentage?: number;
  workStatus: 'in_progress' | 'completed' | 'inspection_needed' | 'issue_detected';

  // Environment
  weatherConditions?: string;
  lighting?: string;

  // People & Equipment
  workersVisible?: number;
  equipmentDetected: string[];
  toolsVisible: string[];

  // Technical specs
  measurements?: string[];
  technicalSpecs: string[];

  // Recommendations
  nextSteps: string[];
  attentionPoints: string[];
}

/**
 * Classify a construction photo using Gemini Vision
 */
export async function classifyConstructionImage(
  imageBuffer: Buffer,
  mimeType: string,
  messageText?: string
): Promise<ClassificationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `Je bent een ervaren Nederlandse bouwopzichter en kwaliteitsinspecteur. Analyseer deze bouwfoto ZEER GEDETAILLEERD.

BELANGRIJK: Wees zo SPECIFIEK en TECHNISCH mogelijk. Extraheer ALLE zichtbare details.

Geef een UITGEBREIDE JSON response:
{
  "phase": "GRONDWERK|FUNDERING|RUWBOUW|DAKCONSTRUCTIE|DAKBEDEKKING|GEVEL|KOZIJNEN|INSTALLATIES|AFBOUW|OPLEVERING",
  "category": "Specifiek: Dakspanten, Dakkapel, Metselwerk, Wapening, PVC-leidingen, etc.",
  "title": "Korte specifieke titel (bijv: 'Dakspanten montage', 'Kozijnen voorgevel')",
  "description": "Gedetailleerde beschrijving van wat je ziet",
  "confidence": 0.0-1.0,

  "detectedElements": ["lijst van alle zichtbare bouwelementen"],

  "materials": [
    {
      "name": "Materiaalnaam",
      "type": "Type/soort (bijv: 'geïmpregneerd vurenhout', 'B500B wapeningsstaal')",
      "brand": "Merk indien zichtbaar",
      "color": "Kleur indien relevant",
      "dimensions": "Afmetingen indien zichtbaar (bijv: '45x195mm', '400x200x200mm')",
      "quantity": "Geschatte hoeveelheid"
    }
  ],

  "location": {
    "floor": "Begane grond|1e verdieping|2e verdieping|Zolder|Kelder",
    "room": "Kamer/ruimte indien herkenbaar",
    "wall": "Noord|Oost|Zuid|West|Binnenmuur",
    "position": "Specifieke positie (bijv: 'linker hoek', 'bij de nok')"
  },

  "quality": {
    "score": 1-10,
    "notes": ["Positieve observaties over kwaliteit"],
    "issues": ["Eventuele problemen of aandachtspunten"]
  },

  "safetyObservations": ["Veiligheidshelmen zichtbaar", "Steiger correct opgesteld", etc.],
  "complianceNotes": ["Wkb-relevante observaties", "Bouwbesluit naleving"],

  "progressPercentage": 0-100,
  "workStatus": "in_progress|completed|inspection_needed|issue_detected",

  "weatherConditions": "Droog|Regen|Bewolkt|Zonnig",
  "lighting": "Daglicht|Kunstlicht|Schemering",

  "workersVisible": 0,
  "equipmentDetected": ["Hijskraan", "Steiger", "Betonmixer", etc.],
  "toolsVisible": ["Accuboormachine", "Waterpas", "Meetlint", etc.],

  "measurements": ["Zichtbare of geschatte maten"],
  "technicalSpecs": ["Technische specificaties (bijv: 'hart-op-hart 60cm', 'spouw 100mm')"],

  "nextSteps": ["Logische volgende werkzaamheden"],
  "attentionPoints": ["Punten die aandacht vereisen voor volgende fase"]
}

${messageText ? `Context van de aannemer: "${messageText}"` : ''}

Antwoord ALLEEN met valid JSON. Vul alle velden in, gebruik lege arrays [] als niets van toepassing is.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBuffer.toString('base64'),
        },
      },
    ]);

    const response = result.response.text();

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = response;
    if (response.includes('```json')) {
      jsonStr = response.split('```json')[1].split('```')[0].trim();
    } else if (response.includes('```')) {
      jsonStr = response.split('```')[1].split('```')[0].trim();
    }

    const classification = JSON.parse(jsonStr);

    // Find the phase name
    const phaseInfo = CONSTRUCTION_PHASES.find(p => p.id === classification.phase);

    return {
      // Basic classification
      phase: classification.phase || 'RUWBOUW',
      phaseName: phaseInfo?.name || classification.phase,
      category: classification.category || 'Algemeen',
      title: classification.title || 'Bouwfoto',
      description: classification.description || 'Foto van de bouwplaats',
      confidence: classification.confidence || 0.7,

      // Detailed elements
      detectedElements: classification.detectedElements || [],
      materials: classification.materials || [],

      // Location
      location: classification.location || {},

      // Quality & Safety
      quality: classification.quality || { score: 7, notes: [], issues: [] },
      safetyObservations: classification.safetyObservations || [],
      complianceNotes: classification.complianceNotes || [],

      // Progress
      progressPercentage: classification.progressPercentage,
      workStatus: classification.workStatus || 'in_progress',

      // Environment
      weatherConditions: classification.weatherConditions,
      lighting: classification.lighting,

      // People & Equipment
      workersVisible: classification.workersVisible,
      equipmentDetected: classification.equipmentDetected || [],
      toolsVisible: classification.toolsVisible || [],

      // Technical
      measurements: classification.measurements || [],
      technicalSpecs: classification.technicalSpecs || [],

      // Recommendations
      nextSteps: classification.nextSteps || [],
      attentionPoints: classification.attentionPoints || [],
    };
  } catch (error) {
    console.error('AI classification error:', error);

    // Create empty fallback result
    const createFallback = (
      phase: string,
      phaseName: string,
      category: string,
      title: string,
      description: string,
      confidence: number,
      elements: string[] = []
    ): ClassificationResult => ({
      phase,
      phaseName,
      category,
      title,
      description,
      confidence,
      detectedElements: elements,
      materials: [],
      location: {},
      quality: { score: 5, notes: [], issues: [] },
      safetyObservations: [],
      complianceNotes: [],
      workStatus: 'in_progress',
      equipmentDetected: [],
      toolsVisible: [],
      measurements: [],
      technicalSpecs: [],
      nextSteps: [],
      attentionPoints: [],
    });

    // Fallback classification based on message text
    if (messageText) {
      const lowerText = messageText.toLowerCase();
      for (const phase of CONSTRUCTION_PHASES) {
        if (phase.keywords.some(kw => lowerText.includes(kw))) {
          return createFallback(phase.id, phase.name, 'Voortgang', `${phase.name} foto`, messageText, 0.5);
        }
      }

      // Direct keyword matching for specific elements
      const lower = messageText.toLowerCase();
      if (lower.includes('dakkapel')) return createFallback('DAKCONSTRUCTIE', 'Dakconstructie', 'Dakkapel', 'Dakkapel plaatsing', messageText, 0.6, ['dakkapel']);
      if (lower.includes('dakspant') || lower.includes('spant')) return createFallback('DAKCONSTRUCTIE', 'Dakconstructie', 'Dakspanten', 'Dakspanten montage', messageText, 0.6, ['dakspanten']);
      if (lower.includes('dak')) return createFallback('DAKCONSTRUCTIE', 'Dakconstructie', 'Dakwerk', 'Dakconstructie voortgang', messageText, 0.5, ['dak']);
      if (lower.includes('kozijn')) return createFallback('KOZIJNEN', 'Kozijnen & Ramen', 'Kozijnen', 'Kozijnen plaatsing', messageText, 0.6, ['kozijnen']);
      if (lower.includes('metsel')) return createFallback('RUWBOUW', 'Ruwbouw', 'Metselwerk', 'Metselwerk voortgang', messageText, 0.6, ['metselwerk']);
      if (lower.includes('beton') || lower.includes('stort')) return createFallback('FUNDERING', 'Fundering', 'Betonwerk', 'Betonwerk storten', messageText, 0.6, ['beton']);
      if (lower.includes('isolat')) return createFallback('GEVEL', 'Gevelwerk', 'Isolatie', 'Isolatie aanbrengen', messageText, 0.6, ['isolatie']);
      if (lower.includes('leiding') || lower.includes('cv') || lower.includes('elektra')) return createFallback('INSTALLATIES', 'Installaties', 'Leidingwerk', 'Installaties aanleggen', messageText, 0.6, ['leidingen']);
    }

    return createFallback('RUWBOUW', 'Ruwbouw', 'Voortgang', 'Bouwvoortgang documentatie', messageText || 'Foto ontvangen via WhatsApp', 0.2);
  }
}

/**
 * Map classification to timeline event type
 */
export function getTimelineEventType(phase: string): string {
  const mapping: Record<string, string> = {
    'GRONDWERK': 'FOUNDATION_START',
    'FUNDERING': 'FOUNDATION_COMPLETE',
    'RUWBOUW': 'FRAMING_COMPLETE',
    'DAKCONSTRUCTIE': 'ROOFING_COMPLETE',
    'DAKBEDEKKING': 'ROOFING_COMPLETE',
    'GEVEL': 'EXTERIOR_COMPLETE',
    'KOZIJNEN': 'WINDOWS_INSTALLED',
    'INSTALLATIES': 'SYSTEMS_INSTALLED',
    'AFBOUW': 'INTERIOR_COMPLETE',
    'OPLEVERING': 'HANDOVER',
  };
  return mapping[phase] || 'DOCUMENT_ADDED';
}
