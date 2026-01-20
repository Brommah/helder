/**
 * Mock Data for Woningpaspoort Demo
 * Realistic nieuwbouw project: Villa Zonneweide
 */

import { addDays, subDays, subMonths } from 'date-fns'

// Construction phases for nieuwbouw
export const CONSTRUCTION_PHASES = [
  { id: 'grondwerk', name: 'Grondwerk & Fundering', icon: '🏗️', order: 1 },
  { id: 'ruwbouw', name: 'Ruwbouw', icon: '🧱', order: 2 },
  { id: 'dak', name: 'Dak & Gevel', icon: '🏠', order: 3 },
  { id: 'installaties', name: 'Installaties', icon: '⚡', order: 4 },
  { id: 'afbouw', name: 'Afbouw & Afwerking', icon: '🎨', order: 5 },
  { id: 'oplevering', name: 'Oplevering', icon: '🔑', order: 6 },
] as const

// Document categories for Wkb compliance
export const WKB_DOCUMENT_CATEGORIES = [
  { id: 'tekeningen', name: 'Tekeningen', required: true, icon: '📐' },
  { id: 'berekeningen', name: 'Berekeningen', required: true, icon: '📊' },
  { id: 'materialen', name: 'Materiaalspecificaties', required: true, icon: '📦' },
  { id: 'installaties', name: 'Installatie-instructies', required: true, icon: '🔧' },
  { id: 'onderhoud', name: 'Onderhoudsvoorschriften', required: true, icon: '📋' },
  { id: 'garanties', name: 'Garantiebewijzen', required: true, icon: '✅' },
  { id: 'keuringen', name: 'Keuringsrapporten', required: true, icon: '🔍' },
  { id: 'energie', name: 'BENG / Energielabel', required: true, icon: '⚡' },
  { id: 'fotos', name: "Foto's & Video's", required: false, icon: '📸' },
  { id: 'overig', name: 'Overige documenten', required: false, icon: '📁' },
] as const

// Demo property: Villa Zonneweide
export const DEMO_PROPERTY = {
  id: 'prop-villa-zonneweide',
  name: 'Villa Zonneweide',
  street: 'Zonneweidelaan',
  houseNumber: '42',
  postcode: '3823 AB',
  city: 'Amersfoort',
  propertyType: 'VRIJSTAAND',
  status: 'UNDER_CONSTRUCTION',
  
  // Plot details
  bouwjaar: 2026,
  woonoppervlakte: 165,
  perceelOppervlakte: 450,
  inhoud: 580,
  aantalKamers: 6,
  aantalVerdiepingen: 2,
  
  // Energy
  energielabel: 'A_PLUS_PLUS_PLUS',
  
  // Financial
  koopsom: 625000,
  koopDatum: subMonths(new Date(), 8),
  
  // Progress
  progress: 58,
  currentPhase: 'dak',
  
  // Blockchain verification
  blockchainHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  lastVerified: subDays(new Date(), 1),
  cereVaultId: 'cere-vault-villa-zonneweide-2026',
}

