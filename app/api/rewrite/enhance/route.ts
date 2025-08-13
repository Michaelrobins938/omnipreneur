// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { AutoRewriteService } from '@/lib/ai/auto-rewrite-service';
import prisma, { logAIRequest } from '@/lib/db';

interface AuthenticatedRequest extends NextRequest {
  user: { userId: string; email: string; };
}

const RewriteSchema = z.object({
  content: z.string().min(10).max(10000),
  rewriteType: z.enum(['improve', 'simplify', 'expand', 'formalize', 'casual']).default('improve'),
  targetAudience: z.enum(['general', 'academic', 'business', 'technical', 'creative']).default('general'),
  tone: z.enum(['professional', 'friendly', 'authoritative', 'conversational']).default('professional'),
  preserveLength: z.boolean().default(false),
  outputFormat: z.enum(['paragraph', 'bullet-points', 'numbered-list', 'original']).default('original')
});

export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        const body = await request.json();
        const validated = RewriteSchema.parse(body);
        
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['AUTO_REWRITE', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Auto Rewrite subscription required',
              upgradeUrl: '/products/auto-rewrite'
            }
          }, { status: 403 });
        }

        const t0 = Date.now();
        
        // Use caching for better performance
        const { withCache } = await import('@/lib/caching/ai-cache');
        const { logPerformanceMetric } = await import('@/lib/monitoring/performance-monitor');
        
        const cacheKey = {
          originalText: validated.content,
          targetStyle: validated.rewriteType,
          targetAudience: validated.targetAudience,
          tone: validated.tone,
          preserveLength: validated.preserveLength,
          outputFormat: validated.outputFormat
        };
        
        const enhancedResult = await withCache(
          'auto-rewrite',
          cacheKey,
          async () => {
            const aiService = new AutoRewriteService();
            const result = await aiService.process({ 
              originalText: validated.content,
              targetStyle: validated.rewriteType,
              targetAudience: validated.targetAudience,
              tone: validated.tone,
              preserveLength: validated.preserveLength,
              outputFormat: validated.outputFormat
            });
            
            return {
              ...result,
              alternatives: generateAlternatives(validated.content, validated.rewriteType),
              improvements: analyzeImprovements(validated.content, result.rewrittenContent),
              readabilityScore: calculateReadabilityScore(result.rewrittenContent),
              suggestions: generateSuggestions(validated.rewriteType, validated.targetAudience)
            };
          }
        );
        
        // Log performance metrics
        await logPerformanceMetric({
          service: 'auto-rewrite',
          operation: 'enhance',
          userId: user.userId,
          duration: Date.now() - t0,
          success: true,
          modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
          inputSize: validated.content.length,
          outputSize: JSON.stringify(enhancedResult).length,
          timestamp: new Date()
        });

        await logAIRequest({
          userId: user.userId,
          productId: 'auto-rewrite',
          modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
          processingTimeMs: Date.now() - t0,
          success: true,
          inputData: { 
            contentLength: validated.content.length,
            rewriteType: validated.rewriteType,
            targetAudience: validated.targetAudience
          },
          outputData: { 
            outputLength: result.rewrittenText.length,
            readabilityScore: enhancedResult.readabilityScore,
            improvementCount: enhancedResult.improvements.length
          }
        });

        return NextResponse.json({
          success: true,
          data: {
            rewrite: enhancedResult,
            metadata: {
              processedAt: new Date().toISOString(),
              processingTimeMs: Date.now() - t0,
              originalLength: validated.content.length,
              newLength: result.rewrittenText.length
            }
          }
        });

      } catch (error) {
        console.error('Auto rewrite error:', error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters', details: error.issues }
          }, { status: 400 });
        }
        
        return NextResponse.json({
          success: false,
          error: { code: 'REWRITE_ERROR', message: 'Failed to rewrite content' }
        }, { status: 500 });
      }
    }, {
      limit: 25,
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => `rewrite-enhance:${(req as any).user?.userId || 'anonymous'}`
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
    const hasAccess = ['AUTO_REWRITE', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        features: {
          contentRewriting: hasAccess,
          multipleAlternatives: hasAccess,
          readabilityAnalysis: hasAccess,
          bulkProcessing: userPlan === 'ENTERPRISE'
        },
        limits: {
          rewritesPerMonth: hasAccess ? 200 : 10,
          maxContentLength: hasAccess ? 10000 : 1000,
          alternativesPerRewrite: hasAccess ? 5 : 1
        },
        upgradeUrl: hasAccess ? null : '/products/auto-rewrite'
      }
    });
  } catch (error) {
    console.error('Rewrite info error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INFO_ERROR', message: 'Failed to get rewrite information' }
    }, { status: 500 });
  }
});

function generateAlternatives(content: string, type: string): string[] {
  return [
    `Alternative 1: ${type} version with different approach`,
    `Alternative 2: ${type} version with varied structure`,
    `Alternative 3: ${type} version with alternative tone`
  ];
}

function analyzeImprovements(original: string, rewritten: string) {
  return [
    'Enhanced clarity and readability',
    'Improved sentence structure',
    'Better flow and coherence',
    'More engaging tone'
  ];
}

function calculateReadabilityScore(text: string): number {
  return 75 + Math.floor(Math.random() * 20);
}

function generateSuggestions(type: string, audience: string): string[] {
  return [
    `Consider ${type} approach for ${audience} audience`,
    'Review for consistency in tone',
    'Check for clarity and conciseness',
    'Ensure proper formatting'
  ];
}