import OpenAI from 'openai';

// Initialize OpenAI client (Whisper API)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

/**
 * Supported audio MIME types for transcription
 */
export const SUPPORTED_AUDIO_TYPES = [
  'audio/ogg',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/webm',
  'audio/m4a',
  'audio/x-m4a',
];

/**
 * Check if a MIME type is a supported audio format
 */
export function isAudioMessage(mimeType: string | null): boolean {
  if (!mimeType) return false;
  return SUPPORTED_AUDIO_TYPES.some(
    (type) => mimeType.startsWith(type) || mimeType.includes('audio')
  );
}

/**
 * Get file extension for audio MIME type
 */
function getAudioExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'audio/ogg': 'ogg',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'm4a',
    'audio/wav': 'wav',
    'audio/webm': 'webm',
    'audio/m4a': 'm4a',
    'audio/x-m4a': 'm4a',
  };

  for (const [mime, ext] of Object.entries(mimeToExt)) {
    if (mimeType.startsWith(mime)) {
      return ext;
    }
  }

  // Default fallback
  return 'ogg';
}

/**
 * Transcribe audio using OpenAI Whisper API
 *
 * @param audioBuffer - The audio file as a Buffer
 * @param mimeType - The MIME type of the audio file
 * @returns Transcribed text and metadata
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<TranscriptionResult> {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in environment.');
  }

  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('Empty audio buffer provided');
  }

  try {
    // Get the appropriate file extension
    const extension = getAudioExtension(mimeType);

    // Create a File object from the buffer (required by OpenAI SDK)
    const uint8Array = new Uint8Array(audioBuffer);
    const file = new File([uint8Array], `audio.${extension}`, { type: mimeType });

    console.log(
      `[Transcribe] Processing audio: ${(audioBuffer.length / 1024).toFixed(1)}KB, type: ${mimeType}`
    );

    // Call OpenAI Whisper API
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'nl', // Dutch language for construction context
      response_format: 'verbose_json',
    });

    console.log(`[Transcribe] Success: "${response.text.substring(0, 100)}..."`);

    return {
      text: response.text,
      duration: response.duration,
      language: response.language,
    };
  } catch (error) {
    console.error('[Transcribe] OpenAI Whisper error:', error);

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
    throw new Error('Transcription failed: Unknown error');
  }
}

/**
 * Estimate audio duration from buffer size (rough approximation)
 * Used as fallback when actual duration is not available
 *
 * @param bufferSize - Size of the audio buffer in bytes
 * @param mimeType - The MIME type of the audio
 * @returns Estimated duration in seconds
 */
export function estimateAudioDuration(bufferSize: number, mimeType: string): number {
  // Approximate bitrates for different formats (in bytes per second)
  const bitrateEstimates: Record<string, number> = {
    'audio/ogg': 4000, // ~32kbps
    'audio/mpeg': 16000, // ~128kbps
    'audio/mp4': 8000, // ~64kbps
    'audio/wav': 88200, // ~44.1kHz stereo 16bit
    'audio/webm': 6000, // ~48kbps
  };

  let bytesPerSecond = 8000; // Default estimate

  for (const [mime, bps] of Object.entries(bitrateEstimates)) {
    if (mimeType.startsWith(mime)) {
      bytesPerSecond = bps;
      break;
    }
  }

  return Math.round(bufferSize / bytesPerSecond);
}
