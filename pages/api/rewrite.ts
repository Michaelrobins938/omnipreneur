import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
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

    const { prompt, style, format, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Claude API integration
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content: `You are a precision prompt engineer specializing in Claude optimization.

Your task is to restructure user prompts for maximum clarity, specificity, and performance.

REQUIREMENTS:
- Maintain original intent and meaning
- Enhance structure and logical flow
- Add missing context and constraints
- Optimize for Claude's reasoning capabilities
- Include specific output formatting instructions
- Add relevant examples where helpful
- Ensure professional, authoritative tone

OUTPUT FORMAT:
- Clean, structured prompt ready for immediate use
- Include role definition, context, requirements, and constraints
- Add specific formatting instructions
- Include example outputs if relevant

STYLE: ${style || 'professional'}
FORMAT: ${format || 'structured'}
CONTEXT: ${context || 'general'}

Transform the user's prompt into a high-performance Claude prompt.`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!claudeResponse.ok) {
      throw new Error('Claude API request failed');
    }

    const claudeData = await claudeResponse.json();
    const optimizedPrompt = claudeData.content[0].text;

    // Save to database
    await saveRewriteHistory({
      userId: user.id,
      originalPrompt: prompt,
      optimizedPrompt,
      style,
      format,
      context,
      timestamp: new Date()
    });

    // Analytics tracking
    await trackEvent({
      userId: user.id,
      event: 'prompt_rewrite',
      metadata: {
        style,
        format,
        context,
        promptLength: prompt.length,
        optimizedLength: optimizedPrompt.length
      }
    });

    return res.status(200).json({
      success: true,
      originalPrompt: prompt,
      optimizedPrompt,
      improvements: {
        clarity: calculateClarityImprovement(prompt, optimizedPrompt),
        structure: calculateStructureImprovement(prompt, optimizedPrompt),
        specificity: calculateSpecificityImprovement(prompt, optimizedPrompt)
      }
    });

  } catch (error) {
    console.error('Rewrite API error:', error);
    return res.status(500).json({ 
      error: 'Failed to optimize prompt',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Helper functions
function calculateClarityImprovement(original: string, optimized: string): number {
  // Simple heuristic - can be enhanced with NLP
  const originalWords = original.split(' ').length;
  const optimizedWords = optimized.split(' ').length;
  const clarityScore = Math.min(100, Math.max(0, (optimizedWords / originalWords) * 50 + 50));
  return Math.round(clarityScore);
}

function calculateStructureImprovement(original: string, optimized: string): number {
  // Check for structured elements like bullet points, numbered lists, sections
  const originalStructure = (original.match(/[•\-\*]|\d+\.|^[A-Z][^:]*:/gm) || []).length;
  const optimizedStructure = (optimized.match(/[•\-\*]|\d+\.|^[A-Z][^:]*:/gm) || []).length;
  const structureScore = Math.min(100, Math.max(0, (optimizedStructure / Math.max(originalStructure, 1)) * 100));
  return Math.round(structureScore);
}

function calculateSpecificityImprovement(original: string, optimized: string): number {
  // Check for specific terms, numbers, constraints
  const originalSpecific = (original.match(/\d+|[A-Z]{2,}|specific|exactly|precisely|must|should/g) || []).length;
  const optimizedSpecific = (optimized.match(/\d+|[A-Z]{2,}|specific|exactly|precisely|must|should/g) || []).length;
  const specificityScore = Math.min(100, Math.max(0, (optimizedSpecific / Math.max(originalSpecific, 1)) * 100));
  return Math.round(specificityScore);
}

async function saveRewriteHistory(data: any) {
  // Database integration - placeholder for now
  console.log('Saving rewrite history:', data);
}

async function trackEvent(data: any) {
  // Analytics integration - placeholder for now
  console.log('Tracking event:', data);
} 