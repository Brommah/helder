/**
 * Builder Project Detail API
 * Fetches complete project data for builder view
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a builder/contractor/admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { Company: true }
    })

    if (!user || !['BUILDER', 'CONTRACTOR', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { id: projectId } = await params

    // Fetch project with all related data
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        Property: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              }
            },
            Document: {
              orderBy: { documentDate: 'desc' },
            },
            TimelineEvent: {
              orderBy: { occurredAt: 'desc' },
            },
            CostBreakdown: true,
          }
        },
        ProjectPhase: {
          orderBy: { order: 'asc' },
        },
        Document: {
          orderBy: { documentDate: 'desc' },
        },
        TimelineEvent: {
          orderBy: { occurredAt: 'desc' },
        },
        MaterialUsage: {
          orderBy: { category: 'asc' },
        },
        WhatsAppMessage: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        Company: true,
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Verify builder has access to this project (same company or admin)
    if (user.role !== 'ADMIN' && user.companyId !== project.companyId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Combine documents from project and property
    const allDocuments = [
      ...project.Document,
      ...(project.Property?.Document || [])
    ].filter((doc, index, self) => 
      index === self.findIndex(d => d.id === doc.id)
    )

    // Combine timeline events
    const allTimelineEvents = [
      ...project.TimelineEvent,
      ...(project.Property?.TimelineEvent || [])
    ].filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    ).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

    // Calculate stats
    const photoCount = allDocuments.filter(d => d.type === 'PHOTO').length
    const documentCount = allDocuments.length
    
    // Calculate quality score from document AI data
    const photosWithQuality = allDocuments.filter(d => {
      const data = d.extractedData as { aiClassification?: { quality?: { score: number } } } | null
      return data?.aiClassification?.quality?.score !== undefined
    })
    
    const avgQuality = photosWithQuality.length > 0
      ? Math.round(photosWithQuality.reduce((sum, d) => {
          const data = d.extractedData as { aiClassification?: { quality?: { score: number } } }
          return sum + ((data?.aiClassification?.quality?.score || 0) * 10)
        }, 0) / photosWithQuality.length)
      : 85 // Default score if no AI data

    // Calculate issue count from AI data
    const issueCount = allDocuments.reduce((count, d) => {
      const data = d.extractedData as { aiClassification?: { quality?: { issues: string[] } } } | null
      return count + (data?.aiClassification?.quality?.issues?.length || 0)
    }, 0)

    // Calculate progress from phases
    const completedPhases = project.ProjectPhase.filter(p => p.status === 'COMPLETED').length
    const totalPhases = project.ProjectPhase.length
    const progress = totalPhases > 0 
      ? Math.round((completedPhases / totalPhases) * 100)
      : 0

    // Format response
    const response = {
      id: project.id,
      name: project.name,
      description: project.description,
      type: project.type,
      status: project.status,
      property: project.Property ? {
        id: project.Property.id,
        name: project.Property.name,
        address: `${project.Property.street || ''} ${project.Property.houseNumber || ''}`.trim() || project.Property.name,
        city: project.Property.city,
        postcode: project.Property.postcode,
        propertyType: project.Property.propertyType,
        woonoppervlakte: project.Property.woonoppervlakte || 0,
        perceelOppervlakte: project.Property.perceelOppervlakte || 0,
        energielabel: project.Property.energielabel,
        owner: {
          name: project.Property.User?.name || 'Onbekend',
          email: project.Property.User?.email || '',
          phone: project.Property.User?.phone || '',
        }
      } : null,
      phases: project.ProjectPhase.map(phase => ({
        id: phase.id,
        name: phase.name,
        order: phase.order,
        status: phase.status,
        plannedStart: phase.plannedStart?.toISOString(),
        plannedEnd: phase.plannedEnd?.toISOString(),
        actualStart: phase.actualStart?.toISOString(),
        actualEnd: phase.actualEnd?.toISOString(),
      })),
      documents: allDocuments.map(doc => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        type: doc.type,
        fileUrl: doc.fileUrl,
        documentDate: doc.documentDate?.toISOString() || doc.createdAt.toISOString(),
        verified: doc.verified,
        source: doc.source,
        extractedData: doc.extractedData,
      })),
      timeline: allTimelineEvents.map(event => ({
        id: event.id,
        type: event.type,
        title: event.title,
        description: event.description,
        occurredAt: event.occurredAt.toISOString(),
        verified: event.verified,
      })),
      materials: project.MaterialUsage.map(mat => ({
        id: mat.id,
        category: mat.category,
        name: mat.name,
        brand: mat.brand,
        quantity: mat.quantity,
        unit: mat.unit,
        location: mat.location,
      })),
      costs: project.Property?.CostBreakdown?.map(cost => ({
        category: cost.category,
        description: cost.description,
        budgeted: cost.budgeted,
        actual: cost.actual || 0,
      })) || [],
      messages: project.WhatsAppMessage.map(msg => ({
        id: msg.id,
        content: msg.content,
        mediaUrl: msg.mediaUrl,
        createdAt: msg.createdAt.toISOString(),
        direction: msg.direction,
      })),
      stats: {
        totalPhotos: photoCount,
        totalDocuments: documentCount,
        qualityScore: avgQuality,
        issueCount: issueCount,
        progress: progress,
      },
      plannedStart: project.plannedStart?.toISOString(),
      plannedEnd: project.plannedEnd?.toISOString(),
      actualStart: project.actualStart?.toISOString(),
      actualEnd: project.actualEnd?.toISOString(),
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
