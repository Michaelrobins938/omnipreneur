// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { headers } from 'next/headers';

/**
 * GET /api/affiliates/track/[code]
 * 
 * Track affiliate click and redirect to landing page
 * This endpoint handles the actual affiliate link clicks
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const affiliateCode = params.code;
    const searchParams = new URL(request.url).searchParams;
    const targetUrl = searchParams.get('url') || '/';
    
    // Get tracking information
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const referrerUrl = headersList.get('referer') || '';
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '';

    // Find affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { 
        affiliateCode,
        status: 'APPROVED' // Only track for approved affiliates
      }
    });

    if (!affiliate) {
      // Redirect anyway but don't track
      return NextResponse.redirect(new URL(targetUrl, request.url).toString());
    }

    // Generate session fingerprint for better attribution
    const fingerprint = generateFingerprint(userAgent, ipAddress);
    const sessionId = generateSessionId();

    // Track the click
    await prisma.$transaction(async (tx) => {
      // Record the click
      await tx.affiliateClick.create({
        data: {
          affiliateId: affiliate.id,
          affiliateCode,
          ipAddress,
          userAgent,
          referrerUrl,
          landingPage: targetUrl,
          sessionId,
          fingerprint
        }
      });

      // Update affiliate click count
      await tx.affiliate.update({
        where: { id: affiliate.id },
        data: {
          clicksGenerated: { increment: 1 }
        }
      });
    });

    // Set tracking cookies for attribution
    const response = NextResponse.redirect(new URL(targetUrl, request.url).toString());
    
    // Set affiliate tracking cookie (30-day expiration)
    response.cookies.set('affiliate_code', affiliateCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Set session tracking cookie
    response.cookies.set('affiliate_session', sessionId, {
      maxAge: 24 * 60 * 60, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;

  } catch (error) {
    console.error('Affiliate tracking error:', error);
    
    // Always redirect even if tracking fails
    const targetUrl = new URL(request.url).searchParams.get('url') || '/';
    return NextResponse.redirect(new URL(targetUrl, request.url).toString());
  }
}

/**
 * POST /api/affiliates/track/[code]
 * 
 * Track conversion events (signup, subscription)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const affiliateCode = params.code;
    const body = await request.json();
    const { eventType, userId, subscriptionData } = body;

    if (eventType === 'signup') {
      await trackSignup(affiliateCode, userId);
    } else if (eventType === 'subscription') {
      await trackSubscription(affiliateCode, userId, subscriptionData);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to track conversion'
    }, { status: 500 });
  }
}

// Helper functions
function generateFingerprint(userAgent: string, ipAddress: string): string {
  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(userAgent + ipAddress)
    .digest('hex')
    .substring(0, 16);
}

function generateSessionId(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('hex');
}

async function trackSignup(affiliateCode: string, userId: string) {
  const affiliate = await prisma.affiliate.findUnique({
    where: { affiliateCode }
  });

  if (!affiliate) return;

  // Create referral record
  await prisma.referral.create({
    data: {
      affiliateId: affiliate.id,
      referredUserId: userId,
      status: 'SIGNED_UP',
      clickTimestamp: new Date(), // Should ideally get from click record
      signupTimestamp: new Date()
    }
  });

  // Update user's referral source
  await prisma.user.update({
    where: { id: userId },
    data: {
      referredBy: affiliateCode,
      referralSource: 'affiliate'
    }
  });
}

async function trackSubscription(affiliateCode: string, userId: string, subscriptionData: any) {
  const affiliate = await prisma.affiliate.findUnique({
    where: { affiliateCode }
  });

  if (!affiliate) return;

  const { plan, amount, subscriptionId } = subscriptionData;
  const commissionAmount = amount * affiliate.commissionRate;

  await prisma.$transaction(async (tx) => {
    // Update referral with conversion data
    await tx.referral.updateMany({
      where: {
        affiliateId: affiliate.id,
        referredUserId: userId,
        status: 'SIGNED_UP'
      },
      data: {
        status: 'CONVERTED',
        conversionTimestamp: new Date(),
        subscriptionId,
        subscriptionPlan: plan,
        subscriptionAmount: amount,
        commissionAmount,
        commissionPaid: false
      }
    });

    // Create commission record
    await tx.commission.create({
      data: {
        affiliateId: affiliate.id,
        type: 'REFERRAL',
        amount: commissionAmount,
        status: 'PENDING',
        subscriptionId,
        subscriptionPlan: plan,
        description: `Referral commission for ${plan} subscription`
      }
    });

    // Update affiliate stats
    await tx.affiliate.update({
      where: { id: affiliate.id },
      data: {
        conversions: { increment: 1 },
        pendingEarnings: { increment: commissionAmount },
        conversionRate: {
          set: (affiliate.conversions + 1) / affiliate.clicksGenerated
        }
      }
    });
  });
}