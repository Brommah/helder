/**
 * Prisma Database Seed
 * Creates demo users and sample data for development
 */

import { PrismaClient, UserRole, PropertyType, PropertyStatus, EnergyLabel, ConstructionPhase } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const TEST_PASSWORD = 'Demo1234!'

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for all test users
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 12)

  // ========================================
  // ACCOUNT 1: Completed home (AI Active)
  // ========================================
  const completedUser = await prisma.user.upsert({
    where: { email: 'completed@helder.nl' },
    update: { password: hashedPassword, updatedAt: new Date() },
    create: {
      id: 'user-completed-1',
      email: 'completed@helder.nl',
      name: 'Familie De Vries',
      password: hashedPassword,
      role: UserRole.HOMEOWNER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created completed home owner:', completedUser.email)

  // Completed property - AI is active
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
      isNieuwbouw: true,
      status: PropertyStatus.ACTIVE,
      verificationBadge: true,
      wozWaarde: 685000,
      wozYear: 2025,
      ownerId: completedUser.id,
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created completed property:', completedProperty.name)

  // ========================================
  // ACCOUNT 2: Building home (AI Disabled)
  // ========================================
  const buildingUser = await prisma.user.upsert({
    where: { email: 'building@helder.nl' },
    update: { password: hashedPassword, updatedAt: new Date() },
    create: {
      id: 'user-building-1',
      email: 'building@helder.nl',
      name: 'Familie Janssen',
      password: hashedPassword,
      role: UserRole.HOMEOWNER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created building home owner:', buildingUser.email)

  // Under construction property - AI is disabled
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

  // ========================================
  // LEGACY: Keep old demo user for backwards compatibility
  // ========================================
  const demoUser = await prisma.user.upsert({
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
  console.log('✅ Created legacy demo user:', demoUser.email)

  // Create demo builder
  const demoBuilder = await prisma.user.upsert({
    where: { email: 'builder@woningpaspoort.nl' },
    update: { password: hashedPassword, updatedAt: new Date() },
    create: {
      id: 'demo-builder-1',
      email: 'builder@woningpaspoort.nl',
      name: 'Bouwbedrijf Jansen',
      password: hashedPassword,
      role: UserRole.BUILDER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
      updatedAt: new Date(),
    },
  })
  console.log('✅ Created demo builder:', demoBuilder.email)

  // Create admin user
  const adminUser = await prisma.user.upsert({
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
  console.log('✅ Created admin user:', adminUser.email)

  console.log('')
  console.log('🎉 Seeding complete!')
  console.log('')
  console.log('📋 Test Login Credentials:')
  console.log('═══════════════════════════════════════════════════')
  console.log('')
  console.log('🏠 COMPLETED HOME (AI Active):')
  console.log('   Email:    completed@helder.nl')
  console.log('   Password: Demo1234!')
  console.log('   → Villa Zonneweide - Opgeleverd, AI actief')
  console.log('')
  console.log('🏗️  BUILDING HOME (AI Disabled):')
  console.log('   Email:    building@helder.nl')
  console.log('   Password: Demo1234!')
  console.log('   → Kavel 24 - In aanbouw, AI nog niet beschikbaar')
  console.log('')
  console.log('═══════════════════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
