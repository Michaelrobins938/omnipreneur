// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { CustomerServiceService } from '@/lib/ai/customer-service-service';
import prisma, { logAIRequest } from '@/lib/db';

interface AuthenticatedRequest extends NextRequest {
  user: { userId: string; email: string; };
}

const CustomerServiceAnalysisSchema = z.object({
  tickets: z.array(z.object({
    id: z.string(),
    subject: z.string(),
    body: z.string().max(2000),
    sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    customerType: z.enum(['new', 'existing', 'vip']).optional(),
    category: z.string().optional(),
    timestamp: z.string().optional(),
    customerEmail: z.string().email().optional()
  })).min(1).max(100),
  slaHours: z.number().min(1).max(168).default(24),
  analysisType: z.enum(['triage', 'sentiment', 'routing', 'comprehensive']).default('comprehensive'),
  autoResponseEnabled: z.boolean().default(true),
  priorityRules: z.object({
    vipCustomers: z.boolean().default(true),
    urgentKeywords: z.array(z.string()).optional(),
    escalationTriggers: z.array(z.string()).optional()
  }).optional()
});

export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        const body = await request.json();
        const validated = CustomerServiceAnalysisSchema.parse(body);
        
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['CUSTOMER_SERVICE_AI', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Customer Service AI subscription required',
              upgradeUrl: '/products/customer-service-ai'
            }
          }, { status: 403 });
        }

        const t0 = Date.now();
        const aiService = new CustomerServiceService();
        const serviceRequest = {
          tickets: validated.tickets.map(t => ({
            id: t.id, subject: t.subject, body: t.body,
            sentiment: t.sentiment, priority: t.priority
          })),
          slaHours: validated.slaHours
        };
        
        const result = await aiService.process(serviceRequest);
        
        // Enhanced customer service analytics
        const enhancedAnalytics = {
          ticketMetrics: {
            total: validated.tickets.length,
            byPriority: calculatePriorityDistribution(validated.tickets),
            bySentiment: result.sentimentBreakdown,
            avgUrgencyScore: result.routing.reduce((sum, r) => sum + r.urgencyScore, 0) / result.routing.length
          },
          responseRecommendations: {
            autoResponseCandidates: result.routing.filter(r => r.autoReply).length,
            escalationRequired: result.routing.filter(r => r.urgencyScore > 80).length,
            priorityQueue: result.routing.filter(r => r.suggestedQueue === 'priority').length
          },
          efficiency: {
            expectedResolutionTime: result.kpiForecast.expectedResolutionHours,
            escalationRisk: result.kpiForecast.escalationRiskPct,
            workloadDistribution: calculateWorkloadDistribution(result.routing),
            slaCompliance: calculateSLACompliance(validated.slaHours, result.kpiForecast.expectedResolutionHours)
          },
          insights: generateCustomerServiceInsights(validated.tickets, result)
        };

        await logAIRequest({
          userId: user.userId,
          productId: 'customer-service-ai',
          modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
          processingTimeMs: Date.now() - t0,
          success: true,
          inputData: { 
            ticketsCount: validated.tickets.length,
            analysisType: validated.analysisType,
            slaHours: validated.slaHours
          },
          outputData: { 
            routingRecommendations: result.routing.length,
            avgUrgencyScore: enhancedAnalytics.ticketMetrics.avgUrgencyScore,
            escalationRisk: result.kpiForecast.escalationRiskPct
          }
        });

        return NextResponse.json({
          success: true,
          data: {
            ...result,
            analytics: enhancedAnalytics,
            metadata: {
              processedAt: new Date().toISOString(),
              ticketsAnalyzed: validated.tickets.length,
              processingTimeMs: Date.now() - t0,
              analysisType: validated.analysisType,
              slaTarget: validated.slaHours
            }
          }
        });

      } catch (error) {
        console.error('Customer service analysis error:', error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Invalid request parameters', details: error.issues }
          }, { status: 400 });
        }
        
        return NextResponse.json({
          success: false,
          error: { code: 'CUSTOMER_SERVICE_ERROR', message: 'Failed to analyze customer service tickets' }
        }, { status: 500 });
      }
    }, {
      limit: 20,
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => `customer-service-analyze:${(req as any).user?.userId || 'anonymous'}`
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
    const hasAccess = ['CUSTOMER_SERVICE_AI', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        features: {
          ticketAnalysis: hasAccess,
          sentimentAnalysis: hasAccess,
          autoRouting: hasAccess,
          priorityScoring: hasAccess,
          macroSuggestions: hasAccess,
          slaTracking: hasAccess,
          advancedAnalytics: userPlan === 'ENTERPRISE',
          bulkProcessing: userPlan === 'ENTERPRISE',
          customWorkflows: userPlan === 'ENTERPRISE'
        },
        limits: {
          ticketsPerRequest: hasAccess ? 100 : 10,
          analysisHistory: hasAccess ? '6 months' : '1 month',
          autoResponses: hasAccess ? 'unlimited' : '50/month'
        },
        supportedAnalysis: ['triage', 'sentiment', 'routing', 'comprehensive'],
        priorityLevels: ['low', 'medium', 'high', 'urgent'],
        upgradeUrl: hasAccess ? null : '/products/customer-service-ai'
      }
    });
  } catch (error) {
    console.error('Customer service info error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INFO_ERROR', message: 'Failed to get customer service information' }
    }, { status: 500 });
  }
});

function calculatePriorityDistribution(tickets: any[]) {
  const distribution = { low: 0, medium: 0, high: 0, urgent: 0 };
  tickets.forEach(ticket => {
    const priority = ticket.priority || 'medium';
    distribution[priority as keyof typeof distribution]++;
  });
  return distribution;
}

function calculateWorkloadDistribution(routing: any[]) {
  const distribution: Record<string, number> = {};
  routing.forEach(route => {
    distribution[route.suggestedQueue] = (distribution[route.suggestedQueue] || 0) + 1;
  });
  return distribution;
}

function calculateSLACompliance(targetHours: number, expectedHours: number): number {
  if (expectedHours <= targetHours) return 100;
  const overage = ((expectedHours - targetHours) / targetHours) * 100;
  return Math.max(0, 100 - overage);
}

function generateCustomerServiceInsights(tickets: any[], result: any): string[] {
  const insights: string[] = [];
  
  // Sentiment insights
  const negativeCount = result.sentimentBreakdown.negative || 0;
  const totalCount = tickets.length;
  if (negativeCount / totalCount > 0.3) {
    insights.push(`High negative sentiment detected (${Math.round(negativeCount/totalCount*100)}%) - consider proactive outreach`);
  }
  
  // Urgency insights
  const highUrgency = result.routing.filter((r: any) => r.urgencyScore > 80).length;
  if (highUrgency > totalCount * 0.2) {
    insights.push(`${highUrgency} tickets require immediate attention - consider additional staffing`);
  }
  
  // SLA insights
  if (result.kpiForecast.escalationRiskPct > 15) {
    insights.push(`Escalation risk is high (${result.kpiForecast.escalationRiskPct}%) - review ticket complexity`);
  }
  
  // Workload insights
  const priorityTickets = result.routing.filter((r: any) => r.suggestedQueue === 'priority').length;
  if (priorityTickets > totalCount * 0.4) {
    insights.push(`${priorityTickets} tickets routed to priority queue - consider queue balancing`);
  }
  
  return insights.length > 0 ? insights : ['Customer service operations appear well-balanced'];
}