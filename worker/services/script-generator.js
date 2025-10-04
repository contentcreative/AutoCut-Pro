const OpenAI = require('openai');

// Initialize OpenAI with API key if available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.log('⚠️ OPENAI_API_KEY not configured - script generation will use mock data');
}

/**
 * Generate AI script for video content
 */
async function generateScript({ topic, targetDuration, style, language = 'en' }) {
  console.log(`🤖 Generating script for topic: "${topic}"`);
  
  // If OpenAI is not configured, return mock script
  if (!openai) {
    console.log('📝 Using mock script (OpenAI not configured)');
    const mockScript = `Welcome to our video about ${topic}! 

In this ${targetDuration}-second video, we'll explore the key insights and practical tips you need to know.

Here are the main points we'll cover:
• First important aspect
• Second key element  
• Third crucial factor

This is essential knowledge for anyone interested in ${topic}. The strategies we're sharing today have been proven to work effectively.

To summarize, ${topic} offers incredible opportunities when approached correctly. 

If you found this helpful, make sure to like and subscribe for more content like this. Thanks for watching!`;

    console.log(`✅ Mock script generated: ${mockScript.length} characters, ~${mockScript.split(' ').length} words`);
    return mockScript;
  }
  
  try {
    const durationInMinutes = Math.ceil(targetDuration / 60);
    
    const systemPrompt = `You are a professional video script writer specializing in engaging short-form content. 
    Create compelling, educational, and entertaining scripts that are optimized for social media platforms.
    
    Requirements:
    - Target duration: ${targetDuration} seconds (approximately ${durationInMinutes} minute${durationInMinutes > 1 ? 's' : ''})
    - Style: ${style}
    - Language: ${language}
    - Format: Engaging, conversational tone
    - Structure: Hook, main content, call-to-action
    - Word count: Aim for ${Math.floor(targetDuration * 2.5)} words (2.5 words per second average)
    
    Guidelines:
    - Start with a strong hook (first 3 seconds)
    - Use simple, clear language
    - Include specific, actionable tips
    - End with a clear call-to-action
    - Make it shareable and engaging
    - Avoid jargon unless necessary`;

    const userPrompt = `Write a video script about: ${topic}

    Make it engaging, informative, and optimized for short-form video content. 
    Include a strong opening hook and clear structure.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const script = response.choices[0].message.content;
    
    console.log(`✅ Script generated: ${script.length} characters, ~${script.split(' ').length} words`);
    
    return script;
  } catch (error) {
    console.error('❌ Error generating script:', error);
    throw new Error(`Script generation failed: ${error.message}`);
  }
}

module.exports = { generateScript };
