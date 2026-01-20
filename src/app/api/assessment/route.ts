import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAssessmentLead } from '@/lib/notion'

const assessmentSchema = z.object({
  // Contact info (optional)
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),

  // Assessment answers (required)
  hasPlot: z.string(),
  plotLocation: z.string().optional(),
  timeline: z.string(),
  budgetRange: z.string(),
  financing: z.string(),
  contingency: z.string(),
  familySize: z.string(),
  style: z.string(),
  mustHaves: z.array(z.string()).optional(),
  decisionTimeline: z.string(),
  partnerAligned: z.string(),

  // Results
  score: z.number(),
  tier: z.enum(['ready', 'almost', 'explore']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = assessmentSchema.parse(body)

    // Send to Notion
    const result = await createAssessmentLead(data)

    if (!result.success) {
      // Log error but don't fail the request - lead capture shouldn't block UX
      console.warn('Failed to create Notion lead:', result.error)
    }

    return NextResponse.json({
      success: true,
      notionSynced: result.success,
      pageId: result.pageId,
    })
  } catch (error) {
    console.error('Assessment submission error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}
