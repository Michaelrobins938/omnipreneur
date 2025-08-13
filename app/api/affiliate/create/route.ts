// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';

// Types
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

interface OptimizationParams {
  originalUrl: string;
  campaignName: string;
  commissionRate: number;
  description: string;
  targetAudience: string;
  customSlug?: string;
  expiryDate?: string;
  clickLimit?: number;
  generateQRCode: boolean;
  enableAnalytics: boolean;
}

interface URLAnalysis {
  domain: string;
  isHTTPS: boolean;
  hasTrackingParams: boolean;
  isShortened: boolean;
  pathLength: number;
  isDomainTrusted: boolean;
}

interface CompetitorAnalysis {
  competitors: number;
  avgCommission: number;
  marketSaturation: 'low' | 'medium' | 'high';
  opportunities: string[];
}

interface OptimizationResult {
  optimizationScore: number;
  score: number;
  expectedCTR: number;
  recommendations: string[];
  competitorAnalysis: CompetitorAnalysis;
  urlAnalysis: URLAnalysis;
  processingTime: number;
}

// Use shared Prisma client

// Validation schema
const CreateAffiliateLinkSchema = z.object({
  originalUrl: z.string().url('Must be a valid URL'),
  campaignName: z.string().min(1).max(100).optional(),
  commissionRate: z.number().min(0.01).max(1.0), // 1% to 100%
  description: z.string().max(500).optional(),
  targetAudience: z.string().max(200).optional(),
  customSlug: z.string().min(3).max(50).regex(/^[a-zA-Z0-9-_]+$/).optional(),
  expiryDate: z.string().datetime().optional(),
  clickLimit: z.number().positive().optional(),
  generateQRCode: z.boolean().default(false),
  enableAnalytics: z.boolean().default(true)
});

// Usage limits by plan
const PLAN_LIMITS = {
  FREE: { affiliateLinks: 5 },
  PRO: { affiliateLinks: 100 },
  ENTERPRISE: { affiliateLinks: -1 } // Unlimited
};

/**
 * POST /api/affiliate/create
 * 
 * Create new affiliate link with tracking and optimization
 * 
 * Authentication: Required
 * Subscription: PRO or higher for advanced features
 * 
 * Body:
 * {
 *   originalUrl: string,
 *   campaignName?: string,
 *   commissionRate: number,
 *   description?: string,
 *   targetAudience?: string,
 *   customSlug?: string,
 *   expiryDate?: string,
 *   clickLimit?: number,
 *   generateQRCode?: boolean,
 *   enableAnalytics?: boolean
 * }
 */
