// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireEntitlement } from '@/lib/auth-middleware';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { chatComplete } from '@/lib/ai/openai';
import { completeClaude } from '@/lib/ai/claude';
import { NovusOptimizer } from '@/lib/ai/novus-optimizer';
import { saveNovusUsage } from '@/lib/db/novus';
import { logAIRequest } from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';

const prisma = new PrismaClient();

// Validation schema
const OptimizePromptSchema = z.object({
  originalPrompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  style: z.enum(['professional', 'creative', 'technical', 'casual']).default('professional'),
  format: z.enum(['instructions', 'conversation', 'roleplay', 'system']).default('instructions'),
  context: z.string().optional(),
  targetAudience: z.enum(['general', 'expert', 'beginner', 'business']).default('general'),
  language: z.string().default('en'),
  creativity: z.number().min(0).max(1).default(0.7)
});

/**
 * POST /api/novus/optimize
 * 
 * Optimize AI prompts using NOVUS Protocol
 * 
 * Authentication: Required
 * Subscription: NOVUS_PROTOCOL, PRO, or ENTERPRISE required
 * 
 * Body:
 * {
 *   originalPrompt: string,
 *   style?: 'professional' | 'creative' | 'technical' | 'casual',
 *   format?: 'instructions' | 'conversation' | 'roleplay' | 'system',
 *   context?: string,
 *   targetAudience?: 'general' | 'expert' | 'beginner' | 'business',
 *   language?: string,
 *   creativity?: number (0-1)
 * }
 */
