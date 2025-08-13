// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { TimeTrackingService, TimeTrackingRequest } from '@/lib/ai/time-tracking-service';
import prisma, { logAIRequest } from '@/lib/db';

// Types for authenticated request
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

// Enhanced time tracking analytics schema
const TimeTrackingAnalyticsSchema = z.object({
  activities: z.array(z.object({
    description: z.string(),
    durationMinutes: z.number().positive(),
    category: z.string().optional(),
    timestamp: z.string().optional(),
    tags: z.array(z.string()).optional()
  })),
  goals: z.array(z.string()).optional(),
  workHours: z.object({
    start: z.string(),
    end: z.string()
  }).optional(),
  timeframe: z.enum(['day', 'week', 'month']).default('week'),
  includeProductivityAnalysis: z.boolean().default(true),
  includeFocusOptimization: z.boolean().default(true)
});

/**
 * POST /api/time-tracking/analytics
 * 
 * AI-powered time tracking analytics with:
 * - Productivity pattern analysis
 * - Time allocation optimization
 * - Distraction identification
 * - Goal progress tracking
 * - Efficiency recommendations
 * 
 * Authentication: Required
 * Subscription: TIME_TRACKING_AI, PRO, or ENTERPRISE
 */
export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        
        // Parse and validate request body
        const body = await request.json();
        const validated = TimeTrackingAnalyticsSchema.parse(body);
        
        // Check subscription eligibility
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['TIME_TRACKING_AI', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Time Tracking AI subscription required for advanced analytics',
              upgradeUrl: '/products/time-tracking-ai'
            }
          }, { status: 403 });
        }

        // Transform data for AI service
        const aiRequest: TimeTrackingRequest = {
          activities: validated.activities.map(activity => ({
            description: activity.description,
            durationMinutes: activity.durationMinutes,
            category: activity.category || 'Uncategorized'
          })),
          goals: validated.goals,
          workHours: validated.workHours
        };

        // Process with AI service
        const t0 = Date.now();
        const aiService = new TimeTrackingService();
        const result = await aiService.process(aiRequest);

        // Log AI request for tracking
        try {
          await logAIRequest({
            userId: user.userId,
            productId: 'time-tracking-ai',
            modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
            processingTimeMs: Date.now() - t0,
            success: true,
            inputData: {
              activityCount: validated.activities.length,
              totalMinutes: validated.activities.reduce((sum, a) => sum + a.durationMinutes, 0),
              timeframe: validated.timeframe,
              categoriesCount: new Set(validated.activities.map(a => a.category || 'Uncategorized')).size
            },
            outputData: {
              totalMinutes: result.totalMinutes,
              categoriesAnalyzed: result.byCategory.length,
              wastedTimeEstimate: result.wastedTimeEstimateMinutes,
              focusWindowsIdentified: result.peakFocusWindows.length,
              recommendationsGenerated: result.recommendations.length
            }
          });
        } catch (logError) {
          console.warn('Failed to log AI request:', logError);
        }

        // Calculate additional insights
        const totalMinutes = validated.activities.reduce((sum, a) => sum + a.durationMinutes, 0);
        const avgEfficiencyScore = result.byCategory.reduce((sum, cat) => sum + cat.efficiencyScore, 0) / result.byCategory.length;
        
        // Add metadata to response
        const responseData = {
          ...result,
          insights: {
            totalActivities: validated.activities.length,
            totalHours: Math.round((totalMinutes / 60) * 10) / 10,
            averageEfficiencyScore: Math.round(avgEfficiencyScore),
            productivityRating: avgEfficiencyScore >= 80 ? 'Excellent' : avgEfficiencyScore >= 65 ? 'Good' : avgEfficiencyScore >= 50 ? 'Average' : 'Needs Improvement',
            timeWastePercentage: Math.round((result.wastedTimeEstimateMinutes / totalMinutes) * 100),
            topCategory: result.byCategory.sort((a, b) => b.totalMinutes - a.totalMinutes)[0]?.category || 'None'
          },
          metadata: {
            processedAt: new Date().toISOString(),
            timeframe: validated.timeframe,
            processingTimeMs: Date.now() - t0,
            aiModel: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview'
          }
        };

        return NextResponse.json({
          success: true,
          data: responseData
        });

      } catch (error) {
        console.error('Time tracking analytics error:', error);
        
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
            code: 'TIME_ANALYTICS_ERROR',
            message: 'Failed to process time tracking analytics'
          }
        }, { status: 500 });
      }
    }, {
      limit: 30, // 30 requests per 10 minutes for AI time analytics
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => {
        const user = (req as any).user?.userId || 'anonymous';
        return `time-analytics-ai:${user}`;
      }
    })
  )
);

/**
 * GET /api/time-tracking/analytics
 * 
 * Get time tracking options and user's current subscription status
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
    const hasAccess = ['TIME_TRACKING_AI', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        features: {
          productivityAnalysis: hasAccess,
          focusOptimization: hasAccess,
          distractionIdentification: hasAccess,
          goalTracking: hasAccess,
          advancedReporting: userPlan === 'ENTERPRISE',
          teamAnalytics: userPlan === 'ENTERPRISE'
        },
        timeframes: ['day', 'week', 'month'],
        categories: [
          'Deep Work', 'Meetings', 'Communication', 'Planning', 
          'Learning', 'Administrative', 'Break', 'Distraction'
        ],
        upgradeUrl: hasAccess ? null : '/products/time-tracking-ai'
      }
    });
    
  } catch (error) {
    console.error('Time tracking info error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INFO_ERROR',
        message: 'Failed to get time tracking information'
      }
    }, { status: 500 });
  }
});

