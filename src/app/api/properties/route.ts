import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createPropertySchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  kavelNumber: z.string().optional(),
  projectName: z.string().optional(),
  city: z.string().min(1, 'Plaats is verplicht'),
  propertyType: z.enum([
    'VRIJSTAAND',
    'TWEE_ONDER_EEN_KAP',
    'HOEKWONING',
    'TUSSENWONING',
    'APPARTEMENT',
    'VILLA',
    'OTHER'
  ]),
  woonoppervlakte: z.number().optional(),
  perceelOppervlakte: z.number().optional(),
  aantalKamers: z.number().optional(),
  aantalVerdiepingen: z.number().optional(),
  startDate: z.string().optional(),
  expectedEnd: z.string().optional(),
  currentPhase: z.enum([
    'GRONDWERK',
    'RUWBOUW',
    'DAK_GEVEL',
    'INSTALLATIES',
    'AFBOUW',
    'OPLEVERING'
  ]).optional(),
  energielabel: z.string().optional(),
})

// GET - List user's properties
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 }
      )
    }

    const properties = await db.property.findMany({
      where: { ownerId: session.user.id },
      include: {
        costs: true,
        _count: {
          select: {
            documents: true,
            timeline: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Fout bij ophalen woningen' },
      { status: 500 }
    )
  }
}

// POST - Create new property
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = createPropertySchema.parse(body)

    const property = await db.property.create({
      data: {
        name: validated.name,
        kavelNumber: validated.kavelNumber,
        projectName: validated.projectName,
        city: validated.city,
        propertyType: validated.propertyType,
        woonoppervlakte: validated.woonoppervlakte,
        perceelOppervlakte: validated.perceelOppervlakte,
        aantalKamers: validated.aantalKamers,
        aantalVerdiepingen: validated.aantalVerdiepingen,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        expectedEnd: validated.expectedEnd ? new Date(validated.expectedEnd) : null,
        currentPhase: validated.currentPhase,
        energielabel: validated.energielabel as any,
        isNieuwbouw: true,
        status: 'UNDER_CONSTRUCTION',
        verificationBadge: true, // Mock for now
        ownerId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      property: {
        id: property.id,
        name: property.name,
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Fout bij aanmaken woning' },
      { status: 500 }
    )
  }
}
