// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma, { logAIRequest } from '@/lib/db';
import { AffiliatePortalService, AffiliateAnalysisRequest, AffiliateAnalysisResult } from '@/lib/ai/affiliate-portal-service';
import { requireAuth } from '@/lib/auth';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

// Types for authenticated request
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

// Advanced affiliate analysis request schema
const AdvancedAnalyticsSchema = z.object({
  timeRange: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
  goals: z.object({
    targetRevenue: z.number().optional(),
    targetConversions: z.number().optional(),
    maxCommissionRate: z.number().min(0).max(100).optional()
  }).optional(),
  industry: z.string().optional(),
  includeOptimization: z.boolean().default(true),
  includeFraudDetection: z.boolean().default(true),
  includePredictions: z.boolean().default(true)
});

/**
 * POST /api/affiliate/advanced-analytics
 * 
 * Advanced AI-powered affiliate analytics with:
 * - Commission optimization recommendations
 * - Performance predictions
 * - Fraud detection analysis
 * - Top performer identification
 * - Strategic recommendations
 * 
 * Authentication: Required
 * Subscription: AFFILIATE_PORTAL, PRO, or ENTERPRISE
 */
export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async function POST(request: NextRequest) {
      try {
        const user = (request as AuthenticatedRequest).user;
        
        // Parse and validate request body
        const body = await request.json();
        const validated = AdvancedAnalyticsSchema.parse(body);
        
        // Check subscription eligibility
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['AFFILIATE_PORTAL', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Affiliate Portal subscription required for advanced analytics',
              upgradeUrl: '/products/affiliate-portal'
            }
          }, { status: 403 });
        }

        // Fetch user's affiliate data
        const affiliateLinks = await prisma.affiliateLink.findMany({
          where: { userId: user.userId },
          select: {
            id: true,
            linkId: true,
            originalUrl: true,
            affiliateUrl: true,
            campaignName: true,
            commissionRate: true,
            clicks: true,
            conversions: true,
            revenue: true,
            createdAt: true
          }
        });

        if (affiliateLinks.length === 0) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'NO_DATA',
              message: 'No affiliate links found. Create some affiliate links to get analytics.'
            }
          }, { status: 404 });
        }

        // Calculate date ranges for activity analysis
        const now = new Date();
        const timeRangeMap = {
          week: 7,
          month: 30,
          quarter: 90,
          year: 365
        };
        const daysBack = timeRangeMap[validated.timeRange];
        const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

        // Get recent click activity for performance analysis
        const recentActivity = await prisma.clickTracking.findMany({
          where: {
            linkId: { in: affiliateLinks.map(link => link.linkId) },
            timestamp: { gte: startDate }
          },
          orderBy: { timestamp: 'desc' },
          take: 1000 // Limit for performance
        });

        // Transform data for AI analysis
        const affiliatesForAnalysis = affiliateLinks.map(link => ({
          id: link.linkId,
          name: link.campaignName || `Campaign ${link.linkId.slice(-6)}`,
          commissions: link.revenue * (link.commissionRate / 100),
          conversions: link.conversions,
          clicks: link.clicks,
          revenue: link.revenue,
          joinDate: link.createdAt.toISOString(),
          lastActivity: link.createdAt.toISOString()
        }));

        // Build request for AI service
        const aiRequest: AffiliateAnalysisRequest = {
          affiliates: affiliatesForAnalysis,
          timeRange: validated.timeRange,
          goals: {
            targetRevenue: validated.goals?.targetRevenue ?? affiliatesForAnalysis.reduce((sum, a) => sum + a.revenue, 0) * 1.2,
            targetConversions: validated.goals?.targetConversions ?? affiliatesForAnalysis.reduce((sum, a) => sum + a.conversions, 0) * 1.15,
            maxCommissionRate: validated.goals?.maxCommissionRate ?? 15
          },
          industry: validated.industry || 'General E-commerce'
        };

        // Process with AI service
        const t0 = Date.now();
        const aiService = new AffiliatePortalService();
        const result = await aiService.processAdvancedAnalytics(aiRequest);

        // Log AI request for tracking
        try {
          await logAIRequest({
            userId: user.userId,
            productId: 'affiliate-portal-advanced',
            modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
            processingTimeMs: Date.now() - t0,
            success: true,
            inputData: {
              timeRange: validated.timeRange,
              affiliateCount: affiliatesForAnalysis.length,
              totalRevenue: affiliatesForAnalysis.reduce((sum, a) => sum + a.revenue, 0),
              goals: aiRequest.goals
            },
            outputData: {
              insightsCount: result.insights.length,
              recommendationsCount: result.recommendations.length,
              fraudAlertsCount: result.fraudDetection.length,
              optimizationSuggestions: Object.keys(result.commissionOptimization).length
            }
          });
        } catch (logError) {
          console.warn('Failed to log AI request:', logError);
        }

        // Add metadata to response
        const responseData = {
          ...result,
          metadata: {
            processedAt: new Date().toISOString(),
            timeRange: validated.timeRange,
            affiliateCount: affiliatesForAnalysis.length,
            totalRevenue: affiliatesForAnalysis.reduce((sum, a) => sum + a.revenue, 0),
            totalClicks: affiliatesForAnalysis.reduce((sum, a) => sum + a.clicks, 0),
            totalConversions: affiliatesForAnalysis.reduce((sum, a) => sum + a.conversions, 0),
            averageConversionRate: affiliatesForAnalysis.reduce((sum, a) => {
              return sum + (a.clicks > 0 ? (a.conversions / a.clicks) * 100 : 0);
            }, 0) / affiliatesForAnalysis.length,
            processingTimeMs: Date.now() - t0
          }
        };

        return NextResponse.json({
          success: true,
          data: responseData
        });

      } catch (error) {
        console.error('Advanced affiliate analytics error:', error);
        
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
            code: 'ANALYTICS_ERROR',
            message: 'Failed to process advanced analytics'
          }
        }, { status: 500 });
      }
    }, {
      limit: 20, // 20 requests per 10 minutes for advanced analytics
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => {
        const user = (req as any).user?.userId || 'anonymous';
        return `affiliate-advanced-analytics:${user}`;
      }
    })
  )
);

/**
 * GET /api/affiliate/advanced-analytics
 * 
 * Get available analysis options and user's current subscription status
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
    const hasAccess = ['AFFILIATE_PORTAL', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    // Get affiliate links count
    const affiliateCount = await prisma.affiliateLink.count({
      where: { userId: user.userId }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        affiliateCount,
        features: {
          commissionOptimization: hasAccess,
          fraudDetection: hasAccess,
          performancePredictions: hasAccess,
          strategicRecommendations: hasAccess,
          competitorAnalysis: userPlan === 'ENTERPRISE',
          customReporting: userPlan === 'ENTERPRISE' || userPlan === 'PRO'
        },
        timeRanges: ['week', 'month', 'quarter', 'year'],
        upgradeUrl: hasAccess ? null : '/products/affiliate-portal'
      }
    });
    
  } catch (error) {
    console.error('Advanced analytics info error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INFO_ERROR',
        message: 'Failed to get analytics information'
      }
    }, { status: 500 });
  }
});