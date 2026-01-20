/**
 * Prisma Database Seed
 * Creates demo users and sample data for development
 */

import { PrismaClient, UserRole, PropertyType, EnergyLabel } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const TEST_PASSWORD = 'Test123!'

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for all test users
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 12)

  // Create demo homeowner
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@woningpaspoort.nl' },
    update: {},
    create: {
      id: 'demo-user-1',
      email: 'demo@woningpaspoort.nl',
      name: 'Familie Van der Berg',
      password: hashedPassword,
      role: UserRole.HOMEOWNER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
    },
  })
  console.log('✅ Created demo homeowner:', demoUser.email)

  // Create demo builder
  const demoBuilder = await prisma.user.upsert({
    where: { email: 'builder@woningpaspoort.nl' },
    update: {},
    create: {
      id: 'demo-builder-1',
      email: 'builder@woningpaspoort.nl',
      name: 'Bouwbedrijf Jansen',
      password: hashedPassword,
      role: UserRole.BUILDER,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
    },
  })
  console.log('✅ Created demo builder:', demoBuilder.email)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@woningpaspoort.nl' },
    update: {},
    create: {
      id: 'admin-user-1',
      email: 'admin@woningpaspoort.nl',
      name: 'Admin Woningpaspoort',
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
    },
  })
  console.log('✅ Created admin user:', adminUser.email)

  // Create a sample property for the demo user
  const sampleProperty = await prisma.property.upsert({
    where: { id: 'demo-property-1' },
    update: {},
    create: {
      id: 'demo-property-1',
      name: 'Villa Zonneweide',
      street: 'Zonnebloemlaan',
      houseNumber: '42',
      postcode: '1234 AB',
      city: 'Amsterdam',
      propertyType: PropertyType.VRIJSTAAND,
      bouwjaar: 2024,
      woonoppervlakte: 185,
      perceelOppervlakte: 450,
      aantalKamers: 6,
      aantalVerdiepingen: 2,
      energielabel: EnergyLabel.A_PLUS_PLUS,
      isNieuwbouw: true,
      ownerId: demoUser.id,
    },
  })
  console.log('✅ Created sample property:', sampleProperty.name)

  console.log('')
  console.log('🎉 Seeding complete!')
  console.log('')
  console.log('📋 Test Login Credentials:')
  console.log('─────────────────────────────────────')
  console.log('Homeowner:  demo@woningpaspoort.nl')
  console.log('Builder:    builder@woningpaspoort.nl')
  console.log('Admin:      admin@woningpaspoort.nl')
  console.log('Password:   Test123!')
  console.log('─────────────────────────────────────')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
