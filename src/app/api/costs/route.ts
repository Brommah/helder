import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CostCategory } from '@prisma/client';
import { z } from 'zod';

/**
 * Get cost breakdown for a property
 * GET /api/costs?propertyId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'propertyId is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this property
    if (session?.user?.id) {
      const property = await db.property.findFirst({
        where: {
          id: propertyId,
          ownerId: session.user.id,
        },
      });

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
    }

    // Get cost breakdown
    const costs = await db.costBreakdown.findMany({
      where: { propertyId },
      orderBy: { category: 'asc' },
    });

    // Calculate totals
    const totals = costs.reduce(
      (acc, cost) => ({
        budgeted: acc.budgeted + Number(cost.budgeted),
        actual: acc.actual + Number(cost.actual),
      }),
      { budgeted: 0, actual: 0 }
    );

    return NextResponse.json({
      costs,
      totals,
      variance: totals.budgeted - totals.actual,
      variancePercentage: totals.budgeted > 0
        ? ((totals.actual - totals.budgeted) / totals.budgeted) * 100
        : 0,
    });
  } catch (error) {
    console.error('[Costs API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

const costSchema = z.object({
  propertyId: z.string(),
  category: z.nativeEnum(CostCategory),
  budgeted: z.number().min(0),
  actual: z.number().min(0).optional(),
  description: z.string().optional(),
});

/**
 * Create or update a cost breakdown entry
 * POST /api/costs
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = costSchema.parse(body);

    // Verify user has access to this property
    const property = await db.property.findFirst({
      where: {
        id: data.propertyId,
        ownerId: session.user.id,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Upsert cost breakdown (unique on propertyId + category)
    const cost = await db.costBreakdown.upsert({
      where: {
        propertyId_category: {
          propertyId: data.propertyId,
          category: data.category,
        },
      },
      create: {
        id: `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        propertyId: data.propertyId,
        category: data.category,
        budgeted: data.budgeted,
        actual: data.actual || 0,
        description: data.description || null,
        updatedAt: new Date(),
      },
      update: {
        budgeted: data.budgeted,
        actual: data.actual ?? undefined,
        description: data.description ?? undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, cost });
  } catch (error) {
    console.error('[Costs API] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update actual costs (for builders)
 * PUT /api/costs
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { costId, actual } = body;

    if (!costId || actual === undefined) {
      return NextResponse.json(
        { error: 'costId and actual are required' },
        { status: 400 }
      );
    }

    // Get the cost record and verify access
    const existingCost = await db.costBreakdown.findUnique({
      where: { id: costId },
      include: {
        Property: {
          select: { ownerId: true },
        },
      },
    });

    if (!existingCost) {
      return NextResponse.json({ error: 'Cost not found' }, { status: 404 });
    }

    // Allow owner or check if user is builder on the project
    const isOwner = existingCost.Property.ownerId === session.user.id;
    const userRole = (session.user as { role?: string }).role;
    const isBuilder = userRole === 'BUILDER' || userRole === 'CONTRACTOR';

    if (!isOwner && !isBuilder) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update actual cost
    const cost = await db.costBreakdown.update({
      where: { id: costId },
      data: {
        actual,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, cost });
  } catch (error) {
    console.error('[Costs API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
