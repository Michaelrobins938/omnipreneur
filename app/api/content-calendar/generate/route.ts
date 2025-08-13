// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { ContentCalendarService } from '@/lib/ai/content-calendar-service';
import prisma, { logAIRequest } from '@/lib/db';

// Types for authenticated request
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

// Content calendar generation schema
const ContentCalendarSchema = z.object({
  topicPillars: z.array(z.string()).min(1).max(8),
  cadencePerWeek: z.number().min(1).max(20),
  platforms: z.array(z.string()).min(1),
  targetAudience: z.string().optional(),
  contentGoals: z.array(z.string()).optional(),
  brandTone: z.enum(['professional', 'casual', 'playful', 'authoritative', 'friendly']).default('professional'),
  calendarDuration: z.number().min(1).max(12).default(4) // weeks
});

/**
 * POST /api/content-calendar/generate
 * 
 * AI-powered content calendar generation with:
 * - Strategic content planning across multiple platforms
 * - Optimal posting time recommendations
 * - Content pillar balance and coverage analysis
 * - Engagement prediction and optimization
 * - Weekly breakdown and performance insights
 * 
 * Authentication: Required
 * Subscription: CONTENT_CALENDAR_PRO, PRO, or ENTERPRISE
 */
export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        
        // Parse and validate request body
        const body = await request.json();
        const validated = ContentCalendarSchema.parse(body);
        
        // Check subscription eligibility
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['CONTENT_CALENDAR_PRO', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Content Calendar Pro subscription required for AI calendar generation',
              upgradeUrl: '/products/content-calendar-pro'
            }
          }, { status: 403 });
        }

        // Process with AI service
        const t0 = Date.now();
        const aiService = new ContentCalendarService();
        const result = await aiService.process(validated);

        // Log AI request for tracking
        try {
          await logAIRequest({
            userId: user.userId,
            productId: 'content-calendar-pro',
            modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
            processingTimeMs: Date.now() - t0,
            success: true,
            inputData: {
              pillarsCount: validated.topicPillars.length,
              platformsCount: validated.platforms.length,
              weeksPlanned: validated.calendarDuration,
              postsPerWeek: validated.cadencePerWeek,
              brandTone: validated.brandTone
            },
            outputData: {
              postsGenerated: result.schedule.length,
              platformDistribution: Object.keys(result.platformDistribution || {}).length,
              pillarsCovered: Object.keys(result.pillarCoverage || {}).length,
              avgEngagementPrediction: result.optimization?.engagementForecast || 75,
              recommendationsCount: result.optimization?.recommendations?.length || 0
            }
          });
        } catch (logError) {
          console.warn('Failed to log AI request:', logError);
        }

        // Calculate additional insights
        const totalPosts = result.schedule.length;
        const avgEngagement = result.optimization?.engagementForecast || 75;
        const platformCount = Object.keys(result.platformDistribution || {}).length;
        
        // Add metadata to response
        const responseData = {
          ...result,
          insights: {
            totalPostsGenerated: totalPosts,
            averageEngagementPrediction: avgEngagement,
            platformsCovered: platformCount,
            contentEfficiencyScore: Math.min(100, Math.round((avgEngagement + (totalPosts / validated.calendarDuration) * 2))),
            planningTimeframe: `${validated.calendarDuration} weeks`,
            contentDensity: Math.round((totalPosts / validated.calendarDuration) * 10) / 10
          },
          metadata: {
            processedAt: new Date().toISOString(),
            userId: user.userId,
            processingTimeMs: Date.now() - t0,
            aiModel: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
            planDuration: validated.calendarDuration,
            generatedFor: validated.platforms.join(', ')
          }
        };

        return NextResponse.json({
          success: true,
          data: responseData
        });

      } catch (error) {
        console.error('Content calendar generation error:', error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request parameters',
              details: error.issues
            }
          }, { status: 400 });
        }
        
        return NextResponse.json({
          success: false,
          error: {
            code: 'CALENDAR_GENERATION_ERROR',
            message: 'Failed to generate content calendar'
          }
        }, { status: 500 });
      }
    }, {
      limit: 20, // 20 requests per 10 minutes for AI calendar generation
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => {
        const user = (req as any).user?.userId || 'anonymous';
        return `content-calendar-generate:${user}`;
      }
    })
  )
);

/**
 * GET /api/content-calendar/generate
 * 
 * Get content calendar options and user's current subscription status
 */
export const GET = requireAuth(async function GET(request: NextRequest) {
  try {
    const user = (request as AuthenticatedRequest).user;
    
    // Check subscription status
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true }
    });
    
    const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
    const hasAccess = ['CONTENT_CALENDAR_PRO', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        features: {
          aiCalendarGeneration: hasAccess,
          multiPlatformPlanning: hasAccess,
          engagementOptimization: hasAccess,
          contentPillarAnalysis: hasAccess,
          advancedAnalytics: userPlan === 'ENTERPRISE',
          teamCollaboration: userPlan === 'ENTERPRISE'
        },
        supportedPlatforms: [
          'twitter', 'linkedin', 'instagram', 'facebook', 
          'tiktok', 'youtube', 'pinterest', 'reddit'
        ],
        brandTones: ['professional', 'casual', 'playful', 'authoritative', 'friendly'],
        maxPillars: hasAccess ? 8 : 3,
        maxWeeks: hasAccess ? 12 : 4,
        maxPostsPerWeek: hasAccess ? 20 : 5,
        upgradeUrl: hasAccess ? null : '/products/content-calendar-pro'
      }
    });
    
  } catch (error) {
    console.error('Content calendar info error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INFO_ERROR',
        message: 'Failed to get content calendar information'
      }
    }, { status: 500 });
  }
});