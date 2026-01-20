import { Client } from '@notionhq/client'

// Initialize Notion client
const notion = process.env.NOTION_API_KEY
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null

export interface AssessmentLead {
  // Contact
  name?: string
  email?: string
  phone?: string

  // Assessment answers
  hasPlot: string
  plotLocation?: string
  timeline: string
  budgetRange: string
  financing: string
  contingency: string
  familySize: string
  style: string
  mustHaves?: string[]
  decisionTimeline: string
  partnerAligned: string

  // Results
  score: number
  tier: 'ready' | 'almost' | 'explore'
}

/**
 * Creates a new lead in Notion from assessment completion
 *
 * Expected Notion database properties:
 * - Name (title)
 * - Email (email)
 * - Phone (phone_number)
 * - Tier (select: Klaar, Bijna, Verkennen)
 * - Score (number)
 * - Has Plot (select: yes, searching, considering)
 * - Timeline (select)
 * - Budget Range (select)
 * - Financing (select)
 * - Decision Timeline (select)
 * - Family Size (select)
 * - Style (select)
 * - Created (created_time - automatic)
 */
export async function createAssessmentLead(lead: AssessmentLead): Promise<{ success: boolean; pageId?: string; error?: string }> {
  if (!notion) {
    console.warn('Notion client not initialized - NOTION_API_KEY not set')
    return { success: false, error: 'Notion not configured' }
  }

  const databaseId = process.env.NOTION_LEADS_DATABASE_ID
  if (!databaseId) {
    console.warn('NOTION_LEADS_DATABASE_ID not set')
    return { success: false, error: 'Notion database not configured' }
  }

  const tierLabels = {
    ready: 'Klaar',
    almost: 'Bijna',
    explore: 'Verkennen',
  }

  const budgetLabels: Record<string, string> = {
    '400-500': '€400k-€500k',
    '500-600': '€500k-€600k',
    '600-700': '€600k-€700k',
    '700+': '€700k+',
  }

  const plotLabels: Record<string, string> = {
    yes: 'Ja, heeft kavel',
    searching: 'Actief zoekend',
    considering: 'Oriënterend',
  }

  const timelineLabels: Record<string, string> = {
    '6-12months': '6-12 maanden',
    '1-2years': '1-2 jaar',
    '2-3years': '2-3 jaar',
    flexible: 'Flexibel',
  }

  const financingLabels: Record<string, string> = {
    approved: 'Hypotheek goedgekeurd',
    inprogress: 'In gesprek met bank',
    notstarted: 'Nog niet gestart',
    cash: 'Eigen middelen',
  }

  const decisionLabels: Record<string, string> = {
    ready: 'Klaar om te starten',
    '1month': 'Binnen 1 maand',
    '3months': 'Binnen 3 maanden',
    exploring: 'Oriënterend',
  }

  const familyLabels: Record<string, string> = {
    couple: 'Stel (2)',
    'small-family': 'Klein gezin (3-4)',
    'large-family': 'Groot gezin (5+)',
    multigenerational: 'Meergeneratie',
  }

  const styleLabels: Record<string, string> = {
    modern: 'Modern',
    traditional: 'Traditioneel',
    countryside: 'Landelijk',
    sustainable: 'Duurzaam',
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // Name (title) - use email as fallback if no name
        Name: {
          title: [
            {
              text: {
                content: lead.name || lead.email || 'Anonieme lead',
              },
            },
          ],
        },
        // Tier (select)
        Tier: {
          select: {
            name: tierLabels[lead.tier],
          },
        },
        // Score (number)
        Score: {
          number: lead.score,
        },
        // Has Plot (select)
        'Has Plot': {
          select: {
            name: plotLabels[lead.hasPlot] || lead.hasPlot,
          },
        },
        // Timeline (select)
        Timeline: {
          select: {
            name: timelineLabels[lead.timeline] || lead.timeline,
          },
        },
        // Budget Range (select)
        'Budget Range': {
          select: {
            name: budgetLabels[lead.budgetRange] || lead.budgetRange,
          },
        },
        // Financing (select)
        Financing: {
          select: {
            name: financingLabels[lead.financing] || lead.financing,
          },
        },
        // Decision Timeline (select)
        'Decision Timeline': {
          select: {
            name: decisionLabels[lead.decisionTimeline] || lead.decisionTimeline,
          },
        },
        // Family Size (select)
        'Family Size': {
          select: {
            name: familyLabels[lead.familySize] || lead.familySize,
          },
        },
        // Style (select)
        Style: {
          select: {
            name: styleLabels[lead.style] || lead.style,
          },
        },
        // Email (email) - only if provided
        ...(lead.email && {
          Email: {
            email: lead.email,
          },
        }),
        // Phone (phone_number) - only if provided
        ...(lead.phone && {
          Phone: {
            phone_number: lead.phone,
          },
        }),
      },
    })

    return { success: true, pageId: response.id }
  } catch (error) {
    console.error('Failed to create Notion lead:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