export const POST = requireEntitlement('novus-protocol')(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();

    // New schema support (as per AI_INSTRUCTIONS/15_NOVUS...)
    const NewSchema = z.object({
      prompt: z.string().min(10),
      strategy: z.enum(['clarity','specificity','context','structure','all']).default('all'),
      outputCount: z.number().min(1).max(5).default(3),
      targetUseCase: z.enum(['general','creative','technical','business']).default('general')
    }).partial({ strategy: true, outputCount: true, targetUseCase: true });

    const isNewShape = typeof body?.prompt === 'string';

    // Check user subscription
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true, usage: true }
    });

    if (!userWithSubscription) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USER_NOT_FOUND', 
            message: 'User not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Check subscription access
    const allowedPlans = ['NOVUS_PROTOCOL', 'PRO', 'ENTERPRISE'];
    const userPlan = userWithSubscription.subscription?.plan || 'FREE';
    
    if (!allowedPlans.includes(userPlan)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'SUBSCRIPTION_REQUIRED', 
            message: 'NOVUS Protocol subscription required',
            upgradeUrl: '/products/novus-protocol'
          } 
        },
        { status: 403 }
      );
    }

    // Optional credits check
    if ((userWithSubscription as any).ai_credits_remaining !== undefined) {
      const credits = (userWithSubscription as any).ai_credits_remaining as number;
      if (credits <= 0) {
        return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_CREDITS', message: 'Insufficient AI credits' } }, { status: 402 });
      }
    }

    // Check usage limits (Free tier gets 0, NOVUS 50, Pro 100, Enterprise unlimited)
    const usageLimits = {
      FREE: 0,
      NOVUS_PROTOCOL: 50,
      PRO: 100,
      ENTERPRISE: -1 // unlimited
    };

    const monthlyLimit = usageLimits[userPlan as keyof typeof usageLimits];
    const currentUsage = userWithSubscription.usage?.rewrites || 0;

    if (monthlyLimit !== -1 && currentUsage >= monthlyLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USAGE_LIMIT_EXCEEDED', 
            message: `Monthly limit of ${monthlyLimit} optimizations exceeded`,
            upgradeUrl: '/products/novus-protocol'
          } 
        },
        { status: 429 }
      );
    }

    // Branch: New schema path
    if (isNewShape) {
      const { prompt, strategy = 'all', outputCount = 3, targetUseCase = 'general' } = NewSchema.parse(body);
      const optimizer = new NovusOptimizer();
      const t0 = Date.now();
      const result = await optimizer.optimizePrompt({
        prompt,
        strategy: strategy as any,
        outputCount,
        targetUseCase: targetUseCase as any,
        userId: user.userId
      });
      const processingTime = Date.now() - t0;

      await saveNovusUsage({
        userId: user.userId,
        inputPrompt: prompt,
        optimizedPrompts: result.optimizedPrompts.map(p => ({ version: p.version, prompt: p.prompt })),
        analysis: result.analysis,
        settings: { strategy, outputCount, targetUseCase },
        creditsUsed: outputCount
      });

      // Log AI request
      try {
        await logAIRequest({
          userId: user.userId,
          productId: 'novus-protocol',
          modelUsed: 'openai:' + (process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini'),
          processingTimeMs: processingTime,
          success: true,
          inputData: { prompt, strategy, outputCount, targetUseCase },
          outputData: result,
          qualityScore: result?.analysis?.originalScore?.overall ?? undefined
        });
      } catch (_) {}

      const response = NextResponse.json({
        success: true,
        data: result,
        usage: {
          creditsUsed: outputCount,
          processingTime: result.processingTime
        }
      });

      // Decrement credits (best-effort, after response is ready)
      try {
        if ((userWithSubscription as any).ai_credits_remaining !== undefined) {
          await prisma.user.update({
            where: { id: user.userId },
            data: { ai_credits_remaining: { decrement: outputCount } }
          });
        }
      } catch (_) {}

      return response;
    }

    // Legacy schema path
    const validatedData = OptimizePromptSchema.parse(body);
    const { originalPrompt, style, format, context, targetAudience, language, creativity } = validatedData;

    // Apply NOVUS Protocol optimization (AI-assisted if available)
    const optimizedPrompt = await optimizePromptWithAI({
      originalPrompt,
      style,
      format,
      context,
      targetAudience,
      language,
      creativity
    });

    // Save the optimization to database
    const rewrite = await prisma.rewrite.create({
      data: {
        userId: user.userId,
        originalPrompt,
        optimizedPrompt: optimizedPrompt.text,
        style,
        format,
        context,
        improvements: optimizedPrompt.improvements
      }
    });

    // Update usage counter
    await prisma.usage.upsert({
      where: { userId: user.userId },
      update: { 
        rewrites: { increment: 1 }
      },
      create: {
        userId: user.userId,
        rewrites: 1,
        contentPieces: 0,
        bundles: 0,
        affiliateLinks: 0
      }
    });

    // Log analytics event
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'prompt_optimized',
        metadata: {
          originalLength: originalPrompt.length,
          optimizedLength: optimizedPrompt.text.length,
          style,
          format,
          targetAudience,
          improvementScore: optimizedPrompt.improvementScore
        }
      }
    });

    // Best-effort AI request log and credits decrement
    try {
      await logAIRequest({
        userId: user.userId,
        productId: 'novus-protocol',
        modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
        success: true,
        inputData: { originalLength: originalPrompt.length, style, format, targetAudience },
        outputData: { optimizedLength: optimizedPrompt.text.length, improvements: optimizedPrompt.improvements },
        qualityScore: optimizedPrompt.improvementScore
      });
      const u = await prisma.user.findUnique({ where: { id: user.userId } });
      if ((u as any)?.ai_credits_remaining !== undefined) {
        await prisma.user.update({ where: { id: user.userId }, data: { ai_credits_remaining: { decrement: 1 } } });
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      data: {
        id: rewrite.id,
        originalPrompt,
        optimizedPrompt: optimizedPrompt.text,
        improvements: optimizedPrompt.improvements,
        metrics: {
          originalLength: originalPrompt.length,
          optimizedLength: optimizedPrompt.text.length,
          improvementScore: optimizedPrompt.improvementScore,
          readabilityScore: optimizedPrompt.readabilityScore,
          clarityScore: optimizedPrompt.clarityScore
        },
        usage: {
          current: currentUsage + 1,
          limit: monthlyLimit,
          remaining: monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - currentUsage - 1)
        }
      }
    });

  } catch (error: any) {
    console.error('NOVUS optimization error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'OPTIMIZATION_ERROR', 
          message: 'Failed to optimize prompt' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 30,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `novus-optimize:${userId}:${ip}`;
  }
})));

/**
 * NOVUS Protocol Optimization Engine
 * 
 * This implements the core NOVUS methodology:
 * - Analyze prompt structure and intent
 * - Apply best practices for AI interaction
 * - Optimize for clarity, specificity, and effectiveness
 * - Generate improvement suggestions
 */
