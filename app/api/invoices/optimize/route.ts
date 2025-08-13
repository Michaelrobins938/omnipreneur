// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { InvoiceGeneratorService, InvoiceOptimizationRequest } from '@/lib/ai/invoice-generator-service';
import prisma, { logAIRequest } from '@/lib/db';

// Types for authenticated request
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

// Invoice optimization request schema
const InvoiceOptimizationSchema = z.object({
  clientData: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    company: z.string().optional(),
    industry: z.string().optional(),
    location: z.string().optional(),
    paymentHistory: z.array(z.object({
      invoiceId: z.string(),
      amount: z.number(),
      dueDate: z.string(),
      paidDate: z.string().optional(),
      paymentMethod: z.string(),
      status: z.enum(['paid', 'overdue', 'pending'])
    })),
    creditRating: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
    relationship: z.enum(['new', 'existing', 'long-term'])
  }),
  services: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    category: z.string(),
    recurring: z.boolean().optional(),
    priority: z.enum(['high', 'medium', 'low'])
  })),
  invoiceSettings: z.object({
    currency: z.string().default('USD'),
    taxRate: z.number().min(0).max(1).optional(),
    discountPolicy: z.object({
      earlyPayment: z.number().optional(),
      volume: z.number().optional(),
      loyalty: z.number().optional()
    }).optional(),
    paymentTerms: z.object({
      net: z.number(),
      earlyPaymentDiscount: z.object({
        percentage: z.number(),
        days: z.number()
      }).optional()
    })
  }),
  businessContext: z.object({
    cashFlowNeeds: z.enum(['urgent', 'moderate', 'flexible']),
    relationshipPriority: z.enum(['high', 'medium', 'low']),
    competitivePosition: z.enum(['premium', 'competitive', 'budget'])
  })
});

/**
 * POST /api/invoices/optimize
 * 
 * AI-powered invoice optimization with:
 * - Payment probability prediction
 * - Optimal terms suggestions
 * - Late payment risk analysis
 * - Revenue forecasting
 * - Template optimization
 * 
 * Authentication: Required
 * Subscription: INVOICE_GENERATOR, PRO, or ENTERPRISE
 */
export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        
        // Parse and validate request body
        const body = await request.json();
        const validated = InvoiceOptimizationSchema.parse(body);
        
        // Check subscription eligibility
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['INVOICE_GENERATOR', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Invoice Generator subscription required for AI optimization',
              upgradeUrl: '/products/invoice-generator'
            }
          }, { status: 403 });
        }

        // Process with AI service
        const t0 = Date.now();
        const aiService = new InvoiceGeneratorService();
        const result = await aiService.processAdvancedOptimization(validated);

        // Log AI request for tracking
        try {
          await logAIRequest({
            userId: user.userId,
            productId: 'invoice-generator',
            modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
            processingTimeMs: Date.now() - t0,
            success: true,
            inputData: {
              clientRelationship: validated.clientData.relationship,
              serviceCount: validated.services.length,
              totalValue: validated.services.reduce((sum, service) => sum + (service.quantity * service.unitPrice), 0),
              cashFlowNeeds: validated.businessContext.cashFlowNeeds
            },
            outputData: {
              optimizedTerms: result.paymentTerms.net,
              predictedPaymentProbability: result.paymentPrediction.probability,
              estimatedCollectionTime: result.paymentPrediction.estimatedCollectionDays,
              riskLevel: result.riskAssessment.level
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
            clientId: validated.clientData.id,
            totalValue: validated.services.reduce((sum, service) => sum + (service.quantity * service.unitPrice), 0),
            processingTimeMs: Date.now() - t0,
            optimizationScore: result.optimizationScore || 85,
            riskLevel: result.riskAssessment.level
          }
        };

        return NextResponse.json({
          success: true,
          data: responseData
        });

      } catch (error) {
        console.error('Invoice optimization error:', error);
        
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
            code: 'OPTIMIZATION_ERROR',
            message: 'Failed to process invoice optimization'
          }
        }, { status: 500 });
      }
    }, {
      limit: 20, // 20 requests per 10 minutes for AI invoice optimization
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => {
        const user = (req as any).user?.userId || 'anonymous';
        return `invoices-optimize-ai:${user}`;
      }
    })
  )
);

/**
 * GET /api/invoices/optimize
 * 
 * Get optimization options and user's current subscription status
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
    const hasAccess = ['INVOICE_GENERATOR', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    // Get invoice count (if invoices table exists)
    let invoiceCount = 0;
    try {
      invoiceCount = await prisma.invoice?.count({
        where: { userId: user.userId }
      }) || 0;
    } catch (error) {
      // Invoices table might not exist yet
      console.warn('Invoices table not found:', error);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        invoiceCount,
        features: {
          paymentOptimization: hasAccess,
          riskAssessment: hasAccess,
          termsSuggestions: hasAccess,
          collectionPrediction: hasAccess,
          advancedTemplates: userPlan === 'ENTERPRISE',
          customBranding: userPlan === 'ENTERPRISE' || userPlan === 'PRO'
        },
        currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        paymentTermOptions: [15, 30, 45, 60, 90],
        upgradeUrl: hasAccess ? null : '/products/invoice-generator'
      }
    });
    
  } catch (error) {
    console.error('Invoice optimization info error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INFO_ERROR',
        message: 'Failed to get optimization information'
      }
    }, { status: 500 });
  }
});