export const POST = requireAuth(withCsrfProtection(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    const body = await request.json();
    
    // Validate input
    const validatedData = CreateAffiliateLinkSchema.parse(body);

    // Check usage limits
    const userWithUsage = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { 
        usage: true,
        subscription: true
      }
    });

    if (!userWithUsage || !userWithUsage.usage || !userWithUsage.subscription) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USER_DATA_ERROR', 
            message: 'User data not found' 
          } 
        },
        { status: 404 }
      );
    }

    const currentPlan = userWithUsage.subscription.plan;
    const planLimit = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS];
    
    if (planLimit.affiliateLinks !== -1 && 
        userWithUsage.usage.affiliateLinks >= planLimit.affiliateLinks) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USAGE_LIMIT_EXCEEDED', 
            message: `Affiliate link limit reached for ${currentPlan} plan`,
            details: {
              used: userWithUsage.usage.affiliateLinks,
              limit: planLimit.affiliateLinks,
              plan: currentPlan
            }
          } 
        },
        { status: 402 }
      );
    }

    // Generate unique link ID
    let linkId: string = generateLinkId();
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    if (validatedData.customSlug) {
      // Check if custom slug is available
      const existingLink = await prisma.affiliateLink.findUnique({
        where: { linkId: validatedData.customSlug }
      });

      if (existingLink) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'SLUG_TAKEN', 
              message: 'Custom slug is already taken' 
            } 
          },
          { status: 400 }
        );
      }

      linkId = validatedData.customSlug;
      isUnique = true;
    } else {
      // Generate random link ID
      while (!isUnique && attempts < maxAttempts) {
        linkId = generateLinkId();
        const existingLink = await prisma.affiliateLink.findUnique({
          where: { linkId }
        });
        isUnique = !existingLink;
        attempts++;
      }

      if (!isUnique) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'ID_GENERATION_FAILED', 
              message: 'Failed to generate unique link ID' 
            } 
          },
          { status: 500 }
        );
      }
    }

    // Optimize link for performance and conversion
    const optimizationParams: OptimizationParams = {
      originalUrl: validatedData.originalUrl,
      campaignName: validatedData.campaignName || `Campaign ${linkId}`,
      commissionRate: validatedData.commissionRate,
      description: validatedData.description || '',
      targetAudience: validatedData.targetAudience || '',
      generateQRCode: validatedData.generateQRCode,
      enableAnalytics: validatedData.enableAnalytics,
      ...(validatedData.customSlug && { customSlug: validatedData.customSlug }),
      ...(validatedData.expiryDate && { expiryDate: validatedData.expiryDate }),
      ...(validatedData.clickLimit && { clickLimit: validatedData.clickLimit })
    };
    const optimizationData = await optimizeAffiliateLink(optimizationParams);
    
    // Create affiliate link in database using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create affiliate link
      const affiliateLink = await tx.affiliateLink.create({
        data: {
          userId: user.userId,
          linkId: linkId!,
          originalUrl: validatedData.originalUrl,
          affiliateUrl: `${process.env['NEXT_PUBLIC_APP_URL']}/go/${linkId}`,
          campaignName: validatedData.campaignName || `Campaign ${linkId}`,
          commissionRate: validatedData.commissionRate,
          optimizationData: JSON.stringify({
            ...optimizationData,
            description: validatedData.description,
            targetAudience: validatedData.targetAudience,
            expiryDate: validatedData.expiryDate,
            clickLimit: validatedData.clickLimit,
            generateQRCode: validatedData.generateQRCode,
            enableAnalytics: validatedData.enableAnalytics
          })
        }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: user.userId },
        data: {
          affiliateLinks: { increment: 1 }
        }
      });

      // Log event for analytics
      await tx.event.create({
        data: {
          userId: user.userId,
          event: 'affiliate_link_created',
          metadata: {
            linkId: affiliateLink.linkId,
            originalUrl: validatedData.originalUrl,
            commissionRate: validatedData.commissionRate,
            campaignName: validatedData.campaignName,
            customSlug: !!validatedData.customSlug,
            optimizationScore: optimizationData.optimizationScore
          }
        }
      });

      return affiliateLink;
    });

    // Generate QR code if requested (for PRO+ users)
    let qrCodeData = null;
    if (validatedData.generateQRCode && ['PRO', 'ENTERPRISE'].includes(currentPlan)) {
      qrCodeData = await generateQRCode(result.affiliateUrl);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        qrCode: qrCodeData,
        optimization: {
          score: optimizationData.optimizationScore,
          recommendations: optimizationData.recommendations,
          expectedCTR: optimizationData.expectedCTR,
          competitorAnalysis: optimizationData.competitorAnalysis
        }
      }
    });

  } catch (error: unknown) {
    console.error('Affiliate link creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
            details: error.issues 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'AFFILIATE_CREATION_ERROR', 
          message: (error as Error).message || 'Affiliate link creation failed' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 20, // Protect create endpoint
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `affiliate-create:${userId}:${ip}`;
  }
})));

/**
 * Generate unique link ID
 */
function generateLinkId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Optimize affiliate link for better performance
 * This will be enhanced with real AI in Phase 2
 */
async function optimizeAffiliateLink(params: OptimizationParams): Promise<OptimizationResult> {
  const startTime = Date.now();
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));

  // Analyze URL for optimization opportunities
  const urlAnalysis = analyzeURL(params.originalUrl);
  
  // Calculate optimization score
  let optimizationScore = 70; // Base score
  
  // Scoring factors
  if (params.campaignName) optimizationScore += 10;
  if (params.targetAudience) optimizationScore += 10;
  if (params.description) optimizationScore += 5;
  if (params.customSlug) optimizationScore += 10;
  if (params.commissionRate >= 0.15) optimizationScore += 5; // 15%+ commission
  
  // URL quality factors
  if (urlAnalysis.isHTTPS) optimizationScore += 5;
  if (urlAnalysis.hasTrackingParams) optimizationScore -= 5;
  if (urlAnalysis.isShortened) optimizationScore -= 10;

  // Expected CTR calculation
  const expectedCTR = calculateExpectedCTR(params, urlAnalysis);
  
  // Generate recommendations
  const recommendations = generateRecommendations(params, urlAnalysis, optimizationScore);
  
  // Competitor analysis
  const competitorAnalysis = analyzeCompetitors(params.originalUrl);

  return {
    optimizationScore: Math.min(100, Math.max(0, optimizationScore)),
    score: Math.min(100, Math.max(0, optimizationScore)),
    expectedCTR,
    recommendations,
    competitorAnalysis,
    urlAnalysis,
    processingTime: Date.now() - startTime
  };
}