async function optimizePromptWithAI(params: {
  originalPrompt: string;
  style: string;
  format: string;
  context?: string;
  targetAudience: string;
  language: string;
  creativity: number;
}) {
  const { originalPrompt, style, format, context, targetAudience, creativity } = params;

  // NOVUS Analysis Framework
  const analysis = analyzePrompt(originalPrompt);
  
  // Apply optimization rules based on NOVUS Protocol
  let optimizedPrompt = originalPrompt;
  const improvements: string[] = [];

  // 1. Structure Optimization
  if (!analysis.hasRoleDefinition && format === 'roleplay') {
    optimizedPrompt = `You are a ${getDefaultRole(style)}. ${optimizedPrompt}`;
    improvements.push('Added role definition for better context');
  }

  // 2. Clarity Enhancement
  if (analysis.ambiguousWords.length > 0) {
    optimizedPrompt = clarifyAmbiguousTerms(optimizedPrompt, analysis.ambiguousWords);
    improvements.push('Clarified ambiguous terms for better understanding');
  }

  // 3. Specificity Improvement
  if (analysis.specificityScore < 0.6) {
    optimizedPrompt = addSpecificityMarkers(optimizedPrompt, targetAudience);
    improvements.push('Added specific requirements and constraints');
  }

  // 4. Format Optimization
  optimizedPrompt = formatPromptForStyle(optimizedPrompt, style, format);
  if (style !== 'casual') {
    improvements.push(`Formatted for ${style} style communication`);
  }

  // 5. Context Integration
  if (context) {
    optimizedPrompt = `Context: ${context}\n\n${optimizedPrompt}`;
    improvements.push('Integrated provided context for better relevance');
  }

  // 6. Output Specification
  if (!analysis.hasOutputFormat) {
    const outputSpec = getOutputSpecification(format, targetAudience);
    optimizedPrompt = `${optimizedPrompt}\n\n${outputSpec}`;
    improvements.push('Added clear output format specification');
  }

  // 7. Quality Enhancers
  if (analysis.readabilityScore < 0.7) {
    optimizedPrompt = improveReadability(optimizedPrompt);
    improvements.push('Improved readability and flow');
  }

  // Calculate improvement metrics
  const improvementScore = calculateImprovementScore(originalPrompt, optimizedPrompt);
  const readabilityScore = calculateReadabilityScore(optimizedPrompt);
  const clarityScore = calculateClarityScore(optimizedPrompt);

  // Try AI assistance for refinements
  try {
    const system = 'You are a world-class prompt engineer. Improve clarity, specificity, constraints, and output format. Return ONLY the improved prompt text.';
    const aiOptimized = await chatComplete({ system, user: optimizedPrompt, temperature: 0.3, maxTokens: 800 });
    if (aiOptimized && aiOptimized.trim().length > 0) {
      optimizedPrompt = aiOptimized.trim();
    }
  } catch (_) {
    // fallback to local optimizedPrompt
  }

  // Optional Claude pass for variety
  try {
    const claudeVersion = await completeClaude({
      prompt: `Further refine this prompt while preserving intent and constraints. Return ONLY the refined prompt.\n\n${optimizedPrompt}`,
      temperature: 0.2,
      maxTokens: 800
    });
    if (claudeVersion && claudeVersion.trim().length > 0) {
      optimizedPrompt = claudeVersion.trim();
    }
  } catch (_) {}

  return {
    text: optimizedPrompt,
    improvements,
    improvementScore,
    readabilityScore,
    clarityScore
  };
}

/**
 * Analyze prompt structure and characteristics
 */
function analyzePrompt(prompt: string) {
  const words = prompt.toLowerCase().split(/\s+/);
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    hasRoleDefinition: /\b(you are|act as|imagine you|assume the role)\b/i.test(prompt),
    hasOutputFormat: /\b(format|structure|present|organize|list|bullet)\b/i.test(prompt),
    specificityScore: calculateSpecificityScore(prompt),
    readabilityScore: calculateReadabilityScore(prompt),
    ambiguousWords: findAmbiguousWords(words),
    complexity: words.length / sentences.length
  };
}

/**
 * Calculate how specific and detailed the prompt is
 */
function calculateSpecificityScore(prompt: string): number {
  const specificityIndicators = [
    /\b(specific|exactly|precisely|detailed|comprehensive)\b/i,
    /\b(step[- ]by[- ]step|one by one|first.*then|next)\b/i,
    /\b(include|exclude|must|should|avoid)\b/i,
    /\b(example|sample|instance|illustration)\b/i,
    /\b(criteria|requirements|constraints|guidelines)\b/i
  ];

  const matches = specificityIndicators.reduce((count, regex) => {
    return count + (regex.test(prompt) ? 1 : 0);
  }, 0);

  return Math.min(matches / specificityIndicators.length, 1);
}

/**
 * Calculate readability score based on sentence structure and vocabulary
 */
function calculateReadabilityScore(prompt: string): number {
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = prompt.split(/\s+/);
  
  const avgSentenceLength = words.length / sentences.length;
  const complexWords = words.filter(word => word.length > 6).length;
  const complexWordRatio = complexWords / words.length;
  
  // Flesch-like scoring (simplified)
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * complexWordRatio);
  return Math.max(0, Math.min(1, score / 100));
}

