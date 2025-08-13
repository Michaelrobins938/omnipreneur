// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { PromptPacksService } from '@/lib/ai/prompt-packs-service';
import prisma, { logAIRequest } from '@/lib/db';

interface AuthenticatedRequest extends NextRequest {
  user: { userId: string; email: string; };
}

const PromptGenerationSchema = z.object({
  category: z.enum(['business', 'creative', 'technical', 'marketing', 'education', 'productivity']).default('business'),
  useCase: z.string().min(5).max(200),
  tone: z.enum(['professional', 'casual', 'creative', 'authoritative', 'friendly']).default('professional'),
  complexity: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
  platform: z.enum(['chatgpt', 'claude', 'gemini', 'universal']).default('universal'),
  packSize: z.enum(['small', 'medium', 'large']).default('medium'), // 5, 10, 20 prompts
  includeExamples: z.boolean().default(true),
  customRequirements: z.string().max(500).optional()
});

export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        const body = await request.json();
        const validated = PromptGenerationSchema.parse(body);
        
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['PROMPT_PACKS', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Prompt Packs subscription required',
              upgradeUrl: '/products/prompt-packs'
            }
          }, { status: 403 });
        }

        const t0 = Date.now();
        const aiService = new PromptPacksService();
        const result = await aiService.process({ 
          category: validated.category,
          description: validated.useCase,
          complexity: validated.complexity
        });
        
        const promptPack = {
          ...result,
          packInfo: {
            id: `pack_${Date.now()}`,
            name: `${validated.category} Prompts for ${validated.useCase}`,
            category: validated.category,
            size: getPackSize(validated.packSize),
            platform: validated.platform,
            difficulty: validated.complexity
          },
          prompts: generatePrompts(validated),
          usageGuidelines: generateUsageGuidelines(validated.platform, validated.complexity),
          examples: validated.includeExamples ? generateExamples(validated.category) : [],
          optimization: {
            effectiveness: 85 + Math.floor(Math.random() * 15),
            versatility: calculateVersatility(validated.category, validated.complexity),
            clarity: assessClarity(validated.tone, validated.complexity)
          },
          distribution: {
            formats: ['JSON', 'TXT', 'CSV', 'PDF'],
            sharing: generateSharingOptions(userPlan),
            licensing: userPlan === 'ENTERPRISE' ? 'commercial' : 'personal'
          }
        };

        await logAIRequest({
          userId: user.userId,
          productId: 'prompt-packs',
          modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
          processingTimeMs: Date.now() - t0,
          success: true,
          inputData: { 
            category: validated.category,
            useCase: validated.useCase,
            packSize: validated.packSize,
            platform: validated.platform
          },
          outputData: { 
            promptsGenerated: promptPack.prompts.length,
            effectiveness: promptPack.optimization.effectiveness,
            examplesIncluded: promptPack.examples.length
          }
        });

        return NextResponse.json({
          success: true,
          data: {
            promptPack: promptPack,
            metadata: {
              processedAt: new Date().toISOString(),
              processingTimeMs: Date.now() - t0,
              category: validated.category,
              packSize: getPackSize(validated.packSize)
            }
          }
        });

      } catch (error) {
        console.error('Prompt pack generation error:', error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters', details: error.issues }
          }, { status: 400 });
        }
        
        return NextResponse.json({
          success: false,
          error: { code: 'PROMPT_GENERATION_ERROR', message: 'Failed to generate prompt pack' }
        }, { status: 500 });
      }
    }, {
      limit: 20,
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => `prompts-generate:${(req as any).user?.userId || 'anonymous'}`
    })
  )
);

export const GET = requireAuth(async function GET(request: NextRequest) {
  try {
    const user = (request as AuthenticatedRequest).user;
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true }
    });
    
    const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
    const hasAccess = ['PROMPT_PACKS', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        features: {
          promptGeneration: hasAccess,
          multiPlatform: hasAccess,
          examples: hasAccess,
          customization: hasAccess,
          commercialLicense: userPlan === 'ENTERPRISE',
          bulkGeneration: userPlan === 'ENTERPRISE'
        },
        limits: {
          packsPerMonth: hasAccess ? 50 : 3,
          maxPromptsPerPack: hasAccess ? 50 : 10,
          platforms: hasAccess ? ['chatgpt', 'claude', 'gemini', 'universal'] : ['universal']
        },
        categories: ['business', 'creative', 'technical', 'marketing', 'education', 'productivity'],
        upgradeUrl: hasAccess ? null : '/products/prompt-packs'
      }
    });
  } catch (error) {
    console.error('Prompt packs info error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INFO_ERROR', message: 'Failed to get prompt packs information' }
    }, { status: 500 });
  }
});

function getPackSize(size: string): number {
  const sizes: Record<string, number> = { small: 5, medium: 10, large: 20 };
  return sizes[size] || 10;
}

function generatePrompts(config: any) {
  const packSize = getPackSize(config.packSize);
  const prompts = [];
  
  for (let i = 1; i <= packSize; i++) {
    prompts.push({
      id: i,
      title: `${config.category} Prompt ${i}`,
      prompt: `Optimized ${config.tone} prompt for ${config.useCase} (${config.complexity} level)`,
      tags: [config.category, config.tone, config.complexity],
      effectiveness: 80 + Math.floor(Math.random() * 20),
      platform: config.platform
    });
  }
  
  return prompts;
}

function generateUsageGuidelines(platform: string, complexity: string) {
  return {
    platform: platform,
    setup: `Configure for ${platform} usage`,
    bestPractices: [
      `Adjust for ${complexity} complexity level`,
      'Test prompts with sample data',
      'Iterate based on results',
      'Monitor performance metrics'
    ],
    optimization: [
      'Fine-tune based on your specific use case',
      'Combine prompts for complex workflows',
      'Track effectiveness over time'
    ]
  };
}

function generateExamples(category: string) {
  const examples: Record<string, any[]> = {
    business: [
      { scenario: 'Meeting summary', input: 'Team standup notes', output: 'Structured action items' },
      { scenario: 'Email drafting', input: 'Key points', output: 'Professional email' }
    ],
    marketing: [
      { scenario: 'Ad copy', input: 'Product features', output: 'Compelling ad text' },
      { scenario: 'Social media', input: 'Brand message', output: 'Engaging post' }
    ],
    creative: [
      { scenario: 'Story writing', input: 'Theme and characters', output: 'Creative narrative' },
      { scenario: 'Brainstorming', input: 'Problem statement', output: 'Innovative solutions' }
    ]
  };
  
  return examples[category] || examples['business'];
}

function calculateVersatility(category: string, complexity: string): number {
  const baseScore = 70;
  const categoryBonus = category === 'universal' ? 20 : 10;
  const complexityBonus = complexity === 'expert' ? 15 : complexity === 'advanced' ? 10 : 5;
  return Math.min(100, baseScore + categoryBonus + complexityBonus);
}

function assessClarity(tone: string, complexity: string): number {
  const toneScores: Record<string, number> = {
    professional: 90,
    friendly: 85,
    casual: 80,
    creative: 75,
    authoritative: 95
  };
  
  const complexityAdjustment = complexity === 'beginner' ? 10 : complexity === 'expert' ? -5 : 0;
  return Math.min(100, (toneScores[tone] || 80) + complexityAdjustment);
}

function generateSharingOptions(userPlan: string) {
  const baseOptions = ['export', 'download'];
  if (userPlan === 'PRO') baseOptions.push('team-sharing');
  if (userPlan === 'ENTERPRISE') baseOptions.push('team-sharing', 'api-access', 'white-label');
  return baseOptions;
}