// Demo construction timeline
export const DEMO_TIMELINE = [
  {
    id: 'tl-1',
    phase: 'grondwerk',
    title: 'Start grondwerk',
    description: 'Bouwplaats ingericht, grondwerk gestart',
    date: subMonths(new Date(), 6),
    status: 'completed',
    photos: 3,
    verified: true,
    blockchainTx: '0x1a2b3c...',
  },
  {
    id: 'tl-2',
    phase: 'grondwerk',
    title: 'Fundering gestort',
    description: 'Betonnen fundering succesvol gestort. Weer: 18°C, droog.',
    date: subMonths(new Date(), 5),
    status: 'completed',
    photos: 8,
    verified: true,
    blockchainTx: '0x4d5e6f...',
    weather: { temp: 18, condition: 'Zonnig' },
  },
  {
    id: 'tl-3',
    phase: 'ruwbouw',
    title: 'Start ruwbouw',
    description: 'Eerste laag metselwerk begeleiderswoning',
    date: subMonths(new Date(), 4),
    status: 'completed',
    photos: 12,
    verified: true,
    blockchainTx: '0x7g8h9i...',
  },
  {
    id: 'tl-4',
    phase: 'ruwbouw',
    title: 'Verdiepingsvloer gestort',
    description: 'Betonnen verdiepingsvloer gereed',
    date: subMonths(new Date(), 3),
    status: 'completed',
    photos: 6,
    verified: true,
    blockchainTx: '0xabc123...',
  },
  {
    id: 'tl-5',
    phase: 'ruwbouw',
    title: 'Ruwbouw gereed',
    description: 'Alle wanden en vloeren voltooid',
    date: subMonths(new Date(), 2),
    status: 'completed',
    photos: 15,
    verified: true,
    blockchainTx: '0xdef456...',
  },
  {
    id: 'tl-6',
    phase: 'dak',
    title: 'Dakconstructie geplaatst',
    description: 'Houten dakspanten gemonteerd',
    date: subMonths(new Date(), 1),
    status: 'completed',
    photos: 10,
    verified: true,
    blockchainTx: '0xghi789...',
  },
  {
    id: 'tl-7',
    phase: 'dak',
    title: 'Dakpannen gelegd',
    description: 'Keramische dakpannen (Monier) geïnstalleerd',
    date: subDays(new Date(), 14),
    status: 'completed',
    photos: 8,
    verified: true,
    blockchainTx: '0xjkl012...',
  },
  {
    id: 'tl-8',
    phase: 'dak',
    title: 'Kozijnen geplaatst',
    description: 'Triple-glas kozijnen (Reynaers) gemonteerd',
    date: subDays(new Date(), 7),
    status: 'in_progress',
    photos: 4,
    verified: false,
  },
  {
    id: 'tl-9',
    phase: 'installaties',
    title: 'Start elektra',
    description: 'Elektrische leidingen worden aangelegd',
    date: addDays(new Date(), 7),
    status: 'planned',
    photos: 0,
    verified: false,
  },
]

// Demo documents
export const DEMO_DOCUMENTS = [
  {
    id: 'doc-1',
    name: 'Bouwvergunning Villa Zonneweide',
    category: 'tekeningen',
    type: 'PERMIT',
    uploadDate: subMonths(new Date(), 10),
    fileSize: 2400000,
    mimeType: 'application/pdf',
    verified: true,
    blockchainHash: '0xpermit123...',
  },
  {
    id: 'doc-2',
    name: 'BENG Berekening',
    category: 'energie',
    type: 'ENERGY_LABEL',
    uploadDate: subMonths(new Date(), 9),
    fileSize: 1800000,
    mimeType: 'application/pdf',
    verified: true,
    blockchainHash: '0xbeng456...',
  },
  {
    id: 'doc-3',
    name: 'Constructieberekening',
    category: 'berekeningen',
    type: 'TECHNICAL_DRAWING',
    uploadDate: subMonths(new Date(), 9),
    fileSize: 5200000,
    mimeType: 'application/pdf',
    verified: true,
    blockchainHash: '0xconstruct789...',
  },
  {
    id: 'doc-4',
    name: 'Funderingsplan',
    category: 'tekeningen',
    type: 'FLOOR_PLAN',
    uploadDate: subMonths(new Date(), 8),
    fileSize: 3100000,
    mimeType: 'application/pdf',
    verified: true,
    blockchainHash: '0xfundering012...',
  },
  {
    id: 'doc-5',
    name: 'Garantiebewijs Kozijnen - Reynaers',
    category: 'garanties',
    type: 'WARRANTY',
    uploadDate: subDays(new Date(), 10),
    fileSize: 450000,
    mimeType: 'application/pdf',
    verified: true,
    blockchainHash: '0xkozijn345...',
  },
  {
    id: 'doc-6',
    name: 'Isolatie Specificaties - Rockwool',
    category: 'materialen',
    type: 'MATERIAL_SPEC',
    uploadDate: subMonths(new Date(), 2),
    fileSize: 890000,
    mimeType: 'application/pdf',
    verified: true,
    blockchainHash: '0xisol678...',
  },
  {
    id: 'doc-7',
    name: 'Warmtepomp Handleiding - Daikin',
    category: 'installaties',
    type: 'MANUAL',
    uploadDate: subDays(new Date(), 5),
    fileSize: 2200000,
    mimeType: 'application/pdf',
    verified: false,
  },
]

