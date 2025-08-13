// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import crypto from 'crypto';

const AffiliateApplicationSchema = z.object({
  companyName: z.string().optional(),
  website: z.string().url().optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    other: z.string().optional()
  }).optional(),
  audienceSize: z.number().min(0).optional(),
  niche: z.string().min(3).max(100).optional(),
  marketingMethod: z.enum([
    'content_marketing',
    'paid_advertising', 
    'social_media',
    'email_marketing',
    'influencer',
    'seo',
    'youtube',
    'podcast',
    'webinars',
    'other'
  ]).optional(),
  payoutMethod: z.enum(['PAYPAL', 'BANK_TRANSFER', 'STRIPE']).default('PAYPAL'),
  paypalEmail: z.string().email().optional(),
  experience: z.string().max(1000).optional(),
  whyAffiliate: z.string().max(1000).optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'Must accept terms'),
  taxId: z.string().optional()
});

/**
 * POST /api/affiliates/apply
 * 
 * Apply to become a platform affiliate
 * 
 * Authentication: Required
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const validatedData = AffiliateApplicationSchema.parse(body);

    // Check if user already has affiliate application/account
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId: user.userId }
    });

    if (existingAffiliate) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ALREADY_APPLIED',
          message: 'You have already applied to the affiliate program',
          status: existingAffiliate.status
        }
      }, { status: 409 });
    }

    // Generate unique affiliate and referral codes
    const affiliateCode = generateAffiliateCode(user.userId);
    const referralCode = generateReferralCode();

    // Create affiliate application
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: user.userId,
        affiliateCode,
        referralCode,
        status: 'PENDING',
        commissionRate: 0.30, // 30% default commission rate
        termsAcceptedAt: new Date(),
        ...(validatedData.companyName ? { companyName: validatedData.companyName } : {}),
        ...(validatedData.website ? { website: validatedData.website } : {}),
        ...(validatedData.socialMedia ? { socialMedia: validatedData.socialMedia } : {}),
        ...(validatedData.audienceSize ? { audienceSize: validatedData.audienceSize } : {}),
        ...(validatedData.niche ? { niche: validatedData.niche } : {}),
        ...(validatedData.marketingMethod ? { marketingMethod: validatedData.marketingMethod } : {}),
        ...(validatedData.payoutMethod ? { payoutMethod: validatedData.payoutMethod } : {}),
        ...(validatedData.paypalEmail ? { paypalEmail: validatedData.paypalEmail } : {}),
        ...(validatedData.taxId ? { taxId: validatedData.taxId } : {})
      }
    });

    // Log application event
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'affiliate_application_submitted',
        metadata: {
          affiliateId: affiliate.id,
          affiliateCode,
          referralCode,
          niche: validatedData.niche,
          marketingMethod: validatedData.marketingMethod,
          audienceSize: validatedData.audienceSize
        }
      }
    });

    // TODO: Send notification to admin for review
    // TODO: Send confirmation email to applicant

    return NextResponse.json({
      success: true,
      data: {
        id: affiliate.id,
        affiliateCode,
        referralCode,
        status: affiliate.status,
        message: 'Application submitted successfully! We will review your application within 2-3 business days.'
      }
    });

  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid application data',
          details: error.issues
        }
      }, { status: 400 });
    }

    console.error('Affiliate application error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'APPLICATION_ERROR',
        message: 'Failed to process affiliate application'
      }
    }, { status: 500 });
  }
}), {
  limit: 5, // 5 applications per window
  windowMs: 60 * 60 * 1000, // 1 hour
  key: (req: NextRequest) => `affiliate-apply:${(req as any).user?.userId || 'anonymous'}`
}));

/**
 * GET /api/affiliates/apply
 * 
 * Get current user's affiliate status and application info
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: user.userId },
      select: {
        id: true,
        affiliateCode: true,
        referralCode: true,
        status: true,
        commissionRate: true,
        totalEarnings: true,
        pendingEarnings: true,
        clicksGenerated: true,
        conversions: true,
        conversionRate: true,
        approvedAt: true,
        rejectedAt: true,
        rejectionReason: true,
        createdAt: true
      }
    });

    if (!affiliate) {
      return NextResponse.json({
        success: true,
        data: {
          hasApplied: false,
          canApply: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        hasApplied: true,
        affiliate
      }
    });

  } catch (error) {
    console.error('Get affiliate status error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'STATUS_ERROR',
        message: 'Failed to get affiliate status'
      }
    }, { status: 500 });
  }
});

// Helper functions
function generateAffiliateCode(userId: string): string {
  // Create a deterministic but unique code based on user ID
  const hash = crypto.createHash('sha256').update(userId).digest('hex');
  return `AF${hash.substring(0, 8).toUpperCase()}`;
}

function generateReferralCode(): string {
  // Generate a shorter, more user-friendly referral code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}