import { db } from '@/lib/db';
import { downloadTwilioMedia, sendWhatsAppMessage } from './twilio';
import { DocumentType, MessageStatus, EventType } from '@prisma/client';
import { classifyConstructionImage, getTimelineEventType, ClassificationResult } from '../ai/classify-image';
import {
  analyzePhaseProgress,
  autoAdvancePhase,
  buildPhaseTransitionMessage,
  getPhaseStatus,
  type DetailedPhase,
} from '../ai/phase-detection';
import { transcribeAudio, isAudioMessage, estimateAudioDuration } from '../ai/transcribe';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Mock builder names for demo
const BUILDER_NAMES = [
  'Jan van der Berg',
  'Pieter de Vries',
  'Klaas Bakker',
  'Willem Jansen',
  'Henk Smit',
];

function getRandomBuilder(): string {
  return BUILDER_NAMES[Math.floor(Math.random() * BUILDER_NAMES.length)];
}

/**
 * Process an incoming WhatsApp message
 */
export async function processIncomingMessage(messageId: string): Promise<void> {
  // Mark as processing
  const message = await db.whatsAppMessage.update({
    where: { id: messageId },
    data: { status: MessageStatus.PROCESSING },
  });

  try {
    // Find linked WhatsApp number
    const whatsappNumber = await db.whatsAppNumber.findUnique({
      where: { phoneNumber: message.fromPhone },
      include: {
        company: true,
        project: {
          include: {
            Property: true,
          },
        },
      },
    });

    // Unknown or unverified sender
    if (!whatsappNumber) {
      console.log('Message from unknown number:', message.fromPhone);
      await sendWhatsAppMessage(
        message.fromPhone,
        'Helder: Dit nummer is niet gekoppeld aan een project. Vraag je opdrachtgever om je uit te nodigen via het Helder dashboard.'
      );
      await db.whatsAppMessage.update({
        where: { id: messageId },
        data: { status: MessageStatus.FAILED },
      });
      return;
    }

    if (!whatsappNumber.verified) {
      // Check if this is a verification code
      if (message.content && whatsappNumber.verifyCode) {
        const isValidCode =
          message.content.trim() === whatsappNumber.verifyCode &&
          whatsappNumber.verifyExpiry &&
          new Date() < whatsappNumber.verifyExpiry;

        if (isValidCode) {
          await db.whatsAppNumber.update({
            where: { id: whatsappNumber.id },
            data: {
              verified: true,
              verifiedAt: new Date(),
              verifyCode: null,
              verifyExpiry: null,
            },
          });

          await sendWhatsAppMessage(
            message.fromPhone,
            `Helder: Nummer geverifieerd! Je kunt nu foto's sturen die automatisch worden toegevoegd aan ${whatsappNumber.project?.name || 'je project'}.`
          );

          await db.whatsAppMessage.update({
            where: { id: messageId },
            data: {
              status: MessageStatus.PROCESSED,
              processedAt: new Date(),
              whatsappNumberId: whatsappNumber.id,
              projectId: whatsappNumber.projectId,
            },
          });
          return;
        }
      }

      // Not verified, send reminder
      await sendWhatsAppMessage(
        message.fromPhone,
        'Helder: Dit nummer is nog niet geverifieerd. Voer je verificatie code in of vraag een nieuwe aan via het dashboard.'
      );
      await db.whatsAppMessage.update({
        where: { id: messageId },
        data: { status: MessageStatus.FAILED },
      });
      return;
    }

    // Verified sender - process message
    if (message.mediaUrl && message.mediaType) {
      // Check if this is an audio message (voice note)
      if (isAudioMessage(message.mediaType)) {
        // Process voice note
        const voiceNoteResult = await processVoiceNote(message, whatsappNumber);

        if (voiceNoteResult) {
          await db.whatsAppMessage.update({
            where: { id: messageId },
            data: {
              whatsappNumberId: whatsappNumber.id,
              projectId: whatsappNumber.projectId,
              status: MessageStatus.PROCESSED,
              processedAt: new Date(),
            },
          });

          // Send confirmation with transcription preview
          const preview = voiceNoteResult.transcription
            ? voiceNoteResult.transcription.substring(0, 150) + (voiceNoteResult.transcription.length > 150 ? '...' : '')
            : null;

          const feedbackMessage = preview
            ? `*Voice note ontvangen en getranscribeerd:*\n\n"${preview}"\n\n${voiceNoteResult.linkedToPhoto ? '📷 Gekoppeld aan vorige foto' : ''}\n🕐 ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}`
            : `*Voice note opgeslagen*\n\n⚠️ Transcriptie niet beschikbaar\n\n🕐 ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}`;

          await sendWhatsAppMessage(message.fromPhone, feedbackMessage);
        } else {
          await db.whatsAppMessage.update({
            where: { id: messageId },
            data: {
              status: MessageStatus.FAILED,
              whatsappNumberId: whatsappNumber.id,
              projectId: whatsappNumber.projectId,
            },
          });
        }
      } else {
        // Process media (photo/video)
        const document = await processMedia(message, whatsappNumber);

        if (document) {
          await db.whatsAppMessage.update({
            where: { id: messageId },
            data: {
              documentId: document.doc.id,
              whatsappNumberId: whatsappNumber.id,
              projectId: whatsappNumber.projectId,
              status: MessageStatus.PROCESSED,
              processedAt: new Date(),
            },
          });

          // Send rich feedback with AI analysis
          const feedbackMessage = buildFeedbackMessage(
            whatsappNumber.project?.name || 'je project',
            document.classification,
            document.builderName
          );
          await sendWhatsAppMessage(message.fromPhone, feedbackMessage);

          // If phase was auto-advanced, send additional notification
          if (document.phaseTransition) {
            // Small delay to separate messages
            await new Promise(resolve => setTimeout(resolve, 1000));
            await sendWhatsAppMessage(message.fromPhone, document.phaseTransition.message);
          }
        } else {
          await db.whatsAppMessage.update({
            where: { id: messageId },
            data: {
              status: MessageStatus.FAILED,
              whatsappNumberId: whatsappNumber.id,
              projectId: whatsappNumber.projectId,
            },
          });
        }
      }
    } else {
      // Text-only message - acknowledge receipt
      await db.whatsAppMessage.update({
        where: { id: messageId },
        data: {
          whatsappNumberId: whatsappNumber.id,
          projectId: whatsappNumber.projectId,
          status: MessageStatus.PROCESSED,
          processedAt: new Date(),
        },
      });

      // Handle text commands
      if (message.content) {
        await handleTextCommand(message.content, whatsappNumber);
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
    await db.whatsAppMessage.update({
      where: { id: messageId },
      data: { status: MessageStatus.FAILED },
    });
  }
}

/**
 * Process media attachment and create document
 */
async function processMedia(
  message: { id: string; mediaUrl: string | null; mediaType: string | null; content: string | null },
  whatsappNumber: {
    id: string;
    projectId: string | null;
    project: { id: string; Property: { id: string } } | null;
    company: { id: string };
  }
) {
  if (!message.mediaUrl || !message.mediaType || !whatsappNumber.projectId) {
    return null;
  }

  try {
    // Try to download media from Twilio (requires Auth Token)
    const mediaBuffer = await downloadTwilioMedia(message.mediaUrl);
    const fileSize = mediaBuffer?.length || 0;

    // Determine document type from media type
    const docType = getDocumentType(message.mediaType);

    // Store the Twilio URL directly
    const fileUrl = message.mediaUrl;

    // Find a system user or the first user of the company to set as uploader
    const companyUser = await db.user.findFirst({
      where: { companyId: whatsappNumber.company.id },
    });

    if (!companyUser) {
      console.error('No user found for company');
      return null;
    }

    // AI Classification for images
    let classification: ClassificationResult | null = null;
    const builderName = getRandomBuilder();
    const timestamp = new Date();

    if (mediaBuffer && message.mediaType?.startsWith('image/')) {
      try {
        classification = await classifyConstructionImage(
          mediaBuffer,
          message.mediaType,
          message.content || undefined
        );
        console.log('[AI] Classified image:', classification);
      } catch (aiError) {
        console.error('[AI] Classification failed:', aiError);
      }
    }

    // Helper to build detailed description
    const buildDetailedDescription = (c: ClassificationResult, builder: string): string => {
      const lines: string[] = [c.description, ''];

      lines.push(`📋 Ingediend door: ${builder}`);
      lines.push(`🏗️ Fase: ${c.phaseName}`);
      lines.push(`📂 Categorie: ${c.category}`);

      if (c.location && Object.keys(c.location).length > 0) {
        const loc = [c.location.floor, c.location.room, c.location.wall, c.location.position].filter(Boolean);
        if (loc.length) lines.push(`📍 Locatie: ${loc.join(' - ')}`);
      }

      if (c.materials && c.materials.length > 0) {
        lines.push('', '🧱 Materialen:');
        c.materials.forEach((m: { name: string; type?: string; brand?: string; dimensions?: string; color?: string; quantity?: string }) => {
          const details = [m.type, m.brand, m.dimensions, m.color].filter(Boolean).join(', ');
          lines.push(`  • ${m.name}${details ? ` (${details})` : ''}${m.quantity ? ` - ${m.quantity}` : ''}`);
        });
      }

      if (c.quality) {
        lines.push('', `✅ Kwaliteitsscore: ${c.quality.score}/10`);
        if (c.quality.notes?.length) c.quality.notes.forEach((n: string) => lines.push(`  ✓ ${n}`));
        if (c.quality.issues?.length) c.quality.issues.forEach((i: string) => lines.push(`  ⚠️ ${i}`));
      }

      if (c.technicalSpecs?.length) {
        lines.push('', '📐 Technische specificaties:');
        c.technicalSpecs.forEach((s: string) => lines.push(`  • ${s}`));
      }

      if (c.measurements?.length) {
        lines.push('', '📏 Afmetingen:');
        c.measurements.forEach((m: string) => lines.push(`  • ${m}`));
      }

      if (c.equipmentDetected?.length || c.toolsVisible?.length) {
        const equipment = [...(c.equipmentDetected || []), ...(c.toolsVisible || [])];
        if (equipment.length) lines.push('', `🔧 Gereedschap/materieel: ${equipment.join(', ')}`);
      }

      if (c.safetyObservations?.length) {
        lines.push('', '🦺 Veiligheid:');
        c.safetyObservations.forEach((s: string) => lines.push(`  • ${s}`));
      }

      if (c.nextSteps?.length) {
        lines.push('', '➡️ Volgende stappen:');
        c.nextSteps.forEach((s: string) => lines.push(`  • ${s}`));
      }

      if (c.attentionPoints?.length) {
        lines.push('', '⚠️ Aandachtspunten:');
        c.attentionPoints.forEach((a: string) => lines.push(`  • ${a}`));
      }

      if (c.progressPercentage !== undefined) {
        lines.push('', `📊 Voortgang: ${c.progressPercentage}%`);
      }

      lines.push('', `🎯 AI zekerheid: ${Math.round(c.confidence * 100)}%`);

      return lines.join('\n');
    };

    // Generate smart document name
    const docName = classification
      ? `${classification.title} - ${builderName}`
      : `Bouwfoto ${timestamp.toLocaleDateString('nl-NL')}`;

    const docDescription = classification
      ? buildDetailedDescription(classification, builderName)
      : message.content || `Foto ingediend door ${builderName}`;

    // Create document record
    const document = await db.document.create({
      data: {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: docName,
        description: docDescription,
        type: docType,
        fileUrl: fileUrl,
        fileSize: fileSize,
        mimeType: message.mediaType,
        projectId: whatsappNumber.projectId,
        propertyId: whatsappNumber.project?.Property?.id,
        uploadedById: companyUser.id,
        source: 'WHATSAPP',
        updatedAt: new Date(),
        extractedData: (classification ? {
          originalMediaUrl: message.mediaUrl,
          senderPhone: message.id,
          messageContent: message.content,
          whatsappNumberId: whatsappNumber.id,
          submittedBy: builderName,
          submittedAt: timestamp.toISOString(),
          aiClassification: {
            phase: classification.phase,
            phaseName: classification.phaseName,
            category: classification.category,
            title: classification.title,
            description: classification.description,
            confidence: classification.confidence,
            detectedElements: classification.detectedElements,
            materials: classification.materials,
            location: classification.location,
            quality: classification.quality,
            safetyObservations: classification.safetyObservations,
            complianceNotes: classification.complianceNotes,
            progressPercentage: classification.progressPercentage,
            workStatus: classification.workStatus,
            weatherConditions: classification.weatherConditions,
            lighting: classification.lighting,
            workersVisible: classification.workersVisible,
            equipmentDetected: classification.equipmentDetected,
            toolsVisible: classification.toolsVisible,
            measurements: classification.measurements,
            technicalSpecs: classification.technicalSpecs,
            nextSteps: classification.nextSteps,
            attentionPoints: classification.attentionPoints,
          },
        } : {
          originalMediaUrl: message.mediaUrl,
          senderPhone: message.id,
          messageContent: message.content,
          whatsappNumberId: whatsappNumber.id,
          submittedBy: builderName,
          submittedAt: timestamp.toISOString(),
        }) as any,
      },
    });

    // Create timeline event with AI-classified phase
    if (docType === DocumentType.PHOTO || docType === DocumentType.VIDEO) {
      const propertyId = whatsappNumber.project?.Property?.id;
      if (propertyId) {
        // Helper to build timeline description
        const buildTimelineDescription = (c: ClassificationResult, builder: string): string => {
          const lines: string[] = [c.description];

          lines.push(`\n📸 Ingediend door ${builder}`);
          lines.push(`🏗️ Fase: ${c.phaseName}`);
          lines.push(`📂 Categorie: ${c.category}`);

          if (c.quality?.score) lines.push(`✅ Kwaliteit: ${c.quality.score}/10`);
          if (c.progressPercentage !== undefined) lines.push(`📊 Voortgang: ${c.progressPercentage}%`);

          if (c.materials?.length) {
            lines.push(`🧱 Materialen: ${c.materials.map((m: { name: string }) => m.name).join(', ')}`);
          }

          if (c.attentionPoints?.length) {
            lines.push(`⚠️ Let op: ${c.attentionPoints.join('; ')}`);
          }

          lines.push(`🎯 Zekerheid: ${Math.round(c.confidence * 100)}%`);

          return lines.join('\n');
        };

        const eventType = classification
          ? getTimelineEventType(classification.phase)
          : EventType.DOCUMENT_ADDED;

        const eventTitle = classification
          ? `${classification.phaseName}: ${classification.title}`
          : docType === DocumentType.PHOTO ? 'Foto toegevoegd' : 'Video toegevoegd';

        const eventDescription = classification
          ? buildTimelineDescription(classification, builderName)
          : `Foto ingediend door ${builderName}`;

        await db.timelineEvent.create({
          data: {
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: eventType,
            title: eventTitle,
            description: eventDescription,
            occurredAt: timestamp,
            propertyId,
            projectId: whatsappNumber.projectId,
            createdById: companyUser.id,
            metadata: (classification ? {
              phase: classification.phase,
              phaseName: classification.phaseName,
              category: classification.category,
              confidence: classification.confidence,
              submittedBy: builderName,
              documentId: document.id,
              detectedElements: classification.detectedElements,
              materials: classification.materials,
              location: classification.location,
              quality: classification.quality,
              technicalSpecs: classification.technicalSpecs,
              measurements: classification.measurements,
              progressPercentage: classification.progressPercentage,
              workStatus: classification.workStatus,
              safetyObservations: classification.safetyObservations,
              complianceNotes: classification.complianceNotes,
              weatherConditions: classification.weatherConditions,
              workersVisible: classification.workersVisible,
              equipmentDetected: classification.equipmentDetected,
              toolsVisible: classification.toolsVisible,
              nextSteps: classification.nextSteps,
              attentionPoints: classification.attentionPoints,
            } : undefined) as any,
          },
        });
      }
    }

    // Auto-create Issues from AI-detected quality problems
    if (classification?.quality?.issues && classification.quality.issues.length > 0) {
      try {
        const issues = await Promise.all(
          classification.quality.issues.map(async (issueText: string) => {
            // Determine severity based on keywords
            let severity = 'medium';
            const lowerIssue = issueText.toLowerCase();
            if (lowerIssue.includes('kritiek') || lowerIssue.includes('gevaar') || lowerIssue.includes('veiligheid') || lowerIssue.includes('critical')) {
              severity = 'critical';
            } else if (lowerIssue.includes('hoog') || lowerIssue.includes('ernstig') || lowerIssue.includes('belangrijk')) {
              severity = 'high';
            } else if (lowerIssue.includes('klein') || lowerIssue.includes('minor') || lowerIssue.includes('laag')) {
              severity = 'low';
            }

            return db.issue.create({
              data: {
                projectId: whatsappNumber.projectId!,
                documentId: document.id,
                title: issueText.length > 100 ? issueText.substring(0, 100) + '...' : issueText,
                description: `Automatisch gedetecteerd door AI tijdens analyse van bouwfoto.\n\nOriginele melding: ${issueText}\n\nFase: ${classification.phaseName || 'Onbekend'}\nIngediend door: ${builderName}`,
                severity,
                status: 'open',
                phase: classification.phase || null,
                assignedTo: null,
              },
            });
          })
        );
        console.log(`[Issues] Auto-created ${issues.length} issues from AI detection`);
      } catch (issueError) {
        console.error('[Issues] Failed to auto-create issues:', issueError);
        // Don't fail the whole process if issue creation fails
      }
    }

    // Auto-Phase Detection: Analyze recent photos and potentially advance phase
    if (classification && whatsappNumber.projectId) {
      try {
        const phaseAnalysis = await analyzePhaseProgress(whatsappNumber.projectId);

        console.log('[Phase Detection] Analysis result:', {
          currentPhase: phaseAnalysis.currentPhase,
          confidence: phaseAnalysis.currentPhaseConfidence,
          readyToAdvance: phaseAnalysis.readyToAdvance,
          suggestedNextPhase: phaseAnalysis.suggestedNextPhase,
        });

        // If ready to advance, do it automatically
        if (phaseAnalysis.readyToAdvance && phaseAnalysis.suggestedNextPhase) {
          const advanceResult = await autoAdvancePhase(
            whatsappNumber.projectId,
            phaseAnalysis,
            companyUser.id
          );

          if (advanceResult.advanced && advanceResult.newPhase) {
            console.log('[Phase Detection] Phase auto-advanced to:', advanceResult.newPhase);

            // Send phase transition notification via WhatsApp
            const transitionMessage = buildPhaseTransitionMessage(
              phaseAnalysis.currentPhase,
              advanceResult.newPhase,
              phaseAnalysis.advanceReason || 'AI analyse'
            );

            // We'll append this to the main feedback message
            return {
              doc: document,
              classification,
              builderName,
              phaseTransition: {
                from: phaseAnalysis.currentPhase,
                to: advanceResult.newPhase,
                message: transitionMessage,
              },
            };
          }
        }
      } catch (phaseError) {
        console.error('[Phase Detection] Error analyzing phase:', phaseError);
        // Don't fail the whole process if phase detection fails
      }
    }

    return { doc: document, classification, builderName, phaseTransition: null };
  } catch (error) {
    console.error('Error processing media:', error);
    return null;
  }
}

/**
 * Process voice note (audio message) and create VoiceNote record
 */
async function processVoiceNote(
  message: { id: string; mediaUrl: string | null; mediaType: string | null; content: string | null; fromPhone: string },
  whatsappNumber: {
    id: string;
    projectId: string | null;
    project: { id: string; Property: { id: string } } | null;
    company: { id: string };
  }
): Promise<{ voiceNote: { id: string }; transcription: string | null; linkedToPhoto: boolean } | null> {
  if (!message.mediaUrl || !message.mediaType || !whatsappNumber.projectId) {
    console.error('[VoiceNote] Missing required data:', {
      hasMediaUrl: !!message.mediaUrl,
      hasMediaType: !!message.mediaType,
      hasProjectId: !!whatsappNumber.projectId,
    });
    return null;
  }

  try {
    // Download audio from Twilio
    const audioBuffer = await downloadTwilioMedia(message.mediaUrl);
    if (!audioBuffer) {
      console.error('[VoiceNote] Failed to download audio from Twilio');
      return null;
    }

    console.log(`[VoiceNote] Downloaded audio: ${(audioBuffer.length / 1024).toFixed(1)}KB`);

    // Estimate duration from buffer size
    const estimatedDuration = estimateAudioDuration(audioBuffer.length, message.mediaType);

    // Save audio file to disk
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const extension = message.mediaType.includes('ogg') ? 'ogg' :
                      message.mediaType.includes('mp4') ? 'm4a' :
                      message.mediaType.includes('mpeg') ? 'mp3' : 'ogg';
    const filename = `voice_${timestamp}_${randomStr}.${extension}`;

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'voice-notes');
    await mkdir(uploadsDir, { recursive: true });
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, audioBuffer);

    const audioUrl = `/uploads/voice-notes/${filename}`;
    console.log(`[VoiceNote] Saved audio to: ${audioUrl}`);

    // Try to transcribe the audio
    let transcription: string | null = null;
    let actualDuration: number | undefined;

    try {
      const result = await transcribeAudio(audioBuffer, message.mediaType);
      transcription = result.text;
      actualDuration = result.duration;
      console.log(`[VoiceNote] Transcription successful: "${transcription.substring(0, 100)}..."`);
    } catch (transcribeError) {
      console.error('[VoiceNote] Transcription failed:', transcribeError);
      // Continue without transcription - we still save the audio
    }

    // Check if the previous message was a photo - if so, link voice note to it
    let linkedDocumentId: string | null = null;
    let linkedToPhoto = false;

    try {
      // Find the most recent processed photo from this sender (within last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentPhotoMessage = await db.whatsAppMessage.findFirst({
        where: {
          fromPhone: message.fromPhone,
          projectId: whatsappNumber.projectId,
          documentId: { not: null },
          status: MessageStatus.PROCESSED,
          createdAt: { gte: fiveMinutesAgo },
          mediaType: { startsWith: 'image/' },
        },
        orderBy: { createdAt: 'desc' },
        select: { documentId: true },
      });

      if (recentPhotoMessage?.documentId) {
        linkedDocumentId = recentPhotoMessage.documentId;
        linkedToPhoto = true;
        console.log(`[VoiceNote] Linked to recent photo: ${linkedDocumentId}`);
      }
    } catch (linkError) {
      console.error('[VoiceNote] Error finding recent photo:', linkError);
      // Continue without linking
    }

    // Create VoiceNote record in database
    const voiceNote = await db.voiceNote.create({
      data: {
        projectId: whatsappNumber.projectId,
        documentId: linkedDocumentId,
        audioUrl: audioUrl,
        transcription: transcription,
        duration: actualDuration ?? estimatedDuration,
        createdBy: message.fromPhone,
      },
    });

    console.log(`[VoiceNote] Created voice note: ${voiceNote.id}`);

    return {
      voiceNote: { id: voiceNote.id },
      transcription,
      linkedToPhoto,
    };
  } catch (error) {
    console.error('[VoiceNote] Error processing voice note:', error);
    return null;
  }
}

