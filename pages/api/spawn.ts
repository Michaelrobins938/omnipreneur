import { NextApiRequest, NextApiResponse } from 'next';
import { auth, checkUsageLimit, updateUsage } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(req);
    if (!rateLimitResult.success) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Authentication
    const user = await auth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
      niche, 
      contentType, 
      tone, 
      count = 100,
      keywords = [],
      targetAudience = 'general'
    } = req.body;

    if (!niche || !contentType || !tone) {
      return res.status(400).json({ error: 'Niche, content type, and tone are required' });
    }

    // Check usage limits
    const canGenerate = await checkUsageLimit(user, 'contentPieces');
    if (!canGenerate) {
      return res.status(403).json({ 
        error: 'Usage limit exceeded',
        limit: 'contentPieces',
        current: user.usage.contentPieces
      });
    }

    // Generate content using multiple AI models
    const contentPieces = await generateContentPieces({
      niche,
      contentType,
      tone,
      count: Math.min(count, 500), // Cap at 500 pieces
      keywords,
      targetAudience
    });

    // Save to database
    await saveContentGeneration({
      userId: user.id,
      niche,
      contentType,
      tone,
      count: contentPieces.length,
      keywords,
      targetAudience,
      timestamp: new Date()
    });

    // Update usage
    await updateUsage(user.id, 'contentPieces');

    // Analytics tracking
    await trackEvent({
      userId: user.id,
      event: 'content_generation',
      metadata: {
        niche,
        contentType,
        tone,
        count: contentPieces.length,
        keywords: keywords.length
      }
    });

    return res.status(200).json({
      success: true,
      content: contentPieces,
      metadata: {
        generated: contentPieces.length,
        niche,
        contentType,
        tone,
        targetAudience
      }
    });

  } catch (error) {
    console.error('Content spawn API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process spawn request',
      details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error && 'message' in error ? (error as any).message : undefined
    });
  }
}

interface ContentGenerationParams {
  niche: string;
  contentType: 'social' | 'blog' | 'email' | 'video' | 'mixed';
  tone: 'professional' | 'casual' | 'authoritative' | 'conversational' | 'urgent';
  count: number;
  keywords: string[];
  targetAudience: string;
}

async function generateContentPieces(params: ContentGenerationParams): Promise<string[]> {
  const { niche, contentType, tone, count, keywords, targetAudience } = params;
  
  // Use GPT-4 for initial content generation
  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env['OPENAI_API_KEY']}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      max_tokens: 4000,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `You are a master content creator specializing in ${contentType} content for the ${niche} niche.

TASK: Generate ${count} high-quality ${contentType} pieces that are:
- Engaging and shareable
- Optimized for ${targetAudience} audience
- Written in ${tone} tone
- Include relevant keywords: ${keywords.join(', ')}
- Ready for immediate use

FORMAT REQUIREMENTS:
${getFormatRequirements(contentType)}

OUTPUT: Return exactly ${count} pieces, each separated by "---". Each piece should be complete and ready to use.`
        }
      ]
    })
  });

  if (!gptResponse.ok) {
    throw new Error('GPT-4 API request failed');
  }

  const gptData = await gptResponse.json();
  let contentPieces = gptData.choices[0].message.content.split('---').filter(Boolean);

  // If we need more content, use Claude for additional pieces
  if (contentPieces.length < count) {
    const remainingCount = count - contentPieces.length;
    
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env['CLAUDE_API_KEY']!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content: `You are a creative content specialist for ${niche}.

Generate ${remainingCount} additional ${contentType} pieces that complement the existing content.

Style: ${tone}
Audience: ${targetAudience}
Keywords: ${keywords.join(', ')}

Make each piece unique and valuable.`
          }
        ]
      })
    });

    if (claudeResponse.ok) {
      const claudeData = await claudeResponse.json();
      const additionalPieces = claudeData.content[0].text.split('---').filter(Boolean);
      contentPieces = [...contentPieces, ...additionalPieces];
    }
  }

  // Clean and format content pieces
  return contentPieces
    .slice(0, count)
    .map((piece: any) => piece.content)
    .filter((piece: any) => piece && piece.trim().length > 0);
}

function getFormatRequirements(contentType: string): string {
  const requirements = {
    social: `
- Instagram posts: 220 characters max, include 3-5 hashtags
- Twitter posts: 280 characters max, engaging hook
- LinkedIn posts: Professional tone, 1300 characters max
- Facebook posts: Conversational, 63-80 characters optimal`,
    
    blog: `
- Headlines: 50-60 characters, compelling
- Meta descriptions: 150-160 characters
- Body content: 800-2000 words, well-structured
- Include subheadings and bullet points`,
    
    email: `
- Subject lines: 30-50 characters, curiosity-driven
- Preheaders: 50-100 characters, supporting subject
- Body: 150-300 words, clear CTA
- Personalization placeholders`,
    
    video: `
- Hooks: 3-5 seconds, attention-grabbing
- Scripts: Conversational, 2-10 minutes
- Thumbnails: High-contrast, text overlay
- Descriptions: SEO-optimized, 5000 characters max`,
    
    mixed: `
- Variety of formats and lengths
- Different engagement styles
- Cross-platform optimization
- A/B testing variations`
  };

  return requirements[contentType as keyof typeof requirements] || requirements.mixed;
}

async function saveContentGeneration(data: any) {
  // Database integration - placeholder for now
  // Logging removed for production
}

async function trackEvent(data: any) {
  // Analytics integration - placeholder for now
  // Event tracking removed for production
} 