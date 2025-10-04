const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { uploadToStorage } = require('../lib/database');

// Initialize OpenAI with API key if available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.log('⚠️ OPENAI_API_KEY not configured - voiceover generation will use mock data');
}

/**
 * Generate voiceover using OpenAI TTS
 */
async function generateVoiceover({ text, voice, provider = 'openai' }) {
  try {
    console.log(`🎤 Generating voiceover with ${provider} (voice: ${voice})`);
    
    // If OpenAI is not configured, return mock voiceover
    if (!openai && provider === 'openai') {
      console.log('📝 Using mock voiceover (OpenAI not configured)');
      return await generateMockVoiceover({ text, voice });
    }
    
    if (provider === 'openai') {
      return await generateOpenAIVoiceover({ text, voice });
    } else if (provider === 'elevenlabs') {
      return await generateElevenLabsVoiceover({ text, voice });
    } else {
      throw new Error(`Unsupported TTS provider: ${provider}`);
    }
  } catch (error) {
    console.error('❌ Error generating voiceover:', error);
    throw new Error(`Voiceover generation failed: ${error.message}`);
  }
}

/**
 * Generate voiceover using OpenAI TTS
 */
async function generateOpenAIVoiceover({ text, voice }) {
  try {
    // Map voice styles to OpenAI voices
    const voiceMap = {
      'narration_female': 'nova',
      'narration_male': 'onyx',
      'upbeat_female': 'shimmer',
      'calm_male': 'echo'
    };

    const openaiVoice = voiceMap[voice] || 'nova';

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: openaiVoice,
      input: text,
      response_format: "mp3"
    });

    // Convert response to buffer
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Generate unique filename
    const filename = `voiceover_${Date.now()}.mp3`;
    const storagePath = `audio/${filename}`;
    
    // Upload to Supabase Storage
    const uploadResult = await uploadToStorage('ai-audio', storagePath, buffer);
    
    // Generate public URL (adjust based on your storage setup)
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/ai-audio/${filename}`;
    
    console.log(`✅ OpenAI voiceover generated: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ OpenAI TTS error:', error);
    throw error;
  }
}

/**
 * Generate voiceover using ElevenLabs (placeholder)
 */
async function generateElevenLabsVoiceover({ text, voice }) {
  try {
    // TODO: Implement ElevenLabs integration
    // For now, fallback to OpenAI
    console.log('⚠️ ElevenLabs not implemented, falling back to OpenAI');
    return await generateOpenAIVoiceover({ text, voice: 'narration_female' });
  } catch (error) {
    console.error('❌ ElevenLabs TTS error:', error);
    throw error;
  }
}

/**
 * Generate mock voiceover for testing
 */
async function generateMockVoiceover({ text, voice }) {
  try {
    console.log('🎭 Creating mock voiceover file...');
    
    // Create a mock audio file (silence)
    const mockAudioBuffer = Buffer.alloc(1000); // 1KB of silence
    
    // Upload to storage
    const fileName = `voiceover_${Date.now()}.mp3`;
    const filePath = `voiceovers/${fileName}`;
    
    const uploadResult = await uploadToStorage('autocut-assets', filePath, mockAudioBuffer);
    
    console.log(`✅ Mock voiceover created: ${uploadResult.path}`);
    
    return {
      url: uploadResult.path,
      duration: Math.ceil(text.split(' ').length / 2.5), // Estimate duration
      provider: 'mock',
      voice,
      metadata: {
        textLength: text.length,
        wordCount: text.split(' ').length,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Mock voiceover error:', error);
    throw error;
  }
}

module.exports = { generateVoiceover };