/**
 * Analyze URL structure and quality
 */
function analyzeURL(url: string): URLAnalysis {
  const urlObj = new URL(url);
  
  return {
    domain: urlObj.hostname,
    isHTTPS: urlObj.protocol === 'https:',
    hasTrackingParams: urlObj.searchParams.size > 0,
    isShortened: ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'].some(domain => 
      urlObj.hostname.includes(domain)
    ),
    pathLength: urlObj.pathname.length,
    isDomainTrusted: ['amazon.com', 'shopify.com', 'etsy.com', 'ebay.com'].some(domain => 
      urlObj.hostname.includes(domain)
    )
  };
}

/**
 * Calculate expected click-through rate
 */
function calculateExpectedCTR(params: OptimizationParams, urlAnalysis: URLAnalysis): number {
  let baseCTR = 2.5; // 2.5% base CTR
  
  // Commission rate impact
  if (params.commissionRate >= 0.20) baseCTR += 0.8; // High commission
  else if (params.commissionRate >= 0.10) baseCTR += 0.4; // Medium commission
  
  // URL trust factors
  if (urlAnalysis.isDomainTrusted) baseCTR += 1.2;
  if (urlAnalysis.isHTTPS) baseCTR += 0.3;
  if (urlAnalysis.isShortened) baseCTR -= 0.5;
  
  // Campaign factors
  if (params.targetAudience) baseCTR += 0.5;
  if (params.campaignName) baseCTR += 0.3;
  if (params.customSlug) baseCTR += 0.4;
  
  return Math.round(baseCTR * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(params: OptimizationParams, urlAnalysis: URLAnalysis, score: number): string[] {
  const recommendations = [];
  
  if (score < 80) {
    recommendations.push('Consider adding a campaign name for better organization');
  }
  
  if (!params.targetAudience) {
    recommendations.push('Define target audience for better conversion tracking');
  }
  
  if (!params.description) {
    recommendations.push('Add description to help with campaign management');
  }
  
  if (!params.customSlug) {
    recommendations.push('Use custom slug for branded, memorable links');
  }
  
  if (params.commissionRate < 0.10) {
    recommendations.push('Consider increasing commission rate to boost motivation');
  }
  
  if (urlAnalysis.hasTrackingParams) {
    recommendations.push('Remove unnecessary tracking parameters for cleaner links');
  }
  
  if (!urlAnalysis.isHTTPS) {
    recommendations.push('Ensure target URL uses HTTPS for security');
  }
  
  if (urlAnalysis.isShortened) {
    recommendations.push('Avoid linking to already shortened URLs');
  }
  
  // Add general best practices
  recommendations.push('Set up conversion tracking for better ROI analysis');
  recommendations.push('Monitor click patterns and adjust targeting');
  recommendations.push('A/B test different campaign names and audiences');
  
  return recommendations;
}

/**
 * Analyze competitor landscape
 */
function analyzeCompetitors(url: string): CompetitorAnalysis {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  
  // Simulated competitor analysis
  const industryData = {
    'amazon.com': { avgCommission: 8.5, competition: 'high', seasonality: 'Q4 peak' },
    'shopify.com': { avgCommission: 15.0, competition: 'medium', seasonality: 'steady' },
    'etsy.com': { avgCommission: 12.0, competition: 'medium', seasonality: 'holiday peak' }
  };
  
  const matchedIndustry = Object.keys(industryData).find(d => domain.includes(d));
  const data = matchedIndustry ? industryData[matchedIndustry as keyof typeof industryData] : null;
  
  return {
    competitors: Math.floor(Math.random() * 50) + 10,
    avgCommission: data?.avgCommission || 10.0,
    marketSaturation: (data?.competition === 'high' ? 'high' : data?.competition === 'medium' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
    opportunities: [
      'Target long-tail keywords',
      'Focus on seasonal campaigns',
      'Optimize for mobile traffic',
      'Leverage social media integration'
    ]
  };
}

/**
 * Generate QR code for affiliate link (PRO+ feature)
 */
async function generateQRCode(url: string) {
  // Simulate QR code generation
  // In production, this would use a QR code library
  return {
    url: url,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`,
    size: '200x200',
    format: 'PNG',
    generatedAt: new Date().toISOString()
  };
}