// Demo materials used in construction
export const DEMO_MATERIALS = [
  {
    id: 'mat-1',
    category: 'FOUNDATION',
    name: 'Betonmortel C30/37',
    brand: 'ENCI',
    productCode: 'C30-37-XC2',
    quantity: 42,
    unit: 'm³',
    appliedAt: subMonths(new Date(), 5),
    location: 'Fundering',
    warrantyExpires: addDays(new Date(), 365 * 10),
  },
  {
    id: 'mat-2',
    category: 'STRUCTURAL',
    name: 'Kalkzandsteen',
    brand: 'Calduran',
    productCode: 'CS214-NF',
    quantity: 8500,
    unit: 'stuks',
    appliedAt: subMonths(new Date(), 4),
    location: 'Dragende wanden',
  },
  {
    id: 'mat-3',
    category: 'INSULATION',
    name: 'Steenwol Isolatie',
    brand: 'Rockwool',
    productCode: 'RW-135-100',
    quantity: 240,
    unit: 'm²',
    appliedAt: subMonths(new Date(), 1),
    location: 'Gevel & dak',
    batchNumber: 'RW2026-0142',
  },
  {
    id: 'mat-4',
    category: 'WINDOWS_DOORS',
    name: 'Triple-glas Kozijnen',
    brand: 'Reynaers',
    productCode: 'HI-CS77',
    color: 'Antraciet RAL 7016',
    quantity: 18,
    unit: 'stuks',
    appliedAt: subDays(new Date(), 10),
    location: 'Alle gevels',
    warrantyExpires: addDays(new Date(), 365 * 20),
  },
  {
    id: 'mat-5',
    category: 'ROOFING',
    name: 'Keramische Dakpannen',
    brand: 'Monier',
    productCode: 'Tuile du Nord Rustique',
    color: 'Blauw gesmoord',
    quantity: 1850,
    unit: 'stuks',
    appliedAt: subDays(new Date(), 14),
    location: 'Dakbedekking',
    warrantyExpires: addDays(new Date(), 365 * 30),
  },
  {
    id: 'mat-6',
    category: 'HVAC',
    name: 'Warmtepomp',
    brand: 'Daikin',
    productCode: 'Altherma 3 H HT',
    quantity: 1,
    unit: 'stuks',
    location: 'Technische ruimte',
    warrantyExpires: addDays(new Date(), 365 * 7),
  },
]

// Demo builder/contractors
export const DEMO_CONTRACTORS = [
  {
    id: 'cont-1',
    name: 'Bouwbedrijf Jansen B.V.',
    role: 'Hoofdaannemer',
    kvkNumber: '12345678',
    contact: 'info@jansenbouw.nl',
    verified: true,
  },
  {
    id: 'cont-2',
    name: 'Installatiebedrijf De Vries',
    role: 'Installateur (E/W)',
    kvkNumber: '23456789',
    contact: 'info@devriesinstallatie.nl',
    verified: true,
  },
  {
    id: 'cont-3',
    name: 'Dakdekkersbedrijf Bakker',
    role: 'Dakdekker',
    kvkNumber: '34567890',
    contact: 'info@bakkerdak.nl',
    verified: true,
  },
]

// Wkb compliance status
export const DEMO_WKB_STATUS = {
  borgingsplan: true,
  risicobeoordeling: true,
  kwaliteitsborger: 'TÜV Rheinland Nederland',
  kwaliteitsborgerId: 'KB-2024-12345',
  startmelding: subMonths(new Date(), 6),
  gereedmelding: null,
  consumentendossierProgress: 72,
  requiredDocuments: 10,
  uploadedDocuments: 7,
  verifiedDocuments: 6,
}

// Helper function to get phase progress
export function getPhaseProgress(phaseId: string): number {
  const phaseIndex = CONSTRUCTION_PHASES.findIndex(p => p.id === phaseId)
  const currentIndex = CONSTRUCTION_PHASES.findIndex(p => p.id === DEMO_PROPERTY.currentPhase)
  
  if (phaseIndex < currentIndex) return 100
  if (phaseIndex > currentIndex) return 0
  
  // Current phase - calculate based on timeline
  const phaseEvents = DEMO_TIMELINE.filter(t => t.phase === phaseId)
  const completed = phaseEvents.filter(t => t.status === 'completed').length
  return Math.round((completed / Math.max(phaseEvents.length, 1)) * 100)
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