/**
 * Calculate clarity score based on structure and language use
 */
function calculateClarityScore(prompt: string): number {
  const clarityFactors = [
    prompt.includes('?') ? 0.1 : 0, // Questions improve clarity
    /\b(clearly|specifically|exactly)\b/i.test(prompt) ? 0.2 : 0,
    prompt.split('\n').length > 1 ? 0.1 : 0, // Structure improves clarity
    calculateSpecificityScore(prompt) * 0.3,
    (1 - findAmbiguousWords(prompt.split(/\s+/)).length / 10) * 0.3
  ];

  return Math.min(1, clarityFactors.reduce((sum, factor) => sum + factor, 0));
}

/**
 * Find potentially ambiguous words that could be clarified
 */
function findAmbiguousWords(words: string[]): string[] {
  const ambiguousTerms = ['thing', 'stuff', 'something', 'anything', 'everything', 'some', 'any', 'all'];
  return words.filter(word => ambiguousTerms.includes(word.toLowerCase()));
}

/**
 * Calculate overall improvement score
 */
function calculateImprovementScore(original: string, optimized: string): number {
  const originalAnalysis = analyzePrompt(original);
  const optimizedAnalysis = analyzePrompt(optimized);
  
  const improvements = [
    optimizedAnalysis.specificityScore - originalAnalysis.specificityScore,
    optimizedAnalysis.readabilityScore - originalAnalysis.readabilityScore,
    (originalAnalysis.ambiguousWords.length - optimizedAnalysis.ambiguousWords.length) / 10
  ];

  return Math.max(0, Math.min(1, improvements.reduce((sum, imp) => sum + imp, 0.5)));
}

/**
 * Get default role based on style
 */
function getDefaultRole(style: string): string {
  const roles = {
    professional: 'professional assistant',
    creative: 'creative writing expert',
    technical: 'technical specialist',
    casual: 'helpful assistant'
  };
  return roles[style as keyof typeof roles] || 'helpful assistant';
}

/**
 * Clarify ambiguous terms in the prompt
 */
function clarifyAmbiguousTerms(prompt: string, ambiguousWords: string[]): string {
  let clarified = prompt;
  
  const replacements = {
    'thing': 'specific item or concept',
    'stuff': 'relevant information or materials',
    'something': 'a specific example or instance',
    'anything': 'any relevant information',
    'everything': 'all relevant details'
  };

  ambiguousWords.forEach(word => {
    const replacement = replacements[word as keyof typeof replacements];
    if (replacement) {
      clarified = clarified.replace(new RegExp(`\\b${word}\\b`, 'gi'), replacement);
    }
  });

  return clarified;
}

/**
 * Add specificity markers based on target audience
 */
function addSpecificityMarkers(prompt: string, targetAudience: string): string {
  const audienceSpecs = {
    beginner: 'Please provide detailed explanations and avoid jargon.',
    expert: 'You may use technical terminology and assume advanced knowledge.',
    business: 'Focus on practical applications and business value.',
    general: 'Use clear language appropriate for a general audience.'
  };

  const spec = audienceSpecs[targetAudience as keyof typeof audienceSpecs];
  return `${prompt}\n\nTarget audience: ${targetAudience}. ${spec}`;
}

/**
 * Format prompt according to specified style and format
 */
function formatPromptForStyle(prompt: string, style: string, format: string): string {
  if (style === 'professional') {
    prompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    if (!prompt.endsWith('.') && !prompt.endsWith('?') && !prompt.endsWith('!')) {
      prompt += '.';
    }
  }

  if (format === 'system') {
    prompt = `System: ${prompt}`;
  }

  return prompt;
}

/**
 * Get output format specification
 */
function getOutputSpecification(format: string, targetAudience: string): string {
  const specs = {
    instructions: 'Please provide your response in a clear, step-by-step format.',
    conversation: 'Respond in a natural, conversational tone.',
    roleplay: 'Stay in character throughout your response.',
    system: 'Provide a structured, systematic response.'
  };

  return specs[format as keyof typeof specs] || specs.instructions;
}

/**
 * Improve readability through sentence structure
 */
function improveReadability(prompt: string): string {
  // Split overly long sentences
  let improved = prompt.replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2');
  
  // Add paragraph breaks for better structure
  if (improved.length > 200 && !improved.includes('\n')) {
    const midPoint = improved.length / 2;
    const breakPoint = improved.indexOf(' ', midPoint);
    if (breakPoint > 0) {
      improved = improved.slice(0, breakPoint) + '\n\n' + improved.slice(breakPoint + 1);
    }
  }

  return improved;
}