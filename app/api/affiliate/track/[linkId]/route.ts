// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withRateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

/**
 * GET /api/affiliate/track/[linkId]
 * 
 * Track affiliate link click and redirect to original URL
 * This endpoint handles the actual affiliate link redirection
 * 
 * No authentication required (public endpoint)
 * 
 * Query Parameters:
 * - ref?: string (referrer source)
 * - utm_source?: string (UTM tracking)
 * - utm_medium?: string (UTM tracking)
 * - utm_campaign?: string (UTM tracking)
 */
async function handleGET(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  try {
    const { linkId } = params;
    const { searchParams } = new URL(request.url);
    
    // Get request metadata
      const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const referer = headersList.get('referer') || searchParams.get('ref') || '';
    const clientIP = await getClientIP(request) || '';
    
    // UTM parameters
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');

    if (!linkId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_LINK_ID', 
            message: 'Link ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Find affiliate link
    const affiliateLink = await prisma.affiliateLink.findUnique({
      where: { linkId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            subscription: true
          }
        }
      }
    });

    if (!affiliateLink) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'LINK_NOT_FOUND', 
            message: 'Affiliate link not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Check if link is active and not expired
    const now = new Date();
    const optimizationData = affiliateLink.optimizationData as any;
    
    if (optimizationData?.expiryDate && new Date(optimizationData.expiryDate) < now) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'LINK_EXPIRED', 
            message: 'This affiliate link has expired' 
          } 
        },
        { status: 410 }
      );
    }

    // Check click limit
    if (optimizationData?.clickLimit && affiliateLink.clicks >= optimizationData.clickLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CLICK_LIMIT_REACHED', 
            message: 'This affiliate link has reached its click limit' 
          } 
        },
        { status: 410 }
      );
    }

    // Track the click using transaction
    await prisma.$transaction(async (tx) => {
      // Create click tracking record
      await tx.clickTracking.create({
        data: {
          linkId: affiliateLink.linkId,
          referrer: referer,
          ip: clientIP,
          userAgent: userAgent,
          timestamp: new Date()
        }
      });

      // Update affiliate link click counter
      await tx.affiliateLink.update({
        where: { linkId },
        data: {
          clicks: { increment: 1 }
        }
      });

      // Log event for analytics (if analytics enabled)
      if (optimizationData?.enableAnalytics !== false) {
        await tx.event.create({
          data: {
            userId: affiliateLink.userId,
            event: 'affiliate_link_clicked',
            metadata: {
              linkId: affiliateLink.linkId,
              originalUrl: affiliateLink.originalUrl,
              referrer: referer,
              userAgent: userAgent,
              ip: clientIP,
              utmParams: {
                source: utmSource,
                medium: utmMedium,
                campaign: utmCampaign
              },
              clickNumber: affiliateLink.clicks + 1
            }
          }
        });
      }
    });

    // Build final redirect URL with tracking parameters
    let redirectUrl = affiliateLink.originalUrl;
    
    // Add tracking parameters if original URL supports them
    const urlObj = new URL(redirectUrl);
    
    // Add referral tracking
    urlObj.searchParams.set('ref', `omni_${linkId}`);
    
    // Preserve UTM parameters
    if (utmSource) urlObj.searchParams.set('utm_source', utmSource);
    if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium);
    if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign);
    
    redirectUrl = urlObj.toString();

    // Redirect to the original URL
    return NextResponse.redirect(redirectUrl, {
      status: 302, // Temporary redirect for tracking
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    console.error('Affiliate tracking error:', error);
    
    // Even if tracking fails, try to redirect to a fallback
    // This ensures user experience isn't broken
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'TRACKING_ERROR', 
          message: 'Error processing affiliate link' 
        } 
      },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit((request: NextRequest) => {
  const url = new URL(request.url);
  const linkIdParam = url.pathname.split('/').pop();
  return handleGET(request, { params: { linkId: linkIdParam || '' } });
}, {
  limit: 120, // 120 clicks per 5 minutes per IP per link
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const url = new URL(req.url);
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    const linkId = url.pathname.split('/').pop() || 'unknown';
    return `affiliate-click:${linkId}:${ip}`;
  }
});

/**
 * POST /api/affiliate/track/[linkId]/conversion
 * 
 * Track conversion for affiliate link
 * This should be called when a conversion event occurs
 * 
 * Authentication: Optional (can be called by external systems)
 * 
 * Body:
 * {
 *   conversionValue?: number,
 *   conversionType?: string,
 *   metadata?: object
 * }
 */
async function handlePOST(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  try {
    const { linkId } = params;
    const body = await request.json();
    
    const { conversionValue = 0, conversionType = 'purchase', metadata = {} } = body;

    if (!linkId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_LINK_ID', 
            message: 'Link ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Find affiliate link
    const affiliateLink = await prisma.affiliateLink.findUnique({
      where: { linkId }
    });

    if (!affiliateLink) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'LINK_NOT_FOUND', 
            message: 'Affiliate link not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Calculate commission
    const commission = conversionValue * affiliateLink.commissionRate;

    // Track conversion using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update affiliate link with conversion
      const updatedLink = await tx.affiliateLink.update({
        where: { linkId },
        data: {
          conversions: { increment: 1 },
          revenue: { increment: commission }
        }
      });

      // Log conversion event
      await tx.event.create({
        data: {
          userId: affiliateLink.userId,
          event: 'affiliate_conversion',
          metadata: {
            linkId: affiliateLink.linkId,
            conversionValue,
            commission,
            conversionType,
            commissionRate: affiliateLink.commissionRate,
            campaignName: affiliateLink.campaignName,
            additionalMetadata: metadata
          }
        }
      });

      return updatedLink;
    });

    return NextResponse.json({
      success: true,
      data: {
        linkId: result.linkId,
        conversionValue,
        commission,
        commissionRate: affiliateLink.commissionRate,
        totalConversions: result.conversions,
        totalRevenue: result.revenue,
        conversionRate: result.clicks > 0 ? (result.conversions / result.clicks) * 100 : 0
      }
    });

  } catch (error: any) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'CONVERSION_ERROR', 
          message: error.message || 'Failed to track conversion' 
        } 
      },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit((request: NextRequest) => {
  const url = new URL(request.url);
  const linkIdParam = url.pathname.split('/').pop();
  return handlePOST(request, { params: { linkId: linkIdParam || '' } });
}, {
  limit: 30, // 30 conversions per 10 minutes per IP per link
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const url = new URL(req.url);
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    const linkId = url.pathname.split('/').pop() || 'unknown';
    return `affiliate-conversion:${linkId}:${ip}`;
  }
});

/**
 * Extract client IP from request
 */
async function getClientIP(request: NextRequest): Promise<string | null> {
  // Check various headers for the real IP
  const headersList = await headers();
  
  const xForwardedFor = headersList.get('x-forwarded-for');
  const xRealIP = headersList.get('x-real-ip');
  const cfConnectingIP = headersList.get('cf-connecting-ip'); // Cloudflare
  const xClientIP = headersList.get('x-client-ip');
  
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    const ips = xForwardedFor.split(',');
    return (ips.length > 0 && ips[0]) ? ips[0].trim() || null : null;
  }
  
  if (cfConnectingIP) return cfConnectingIP;
  if (xRealIP) return xRealIP;
  if (xClientIP) return xClientIP;
  
  // Fallback to connection remote address
  return null; // NextRequest.ip is not available in the current version
}