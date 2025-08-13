// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { LeadGenerationService, LeadScoringRequest } from '@/lib/ai/lead-generation-service';
import prisma, { logAIRequest } from '@/lib/db';

// Types for authenticated request
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

// Enhanced lead scoring schema
const LeadScoringSchema = z.object({
  leads: z.array(z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    industry: z.string().optional(),
    source: z.string(),
    behavior: z.array(z.object({
      action: z.string(),
      timestamp: z.string(),
      value: z.string().optional(),
      score: z.number().optional()
    })),
    demographics: z.object({
      location: z.string().optional(),
      companySize: z.string().optional(),
      revenue: z.string().optional(),
      technology: z.array(z.string()).optional()
    }),
    engagement: z.object({
      emailOpens: z.number().min(0),
      emailClicks: z.number().min(0),
      websiteVisits: z.number().min(0),
      pageViews: z.number().min(0),
      timeOnSite: z.number().min(0),
      downloads: z.number().min(0)
    })
  })),
  scoringCriteria: z.object({
    industryFit: z.number().min(0).max(100),
    budgetFit: z.number().min(0).max(100),
    authorityLevel: z.number().min(0).max(100),
    timeline: z.number().min(0).max(100),
    engagement: z.number().min(0).max(100)
  }),
  conversionGoals: z.array(z.string()),
  targetProfile: z.object({
    industries: z.array(z.string()),
    companySizes: z.array(z.string()),
    jobTitles: z.array(z.string()),
    technologies: z.array(z.string())
  }).optional()
});

/**
 * POST /api/leads/score
 * 
 * AI-powered lead scoring with comprehensive analysis
 * 
 * Authentication: Required
 * Subscription: LEAD_GENERATION_PRO, PRO, or ENTERPRISE
 */
export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        
        // Parse and validate request body
        const body = await request.json();
        const validated = LeadScoringSchema.parse(body);
        
        // Check subscription eligibility
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['LEAD_GENERATION_PRO', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Lead Generation Pro subscription required for AI lead scoring',
              upgradeUrl: '/products/lead-generation-pro'
            }
          }, { status: 403 });
        }

        // Process with AI service
        const t0 = Date.now();
        const aiService = new LeadGenerationService();
        const result = await aiService.scoreLeads(validated);

        // Log AI request for tracking
        try {
          await logAIRequest({
            userId: user.userId,
            productId: 'lead-generation-pro',
            modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
            processingTimeMs: Date.now() - t0,
            success: true,
            inputData: {
              leadCount: validated.leads.length,
              conversionGoals: validated.conversionGoals,
              hasTargetProfile: !!validated.targetProfile
            },
            outputData: {
              scoredLeads: result.leadScores.length,
              averageScore: result.leadScores.reduce((sum, lead) => sum + lead.overallScore, 0) / result.leadScores.length,
              hotLeads: result.leadScores.filter(lead => lead.priority === 'hot').length,
              predictedConversions: result.predictions.expectedConversions
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
            leadCount: validated.leads.length,
            processingTimeMs: Date.now() - t0,
            averageScore: result.leadScores.reduce((sum, lead) => sum + lead.overallScore, 0) / result.leadScores.length,
            distribution: {
              hot: result.leadScores.filter(lead => lead.priority === 'hot').length,
              warm: result.leadScores.filter(lead => lead.priority === 'warm').length,
              cold: result.leadScores.filter(lead => lead.priority === 'cold').length
            }
          }
        };

        return NextResponse.json({
          success: true,
          data: responseData
        });

      } catch (error) {
        console.error('Lead scoring error:', error);
        
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
            code: 'SCORING_ERROR',
            message: 'Failed to process lead scoring'
          }
        }, { status: 500 });
      }
    }, {
      limit: 30, // 30 requests per 10 minutes for AI lead scoring
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => {
        const user = (req as any).user?.userId || 'anonymous';
        return `leads-score-ai:${user}`;
      }
    })
  )
);