/**
 * Build feedback message for builder with AI analysis summary
 */
function buildFeedbackMessage(
  projectName: string,
  classification: ClassificationResult | null,
  builderName: string
): string {
  const lines: string[] = [];

  lines.push(`✅ *Helder: Foto ontvangen!*`);
  lines.push(`📁 Toegevoegd aan: ${projectName}`);

  if (classification) {
    lines.push('');
    lines.push(`🏗️ *${classification.title}*`);
    lines.push(`📂 Fase: ${classification.phaseName}`);

    if (classification.quality?.score) {
      const score = classification.quality.score;
      const emoji = score >= 8 ? '🟢' : score >= 6 ? '🟡' : '🔴';
      lines.push(`${emoji} Kwaliteit: ${score}/10`);
    }

    if (classification.progressPercentage !== undefined) {
      lines.push(`📊 Voortgang: ${classification.progressPercentage}%`);
    }

    // Quality notes (positive feedback)
    if (classification.quality?.notes?.length > 0) {
      lines.push('');
      lines.push('✨ *Goed gedaan:*');
      classification.quality.notes.slice(0, 3).forEach((note: string) => {
        lines.push(`  ✓ ${note}`);
      });
    }

    // Issues - important!
    if (classification.quality?.issues?.length > 0) {
      lines.push('');
      lines.push('⚠️ *Let op:*');
      classification.quality.issues.forEach((issue: string) => {
        lines.push(`  • ${issue}`);
      });
    }

    // Attention points - important!
    if (classification.attentionPoints?.length > 0) {
      lines.push('');
      lines.push('🔔 *Aandachtspunten:*');
      classification.attentionPoints.forEach((point: string) => {
        lines.push(`  • ${point}`);
      });
    }

    // Safety observations
    if (classification.safetyObservations?.length > 0) {
      lines.push('');
      lines.push('🦺 *Veiligheid:*');
      classification.safetyObservations.slice(0, 2).forEach((obs: string) => {
        lines.push(`  • ${obs}`);
      });
    }

    // Next steps
    if (classification.nextSteps?.length > 0) {
      lines.push('');
      lines.push('➡️ *Volgende stappen:*');
      classification.nextSteps.slice(0, 3).forEach((step: string) => {
        lines.push(`  → ${step}`);
      });
    }

    // Materials detected (brief)
    if (classification.materials?.length > 0) {
      const materialNames = classification.materials.slice(0, 4).map((m: any) => m.name).join(', ');
      lines.push('');
      lines.push(`🧱 Materialen: ${materialNames}`);
    }
  }

  lines.push('');
  lines.push(`👷 Ingediend door: ${builderName}`);
  lines.push(`🕐 ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}`);

  return lines.join('\n');
}

