/**
 * Prisma Database Seed
 * Creates demo users and complete sample data for development
 * Includes full builder-homeowner relationship with Villa Zonneweide
 */

import { 
  PrismaClient, 
  UserRole, 
  PropertyType, 
  PropertyStatus, 
  EnergyLabel, 
  ConstructionPhase,
  CompanyType,
  ProjectType,
  ProjectStatus,
  PhaseStatus,
  DocumentType,
  DocumentSource,
  EventType,
  MaterialCategory,
  CostCategory,
  MessageDirection,
  MessageStatus,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const TEST_PASSWORD = 'Demo1234!'

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

async function main() {
  console.log('🌱 Seeding database...')
  console.log('')

  // Hash password for all test users
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 12)

  // ========================================
  // COMPANY: Bouwbedrijf Jansen B.V.
  // ========================================
  const builderCompany = await prisma.company.upsert({
    where: { id: 'company-jansen-1' },
    update: { updatedAt: new Date() },
    create: {
      id: 'company-jansen-1',
      name: 'Bouwbedrijf Jansen B.V.',
      kvkNumber: '12345678',
      type: CompanyType.GENERAL_CONTRACTOR,
      verified: true,
      verifiedAt: new Date('2024-01-15'),
      email: 'info@jansenbouw.nl',
      phone: '+31 6 12345678',
      address: 'Industrieweg 42',
      postcode: '1234 AB',
      city: 'Amsterdam',
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created builder company:', builderCompany.name)

  // ========================================
  // BUILDER USER (linked to company)
  // ========================================
  const demoBuilder = await prisma.user.upsert({
    where: { email: 'builder@woningpaspoort.nl' },
    update: { 
      password: hashedPassword, 
      companyId: builderCompany.id,
      updatedAt: new Date() 
    },
    create: {
      id: 'demo-builder-1',
      email: 'builder@woningpaspoort.nl',
      name: 'Jan Jansen',
      phone: '+31612345678',
      password: hashedPassword,
      role: UserRole.BUILDER,
      companyId: builderCompany.id,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created demo builder:', demoBuilder.email)

  // ========================================
  // HOMEOWNER: Familie De Vries (Completed)
  // ========================================
  const completedUser = await prisma.user.upsert({
    where: { email: 'completed@helder.nl' },
    update: { password: hashedPassword, updatedAt: new Date() },
    create: {
      id: 'user-completed-1',
      email: 'completed@helder.nl',
      name: 'Familie De Vries',
      phone: '+31687654321',
      password: hashedPassword,
      role: UserRole.HOMEOWNER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created completed home owner:', completedUser.email)

  // ========================================
  // PROPERTY: Villa Zonneweide (Completed)
  // ========================================
  const completedProperty = await prisma.property.upsert({
    where: { id: 'property-completed-1' },
    update: { updatedAt: new Date() },
    create: {
      id: 'property-completed-1',
      name: 'Villa Zonneweide',
      street: 'Zonneweidelaan',
      houseNumber: '12',
      postcode: '1358 AB',
      city: 'Almere Haven',
      propertyType: PropertyType.VILLA,
      bouwjaar: 2025,
      woonoppervlakte: 210,
      perceelOppervlakte: 580,
      aantalKamers: 7,
      aantalVerdiepingen: 2,
      energielabel: EnergyLabel.A_PLUS_PLUS_PLUS_PLUS,
      energielabelDate: new Date('2025-10-01'),
      isNieuwbouw: true,
      status: PropertyStatus.ACTIVE,
      currentPhase: ConstructionPhase.OPLEVERING,
      startDate: new Date('2024-09-01'),
      expectedEnd: new Date('2025-11-01'),
      verificationBadge: true,
      cereVaultId: '0x7f3a...b2c4',
      wozWaarde: 685000,
      wozYear: 2025,
      koopsom: 595000,
      koopDatum: new Date('2024-06-15'),
      ownerId: completedUser.id,
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created completed property:', completedProperty.name)

  // ========================================
  // PROJECT: Villa Zonneweide Construction
  // ========================================
  const villaProject = await prisma.project.upsert({
    where: { id: 'project-villa-1' },
    update: { updatedAt: new Date() },
    create: {
      id: 'project-villa-1',
      name: 'Villa Zonneweide - Nieuwbouw',
      description: 'Nieuwbouw vrijstaande villa voor Familie De Vries. 210m² woonoppervlakte, 7 kamers, A++++ energielabel met warmtepomp en zonnepanelen.',
      type: ProjectType.NEW_CONSTRUCTION,
      status: ProjectStatus.COMPLETED,
      plannedStart: new Date('2024-09-01'),
      plannedEnd: new Date('2025-10-15'),
      actualStart: new Date('2024-09-05'),
      actualEnd: new Date('2025-10-28'),
      estimatedCost: 595000,
      actualCost: 612500,
      wkbRequired: true,
      wkbDossierId: 'WKB-2024-AH-001234',
      propertyId: completedProperty.id,
      companyId: builderCompany.id,
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created project:', villaProject.name)

  // ========================================
  // PROJECT PHASES
  // ========================================
  const phases = [
    { name: 'Grondwerk & Fundering', order: 1, status: PhaseStatus.COMPLETED, plannedStart: '2024-09-01', plannedEnd: '2024-10-15', actualStart: '2024-09-05', actualEnd: '2024-10-18' },
    { name: 'Ruwbouw', order: 2, status: PhaseStatus.COMPLETED, plannedStart: '2024-10-16', plannedEnd: '2024-12-20', actualStart: '2024-10-19', actualEnd: '2024-12-23' },
    { name: 'Dak & Gevel', order: 3, status: PhaseStatus.COMPLETED, plannedStart: '2025-01-06', plannedEnd: '2025-03-15', actualStart: '2025-01-08', actualEnd: '2025-03-20' },
    { name: 'Installaties', order: 4, status: PhaseStatus.COMPLETED, plannedStart: '2025-03-16', plannedEnd: '2025-05-30', actualStart: '2025-03-21', actualEnd: '2025-06-05' },
    { name: 'Afbouw & Afwerking', order: 5, status: PhaseStatus.COMPLETED, plannedStart: '2025-06-01', plannedEnd: '2025-09-15', actualStart: '2025-06-06', actualEnd: '2025-09-25' },
    { name: 'Oplevering', order: 6, status: PhaseStatus.COMPLETED, plannedStart: '2025-09-16', plannedEnd: '2025-10-15', actualStart: '2025-09-26', actualEnd: '2025-10-28' },
  ]

  for (const phase of phases) {
    await prisma.projectPhase.upsert({
      where: { id: `phase-villa-${phase.order}` },
      update: { updatedAt: new Date() },
      create: {
        id: `phase-villa-${phase.order}`,
        name: phase.name,
        order: phase.order,
        status: phase.status,
        plannedStart: new Date(phase.plannedStart),
        plannedEnd: new Date(phase.plannedEnd),
        actualStart: new Date(phase.actualStart),
        actualEnd: new Date(phase.actualEnd),
        projectId: villaProject.id,
        updatedAt: new Date(),
      },
    })
  }
  console.log('✅ Created 6 project phases')

  // ========================================
  // WHATSAPP NUMBER (Builder linked)
  // ========================================
  const whatsappNumber = await prisma.whatsAppNumber.upsert({
    where: { id: 'wa-jansen-1' },
    update: {},
    create: {
      id: 'wa-jansen-1',
      phoneNumber: '+31612345678',
      companyId: builderCompany.id,
      projectId: villaProject.id,
      verified: true,
      verifiedAt: new Date('2024-09-10'),
    },
  })
  console.log('✅ Created WhatsApp number link')

  // ========================================
  // DOCUMENTS (Photos & Files)
  // ========================================
  const documents = [
    // Grondwerk & Fundering
    { name: 'Bouwput gereed', type: DocumentType.PHOTO, phase: 'GRONDWERK', date: '2024-09-12', source: DocumentSource.WHATSAPP, desc: 'Bouwput volledig uitgegraven, drainage aangelegd' },
    { name: 'Heipalen geplaatst', type: DocumentType.PHOTO, phase: 'FUNDERING', date: '2024-09-25', source: DocumentSource.WHATSAPP, desc: '24 heipalen tot -12m, sondering rapport beschikbaar' },
    { name: 'Funderingsplaat storten', type: DocumentType.PHOTO, phase: 'FUNDERING', date: '2024-10-05', source: DocumentSource.WHATSAPP, desc: 'Betonvloer 300mm met vloerverwarming leidingen' },
    { name: 'Fundering gereed', type: DocumentType.PHOTO, phase: 'FUNDERING', date: '2024-10-18', source: DocumentSource.WHATSAPP, desc: 'Fundering volledig uitgehard en gecontroleerd' },
    
    // Ruwbouw
    { name: 'Metselwerk begane grond', type: DocumentType.PHOTO, phase: 'RUWBOUW', date: '2024-10-28', source: DocumentSource.WHATSAPP, desc: 'Kalkzandsteen buitenmuren, spouw 100mm isolatie' },
    { name: 'Verdiepingsvloer gestort', type: DocumentType.PHOTO, phase: 'RUWBOUW', date: '2024-11-15', source: DocumentSource.WHATSAPP, desc: 'Breedplaatvloer eerste verdieping, 260mm' },
    { name: 'Kozijnen geplaatst', type: DocumentType.PHOTO, phase: 'RUWBOUW', date: '2024-12-05', source: DocumentSource.WHATSAPP, desc: 'Triple glas HR+++ kozijnen, Rc=0.8' },
    { name: 'Ruwbouw wind- en waterdicht', type: DocumentType.PHOTO, phase: 'RUWBOUW', date: '2024-12-23', source: DocumentSource.WHATSAPP, desc: 'Casco volledig gesloten' },
    
    // Dak & Gevel
    { name: 'Dakspanten montage', type: DocumentType.PHOTO, phase: 'DAKCONSTRUCTIE', date: '2025-01-15', source: DocumentSource.WHATSAPP, desc: 'Prefab dakspanten 45x195mm geïmpregneerd vuren' },
    { name: 'Dakkapel plaatsing', type: DocumentType.PHOTO, phase: 'DAKCONSTRUCTIE', date: '2025-02-01', source: DocumentSource.WHATSAPP, desc: 'Dakkapel voorzijde 3.2m breed' },
    { name: 'Dakpannen leggen', type: DocumentType.PHOTO, phase: 'DAKCONSTRUCTIE', date: '2025-02-20', source: DocumentSource.WHATSAPP, desc: 'Monier Tuile du Nord antraciet' },
    { name: 'Gevelstucwerk', type: DocumentType.PHOTO, phase: 'GEVELWERK', date: '2025-03-10', source: DocumentSource.WHATSAPP, desc: 'Sierpleister RAL 9010, spachtelputz korrel 2mm' },
    
    // Installaties
    { name: 'Elektra eerste fix', type: DocumentType.PHOTO, phase: 'INSTALLATIES', date: '2025-04-01', source: DocumentSource.WHATSAPP, desc: '3-fase aansluiting, 63A hoofdgroep, 24 groepen' },
    { name: 'Vloerverwarming aanleg', type: DocumentType.PHOTO, phase: 'INSTALLATIES', date: '2025-04-15', source: DocumentSource.WHATSAPP, desc: 'Vloerverwarming alle verdiepingen, hart-op-hart 10cm' },
    { name: 'Warmtepomp installatie', type: DocumentType.PHOTO, phase: 'INSTALLATIES', date: '2025-05-01', source: DocumentSource.WHATSAPP, desc: 'Daikin Altherma 3 H HT, 14kW lucht-water' },
    { name: 'Zonnepanelen montage', type: DocumentType.PHOTO, phase: 'INSTALLATIES', date: '2025-05-20', source: DocumentSource.WHATSAPP, desc: '28x Longi 410Wp, 11.48 kWp totaal, zuidwest oriëntatie' },
    { name: 'Ventilatie WTW', type: DocumentType.PHOTO, phase: 'INSTALLATIES', date: '2025-06-02', source: DocumentSource.WHATSAPP, desc: 'Brink Renovent Sky 300, 95% warmteterugwinning' },
    
    // Afbouw
    { name: 'Stucwerk wanden', type: DocumentType.PHOTO, phase: 'AFBOUW', date: '2025-06-20', source: DocumentSource.WHATSAPP, desc: 'Gipsplaten afgewerkt, Q3 spuitwerk gereed' },
    { name: 'Keuken montage', type: DocumentType.PHOTO, phase: 'AFBOUW', date: '2025-07-15', source: DocumentSource.WHATSAPP, desc: 'SieMatic Pure, composiet werkblad, Miele apparatuur' },
    { name: 'Badkamer tegels', type: DocumentType.PHOTO, phase: 'AFBOUW', date: '2025-08-01', source: DocumentSource.WHATSAPP, desc: 'Mosa tegels 60x60, inloopdouche met regendouche' },
    { name: 'Parketvloer leggen', type: DocumentType.PHOTO, phase: 'AFBOUW', date: '2025-08-20', source: DocumentSource.WHATSAPP, desc: 'Europees eiken visgraat, 15mm massief' },
    { name: 'Schilderwerk', type: DocumentType.PHOTO, phase: 'AFBOUW', date: '2025-09-10', source: DocumentSource.WHATSAPP, desc: 'Alle wanden en plafonds RAL 9010, kozijnen RAL 9016' },
    { name: 'Trap montage', type: DocumentType.PHOTO, phase: 'AFBOUW', date: '2025-09-18', source: DocumentSource.WHATSAPP, desc: 'Stalen trap met eiken treden, glazen balustrade' },
    
    // Oplevering
    { name: 'Tuin aanleg', type: DocumentType.PHOTO, phase: 'OPLEVERING', date: '2025-10-05', source: DocumentSource.WHATSAPP, desc: 'Gazon, terras keramische tegels, plantenborders' },
    { name: 'Eindcontrole elektra', type: DocumentType.INSPECTION_REPORT, phase: 'OPLEVERING', date: '2025-10-15', source: DocumentSource.MANUAL, desc: 'NEN 1010 keuring goedgekeurd' },
    { name: 'Eindcontrole installaties', type: DocumentType.INSPECTION_REPORT, phase: 'OPLEVERING', date: '2025-10-18', source: DocumentSource.MANUAL, desc: 'Alle installaties getest en goedgekeurd' },
    { name: 'Oplevering woning', type: DocumentType.PHOTO, phase: 'OPLEVERING', date: '2025-10-28', source: DocumentSource.WHATSAPP, desc: 'Sleuteloverdracht Familie De Vries' },
    
    // Official documents
    { name: 'Omgevingsvergunning', type: DocumentType.PERMIT, phase: 'GRONDWERK', date: '2024-07-15', source: DocumentSource.MANUAL, desc: 'Gemeente Almere, kenmerk OLO-2024-12345' },
    { name: 'Constructieberekening', type: DocumentType.TECHNICAL_DRAWING, phase: 'FUNDERING', date: '2024-08-01', source: DocumentSource.MANUAL, desc: 'Statische berekening door Ingenieurs Van Dijk' },
    { name: 'BENG berekening', type: DocumentType.ENERGY_LABEL, phase: 'OPLEVERING', date: '2025-09-01', source: DocumentSource.MANUAL, desc: 'BENG 1: 45, BENG 2: 15, BENG 3: 52% - ruim voldoet' },
    { name: 'Energielabel A++++', type: DocumentType.CERTIFICATE, phase: 'OPLEVERING', date: '2025-10-01', source: DocumentSource.MANUAL, desc: 'EP2 geregistreerd, Energie-Index 0.12' },
    { name: 'Garantiecertificaat', type: DocumentType.WARRANTY, phase: 'OPLEVERING', date: '2025-10-28', source: DocumentSource.MANUAL, desc: 'Woningborg garantie 10 jaar' },
  ]

  let docCount = 0
  for (const doc of documents) {
    await prisma.document.upsert({
      where: { id: `doc-villa-${docCount + 1}` },
      update: { updatedAt: new Date() },
      create: {
        id: `doc-villa-${docCount + 1}`,
        name: doc.name,
        description: doc.desc,
        type: doc.type,
        mimeType: doc.type === DocumentType.PHOTO ? 'image/jpeg' : 'application/pdf',
        fileSize: Math.floor(Math.random() * 5000000) + 500000,
        fileUrl: `/images/projects/${doc.phase.toLowerCase()}-${docCount + 1}.jpg`,
        documentDate: new Date(doc.date),
        verified: true,
        verifiedBy: demoBuilder.name,
        source: doc.source,
        propertyId: completedProperty.id,
        projectId: villaProject.id,
        uploadedById: demoBuilder.id,
        extractedData: doc.source === DocumentSource.WHATSAPP ? {
          aiClassification: {
            phase: doc.phase,
            phaseName: doc.phase,
            category: doc.name,
            title: doc.name,
            description: doc.desc,
            confidence: 0.92,
            detectedElements: [doc.name],
            materials: [],
            quality: { score: 9, notes: ['Goed uitgevoerd'], issues: [] },
          },
          submittedBy: 'Jan Jansen',
          submittedAt: new Date(doc.date).toISOString(),
        } : undefined,
        updatedAt: new Date(),
      },
    })
    docCount++
  }
  console.log(`✅ Created ${docCount} documents (photos & files)`)

  // ========================================
  // TIMELINE EVENTS
  // ========================================
  const timelineEvents = [
    { type: EventType.CONSTRUCTION_START, title: 'Bouw gestart', date: '2024-09-05', desc: 'Officiële start bouw Villa Zonneweide' },
    { type: EventType.FOUNDATION_START, title: 'Grondwerk begonnen', date: '2024-09-10', desc: 'Start ontgraving en drainage' },
    { type: EventType.FOUNDATION_COMPLETE, title: 'Fundering gereed', date: '2024-10-18', desc: 'Funderingsplaat volledig uitgehard' },
    { type: EventType.FRAMING_COMPLETE, title: 'Ruwbouw voltooid', date: '2024-12-23', desc: 'Casco wind- en waterdicht' },
    { type: EventType.ROOFING_COMPLETE, title: 'Dak gereed', date: '2025-03-01', desc: 'Dakconstructie en dakpannen voltooid' },
    { type: EventType.EXTERIOR_COMPLETE, title: 'Gevelwerk klaar', date: '2025-03-20', desc: 'Stucwerk en gevelbekleding afgerond' },
    { type: EventType.SYSTEMS_INSTALLED, title: 'Installaties compleet', date: '2025-06-05', desc: 'Alle E/W/CV installaties werkend' },
    { type: EventType.SOLAR_INSTALLED, title: 'Zonnepanelen actief', date: '2025-05-25', desc: '28 panelen, 11.48 kWp aangesloten op net' },
    { type: EventType.INTERIOR_COMPLETE, title: 'Afbouw voltooid', date: '2025-09-25', desc: 'Keuken, badkamers, vloeren gereed' },
    { type: EventType.FINAL_INSPECTION, title: 'Eindkeuring goedgekeurd', date: '2025-10-20', desc: 'Alle keuringen positief afgerond' },
    { type: EventType.HANDOVER, title: 'Sleuteloverdracht', date: '2025-10-28', desc: 'Villa overgedragen aan Familie De Vries' },
  ]

  for (let i = 0; i < timelineEvents.length; i++) {
    const event = timelineEvents[i]
    await prisma.timelineEvent.upsert({
      where: { id: `event-villa-${i + 1}` },
      update: {},
      create: {
        id: `event-villa-${i + 1}`,
        type: event.type,
        title: event.title,
        description: event.desc,
        occurredAt: new Date(event.date),
        verified: true,
        verifiedBy: demoBuilder.name,
        verifiedAt: new Date(event.date),
        propertyId: completedProperty.id,
        projectId: villaProject.id,
        createdById: demoBuilder.id,
      },
    })
  }
  console.log(`✅ Created ${timelineEvents.length} timeline events`)

  // ========================================
  // MATERIALS
  // ========================================
  const materials = [
    { category: MaterialCategory.FOUNDATION, name: 'Betonmortel C28/35', brand: 'Mebin', quantity: '85 m³', location: 'Fundering' },
    { category: MaterialCategory.FOUNDATION, name: 'Wapeningsstaal B500B', brand: 'ArcelorMittal', quantity: '4200 kg', location: 'Fundering' },
    { category: MaterialCategory.STRUCTURAL, name: 'Kalkzandsteen CS16', brand: 'Calduran', quantity: '12000 stuks', location: 'Buitenmuren' },
    { category: MaterialCategory.STRUCTURAL, name: 'Cellenbeton G4/500', brand: 'Ytong', quantity: '45 m³', location: 'Binnenmuren' },
    { category: MaterialCategory.INSULATION, name: 'Spouwplaat 100mm', brand: 'Rockwool', quantity: '280 m²', location: 'Spouw' },
    { category: MaterialCategory.INSULATION, name: 'Dakisolatie PIR 140mm', brand: 'Recticel', quantity: '195 m²', location: 'Dak' },
    { category: MaterialCategory.ROOFING, name: 'Dakspanten vuren 45x195', brand: 'Foreco', quantity: '32 stuks', location: 'Dakconstructie' },
    { category: MaterialCategory.ROOFING, name: 'Dakpannen Tuile du Nord', brand: 'Monier', quantity: '1850 stuks', location: 'Dakbedekking' },
    { category: MaterialCategory.WINDOWS_DOORS, name: 'Kozijnen kunststof', brand: 'Schüco', quantity: '24 stuks', location: 'Gevels' },
    { category: MaterialCategory.WINDOWS_DOORS, name: 'Triple glas HR+++', brand: 'AGC', quantity: '85 m²', location: 'Ramen' },
    { category: MaterialCategory.HVAC, name: 'Warmtepomp Altherma 3', brand: 'Daikin', quantity: '1 stuk', location: 'Technische ruimte' },
    { category: MaterialCategory.HVAC, name: 'WTW Renovent Sky 300', brand: 'Brink', quantity: '1 stuk', location: 'Zolder' },
    { category: MaterialCategory.ELECTRICAL, name: 'Zonnepanelen 410Wp', brand: 'Longi', quantity: '28 stuks', location: 'Dak zuidwest' },
    { category: MaterialCategory.ELECTRICAL, name: 'Omvormer SUN2000', brand: 'Huawei', quantity: '1 stuk', location: 'Meterkast' },
    { category: MaterialCategory.FLOORING, name: 'Eiken visgraat 15mm', brand: 'Solidfloor', quantity: '145 m²', location: 'Woonlagen' },
    { category: MaterialCategory.TILES, name: 'Vloertegel 60x60', brand: 'Mosa', quantity: '65 m²', location: 'Badkamers' },
    { category: MaterialCategory.KITCHEN, name: 'Keuken Pure', brand: 'SieMatic', quantity: '1 set', location: 'Keuken' },
    { category: MaterialCategory.BATHROOM, name: 'Inloopdouche 120x90', brand: 'Villeroy & Boch', quantity: '2 stuks', location: 'Badkamers' },
  ]

  for (let i = 0; i < materials.length; i++) {
    const mat = materials[i]
    await prisma.materialUsage.upsert({
      where: { id: `mat-villa-${i + 1}` },
      update: {},
      create: {
        id: `mat-villa-${i + 1}`,
        category: mat.category,
        name: mat.name,
        brand: mat.brand,
        quantity: parseFloat(mat.quantity) || 1,
        unit: mat.quantity.replace(/[0-9.]/g, '').trim(),
        location: mat.location,
        appliedAt: new Date('2025-06-01'),
        appliedBy: demoBuilder.name,
        projectId: villaProject.id,
      },
    })
  }
  console.log(`✅ Created ${materials.length} materials`)

  // ========================================
  // COST BREAKDOWN
  // ========================================
  const costs = [
    { category: CostCategory.KAVEL, budgeted: 125000, actual: 125000, desc: 'Kavelprijs Zonneweide' },
    { category: CostCategory.FOUNDATION, budgeted: 45000, actual: 47500, desc: 'Fundering incl. heipalen' },
    { category: CostCategory.STRUCTURE, budgeted: 120000, actual: 125000, desc: 'Ruwbouw en metselwerk' },
    { category: CostCategory.ROOF_FACADE, budgeted: 55000, actual: 58000, desc: 'Dak en gevelafwerking' },
    { category: CostCategory.INSTALLATIONS, budgeted: 85000, actual: 92000, desc: 'E/W/CV/Ventilatie/Zonnepanelen' },
    { category: CostCategory.FINISHING, budgeted: 75000, actual: 78000, desc: 'Stucwerk, schilderwerk, vloeren' },
    { category: CostCategory.KITCHEN, budgeted: 35000, actual: 38000, desc: 'SieMatic keuken met Miele' },
    { category: CostCategory.BATHROOM, budgeted: 25000, actual: 27000, desc: '2 badkamers + toilet' },
    { category: CostCategory.GARDEN, budgeted: 15000, actual: 12000, desc: 'Tuin en terrassen' },
    { category: CostCategory.FEES, budgeted: 15000, actual: 10000, desc: 'Architect, leges, notaris' },
  ]

  for (const cost of costs) {
    await prisma.costBreakdown.upsert({
      where: { 
        propertyId_category: {
          propertyId: completedProperty.id,
          category: cost.category,
        }
      },
      update: { actual: cost.actual, updatedAt: new Date() },
      create: {
        id: generateId('cost'),
        category: cost.category,
        description: cost.desc,
        budgeted: cost.budgeted,
        actual: cost.actual,
        propertyId: completedProperty.id,
        updatedAt: new Date(),
      },
    })
  }
  console.log(`✅ Created ${costs.length} cost breakdown entries`)

  // ========================================
  // WHATSAPP MESSAGES (Sample)
  // ========================================
  const messages = [
    { content: 'Fundering is gestort! Alles goed verlopen.', date: '2024-10-05', hasMedia: true },
    { content: 'Metselwerk begane grond klaar', date: '2024-10-28', hasMedia: true },
    { content: 'Dakspanten geplaatst, morgen verder met dakplaten', date: '2025-01-15', hasMedia: true },
    { content: 'Warmtepomp aangesloten en getest', date: '2025-05-01', hasMedia: true },
    { content: 'Oplevering gepland voor 28 oktober!', date: '2025-10-15', hasMedia: false },
  ]

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    await prisma.whatsAppMessage.upsert({
      where: { id: `msg-villa-${i + 1}` },
      update: {},
      create: {
        id: `msg-villa-${i + 1}`,
        twilioMessageId: `SM${Date.now()}${i}`,
        fromPhone: '+31612345678',
        toPhone: '+31207123456',
        direction: MessageDirection.INCOMING,
        content: msg.content,
        mediaUrl: msg.hasMedia ? `/images/projects/photo-${i + 1}.jpg` : null,
        mediaType: msg.hasMedia ? 'image/jpeg' : null,
        status: MessageStatus.PROCESSED,
        whatsappNumberId: whatsappNumber.id,
        projectId: villaProject.id,
        processedAt: new Date(msg.date),
        createdAt: new Date(msg.date),
      },
    })
  }
  console.log(`✅ Created ${messages.length} WhatsApp messages`)

  // ========================================
  // ACCOUNT 2: Building home (In Progress)
  // ========================================
  const buildingUser = await prisma.user.upsert({
    where: { email: 'building@helder.nl' },
    update: { password: hashedPassword, updatedAt: new Date() },
    create: {
      id: 'user-building-1',
      email: 'building@helder.nl',
      name: 'Familie Janssen',
      phone: '+31698765432',
      password: hashedPassword,
      role: UserRole.HOMEOWNER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created building home owner:', buildingUser.email)

  // Under construction property
  const buildingProperty = await prisma.property.upsert({
    where: { id: 'property-building-1' },
    update: { updatedAt: new Date() },
    create: {
      id: 'property-building-1',
      name: 'Kavel 24 - De Buitenplaats',
      kavelNumber: '24',
      projectName: 'Woonwijk De Buitenplaats',
      postcode: '1356 XX',
      city: 'Almere Poort',
      propertyType: PropertyType.VRIJSTAAND,
      woonoppervlakte: 175,
      perceelOppervlakte: 420,
      aantalKamers: 5,
      aantalVerdiepingen: 2,
      isNieuwbouw: true,
      status: PropertyStatus.UNDER_CONSTRUCTION,
      currentPhase: ConstructionPhase.DAK_GEVEL,
      startDate: new Date('2025-06-01'),
      expectedEnd: new Date('2026-08-01'),
      verificationBadge: false,
      ownerId: buildingUser.id,
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created building property:', buildingProperty.name)

  // Project for building property (linked to same builder)
  const buildingProject = await prisma.project.upsert({
    where: { id: 'project-building-1' },
    update: { updatedAt: new Date() },
    create: {
      id: 'project-building-1',
      name: 'Kavel 24 - Nieuwbouw',
      description: 'Nieuwbouw vrijstaande woning voor Familie Janssen. In aanbouw.',
      type: ProjectType.NEW_CONSTRUCTION,
      status: ProjectStatus.IN_PROGRESS,
      plannedStart: new Date('2025-06-01'),
      plannedEnd: new Date('2026-07-15'),
      actualStart: new Date('2025-06-05'),
      estimatedCost: 485000,
      wkbRequired: true,
      propertyId: buildingProperty.id,
      companyId: builderCompany.id,
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created building project')

  // Link WhatsApp to building project too
  await prisma.whatsAppNumber.upsert({
    where: { id: 'wa-jansen-2' },
    update: {},
    create: {
      id: 'wa-jansen-2',
      phoneNumber: '+31612345679',
      companyId: builderCompany.id,
      projectId: buildingProject.id,
      verified: true,
      verifiedAt: new Date('2025-06-10'),
    },
  })

  // Link Martijn's WhatsApp to Villa Zonneweide for testing
  await prisma.whatsAppNumber.upsert({
    where: { phoneNumber: '+31611875951' },
    update: {
      projectId: villaProject.id,
      companyId: builderCompany.id,
      verified: true,
      verifiedAt: new Date(),
    },
    create: {
      id: 'wa-martijn-1',
      phoneNumber: '+31611875951',
      companyId: builderCompany.id,
      projectId: villaProject.id,
      verified: true,
      verifiedAt: new Date(),
    },
  })

  // ========================================
  // LEGACY ACCOUNTS
  // ========================================
  await prisma.user.upsert({
    where: { email: 'demo@woningpaspoort.nl' },
    update: { password: hashedPassword, updatedAt: new Date() },
    create: {
      id: 'demo-user-1',
      email: 'demo@woningpaspoort.nl',
      name: 'Demo Gebruiker',
      password: hashedPassword,
      role: UserRole.HOMEOWNER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@woningpaspoort.nl' },
    update: { password: hashedPassword, updatedAt: new Date() },
    create: {
      id: 'admin-user-1',
      email: 'admin@woningpaspoort.nl',
      name: 'Admin Woningpaspoort',
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created legacy/admin users')

  // ========================================
  // SUMMARY
  // ========================================
  console.log('')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('🎉 SEEDING COMPLETE!')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('📋 TEST ACCOUNTS:')
  console.log('')
  console.log('🏗️  BUILDER (can see both projects):')
  console.log('   Email:    builder@woningpaspoort.nl')
  console.log('   Password: Demo1234!')
  console.log('   Company:  Bouwbedrijf Jansen B.V.')
  console.log('   Projects: Villa Zonneweide (completed), Kavel 24 (in progress)')
  console.log('')
  console.log('🏠 HOMEOWNER - COMPLETED (AI Active):')
  console.log('   Email:    completed@helder.nl')
  console.log('   Password: Demo1234!')
  console.log('   Property: Villa Zonneweide - Opgeleverd')
  console.log('   Data:     33 documents, 11 timeline events, 18 materials')
  console.log('')
  console.log('🏗️  HOMEOWNER - BUILDING (AI Disabled):')
  console.log('   Email:    building@helder.nl')
  console.log('   Password: Demo1234!')
  console.log('   Property: Kavel 24 - In aanbouw (Dak & Gevel fase)')
  console.log('')
  console.log('👤 ADMIN:')
  console.log('   Email:    admin@woningpaspoort.nl')
  console.log('   Password: Demo1234!')
  console.log('')
  console.log('═══════════════════════════════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
