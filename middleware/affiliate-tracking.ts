import { NextRequest, NextResponse } from 'next/server';

/**
 * Affiliate tracking middleware
 * Handles affiliate link tracking and cookie setting
 */
export function affiliateTrackingMiddleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const searchParams = url.searchParams;
  
  // Check for affiliate referral parameters
  const ref = searchParams.get('ref');
  const affiliateCode = searchParams.get('aff');
  const trackingCode = ref || affiliateCode;
  
  if (!trackingCode) {
    return NextResponse.next();
  }

  // Create response to set tracking cookies
  const response = NextResponse.next();
  
  // Set affiliate tracking cookie (30-day attribution window)
  response.cookies.set('affiliate_ref', trackingCode, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  // Set first visit timestamp for attribution window
  if (!request.cookies.get('affiliate_first_visit')) {
    response.cookies.set('affiliate_first_visit', Date.now().toString(), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  }

  // Track the click asynchronously (don't block the request)
  if (typeof window === 'undefined') { // Server-side only
    // Queue click tracking for background processing
    setImmediate(() => {
      trackAffiliateClick(trackingCode, {
        userAgent: request.headers.get('user-agent') || '',
        referrer: request.headers.get('referer') || '',
        ip: getClientIP(request),
        landingPage: url.pathname + url.search,
        timestamp: new Date()
      }).catch(error => {
        console.error('Background affiliate tracking failed:', error);
      });
    });
  }

  // Clean URL by removing affiliate parameters for better UX
  const cleanedParams = new URLSearchParams(searchParams);
  cleanedParams.delete('ref');
  cleanedParams.delete('aff');
  
  // If URL parameters were changed, redirect to clean URL
  if (cleanedParams.toString() !== searchParams.toString()) {
    url.search = cleanedParams.toString();
    return NextResponse.redirect(url);
  }

  return response;
}

/**
 * Track affiliate click in background
 */
async function trackAffiliateClick(
  affiliateCode: string,
  data: {
    userAgent: string;
    referrer: string;
    ip: string;
    landingPage: string;
    timestamp: Date;
  }
) {
  try {
    // Import Prisma dynamically to avoid edge runtime issues
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Find affiliate by referral code
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        OR: [
          { referralCode: affiliateCode },
          { affiliateCode: affiliateCode }
        ],
        status: 'APPROVED'
      }
    });

    if (!affiliate) {
      console.warn(`Affiliate not found for code: ${affiliateCode}`);
      return;
    }

    // Generate session fingerprint for deduplication
    const crypto = await import('crypto');
    const fingerprint = crypto
      .createHash('sha256')
      .update(data.userAgent + data.ip + data.landingPage)
      .digest('hex')
      .substring(0, 16);

    // Check for recent duplicate clicks (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentClick = await prisma.affiliateClick.findFirst({
      where: {
        affiliateId: affiliate.id,
        fingerprint,
        timestamp: {
          gte: oneHourAgo
        }
      }
    });

    if (recentClick) {
      // Duplicate click within 1 hour, skip tracking
      return;
    }

    // Track the click
    await prisma.$transaction(async (tx) => {
      await tx.affiliateClick.create({
        data: {
          affiliateId: affiliate.id,
          affiliateCode: affiliate.affiliateCode,
          ipAddress: data.ip,
          userAgent: data.userAgent,
          referrerUrl: data.referrer,
          landingPage: data.landingPage,
          fingerprint,
          timestamp: data.timestamp
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

    await prisma.$disconnect();

  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
}

/**
 * Get client IP address from request headers
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || '127.0.0.1';
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to connection remote address
  return (request as any).ip || '127.0.0.1';
}

/**
 * Check if user came from affiliate link (for signup tracking)
 */
export function getAffiliateFromCookies(request: NextRequest) {
  const affiliateRef = request.cookies.get('affiliate_ref')?.value;
  const firstVisit = request.cookies.get('affiliate_first_visit')?.value;
  
  if (!affiliateRef || !firstVisit) {
    return null;
  }

  // Check if attribution window is still valid (30 days)
  const firstVisitTime = parseInt(firstVisit);
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  
  if (Date.now() - firstVisitTime > thirtyDaysInMs) {
    return null; // Attribution window expired
  }

  return {
    affiliateCode: affiliateRef,
    firstVisit: new Date(firstVisitTime)
  };
}

/**
 * Clear affiliate tracking cookies (call after conversion)
 */
export function clearAffiliateTracking(response: NextResponse) {
  response.cookies.delete('affiliate_ref');
  response.cookies.delete('affiliate_first_visit');
  return response;
}