/**
 * Map MIME type to DocumentType enum
 */
function getDocumentType(mimeType: string): DocumentType {
  if (mimeType.startsWith('image/')) return DocumentType.PHOTO;
  if (mimeType.startsWith('video/')) return DocumentType.VIDEO;
  if (mimeType === 'application/pdf') return DocumentType.OTHER;
  return DocumentType.OTHER;
}

/**
 * Handle text commands from WhatsApp
 */
async function handleTextCommand(
  content: string,
  whatsappNumber: {
    id: string;
    phoneNumber?: string;
    projectId: string | null;
    project: { name: string; status: string } | null;
  }
) {
  const command = content.toLowerCase().trim();
  const phone = whatsappNumber.phoneNumber || whatsappNumber.id;

  if (command === 'status' || command === 'voortgang') {
    if (whatsappNumber.project && whatsappNumber.projectId) {
      try {
        const phaseStatus = await getPhaseStatus(whatsappNumber.projectId);

        const phaseNames: Record<DetailedPhase, string> = {
          GRONDWERK: 'Grondwerk',
          FUNDERING: 'Fundering',
          RUWBOUW: 'Ruwbouw',
          DAKCONSTRUCTIE: 'Dakconstructie',
          GEVELWERK: 'Gevelwerk',
          INSTALLATIES: 'Installaties',
          AFBOUW: 'Afbouw',
          OPLEVERING: 'Oplevering',
        };

        const lines = [
          `*Helder: Project Status*`,
          ``,
          `Project: ${whatsappNumber.project.name}`,
          `Status: ${whatsappNumber.project.status}`,
          ``,
          `*Huidige fase:* ${phaseNames[phaseStatus.currentPhase]}`,
          `*Voortgang:* ${phaseStatus.phaseProgress}%`,
          ``,
          `*Fase overzicht:*`,
        ];

        for (const phase of phaseStatus.phases) {
          const icon = phase.status === 'completed' ? '✅' : phase.status === 'current' ? '🔨' : '⬜';
          const photos = phase.photoCount > 0 ? ` (${phase.photoCount} foto's)` : '';
          lines.push(`${icon} ${phase.name}${photos}`);
        }

        if (phaseStatus.analysis.readyToAdvance && phaseStatus.analysis.suggestedNextPhase) {
          lines.push('');
          lines.push(`💡 *Let op:* Fase ${phaseNames[phaseStatus.analysis.suggestedNextPhase]} wordt voorgesteld op basis van recente foto's.`);
        }

        await sendWhatsAppMessage(phone, lines.join('\n'));
      } catch (error) {
        console.error('[WhatsApp] Error getting phase status:', error);
        await sendWhatsAppMessage(
          phone,
          `Helder: Project "${whatsappNumber.project.name}" - Status: ${whatsappNumber.project.status}`
        );
      }
    } else {
      await sendWhatsAppMessage(phone, 'Helder: Geen project gekoppeld aan dit nummer.');
    }
  } else if (command === 'fase' || command === 'phase') {
    if (whatsappNumber.projectId) {
      try {
        const phaseStatus = await getPhaseStatus(whatsappNumber.projectId);

        const phaseNames: Record<DetailedPhase, string> = {
          GRONDWERK: 'Grondwerk',
          FUNDERING: 'Fundering',
          RUWBOUW: 'Ruwbouw',
          DAKCONSTRUCTIE: 'Dakconstructie',
          GEVELWERK: 'Gevelwerk',
          INSTALLATIES: 'Installaties',
          AFBOUW: 'Afbouw',
          OPLEVERING: 'Oplevering',
        };

        const lines = [
          `*Helder: Fase Analyse*`,
          ``,
          `Huidige fase: *${phaseNames[phaseStatus.currentPhase]}*`,
          `AI zekerheid: ${Math.round(phaseStatus.analysis.currentPhaseConfidence * 100)}%`,
          ``,
        ];

        if (phaseStatus.analysis.detectedPhases.length > 0) {
          lines.push(`*Gedetecteerd in foto's:*`);
          for (const detected of phaseStatus.analysis.detectedPhases.slice(0, 4)) {
            lines.push(`  • ${phaseNames[detected.phase]}: ${detected.count}x (${Math.round(detected.confidence * 100)}%)`);
          }
          lines.push('');
        }

        if (phaseStatus.analysis.phaseCompletionIndicators.length > 0) {
          lines.push(`*Voltooiingsindicatoren:*`);
          for (const indicator of phaseStatus.analysis.phaseCompletionIndicators.slice(0, 3)) {
            lines.push(`  ✓ ${indicator}`);
          }
          lines.push('');
        }

        if (phaseStatus.analysis.readyToAdvance) {
          lines.push(`💡 *Gereed voor volgende fase:* ${phaseNames[phaseStatus.analysis.suggestedNextPhase!]}`);
          lines.push(`Reden: ${phaseStatus.analysis.advanceReason}`);
        }

        await sendWhatsAppMessage(phone, lines.join('\n'));
      } catch (error) {
        console.error('[WhatsApp] Error getting phase analysis:', error);
        await sendWhatsAppMessage(phone, 'Helder: Kon fase analyse niet ophalen.');
      }
    }
  } else if (command === 'fase terug' || command === 'phase back') {
    // Allow reverting phase if user disagrees with auto-advance
    if (whatsappNumber.projectId) {
      await sendWhatsAppMessage(
        phone,
        'Helder: Om de fase terug te zetten, neem contact op met de projectbeheerder via het dashboard.'
      );
    }
  } else if (command === 'help' || command === 'hulp') {
    await sendWhatsAppMessage(
      phone,
      `*Helder commando's:*\n\n` +
      `• Stuur foto's om ze toe te voegen\n` +
      `• *status* - bekijk project status en fase\n` +
      `• *fase* - bekijk gedetailleerde fase analyse\n` +
      `• *help* - toon deze hulp\n\n` +
      `De fase wordt automatisch bijgewerkt op basis van je foto's.`
    );
  }
}
