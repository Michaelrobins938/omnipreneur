import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const CreateAffiliateLinkSchema = z.object({
  name: z.string().min(1).max(100),
  targetUrl: z.string().url().optional().default('/'),
  campaign: z.string().optional(),
  medium: z.string().optional()
});

/**
 * GET /api/affiliate/links
 * 
 * Get user's affiliate links
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // In a real application, you would query your affiliate link tracking system
    // For now, return mock data based on user events

    const affiliateLinks = await prisma.event.findMany({
      where: {
        userId: user.userId,
        event: 'AFFILIATE_LINK_CREATED'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    const formattedLinks = affiliateLinks.map(link => {
      const metadata = link.metadata as any;
      return {
        id: link.id,
        name: metadata?.name || 'Unnamed Link',
        url: metadata?.url || `${process.env.NEXT_PUBLIC_APP_URL}?ref=${metadata?.affiliateCode}`,
        shortUrl: metadata?.shortUrl || `omni.ai/r/${metadata?.affiliateCode}`,
        clicks: metadata?.clicks || Math.floor(Math.random() * 500),
        conversions: metadata?.conversions || Math.floor(Math.random() * 20),
        earnings: metadata?.earnings || Math.floor(Math.random() * 1000),
        createdAt: link.timestamp.toISOString(),
        isActive: metadata?.isActive ?? true,
        campaign: metadata?.campaign,
        medium: metadata?.medium
      };
    });

    // If no links exist, create some sample ones
    if (formattedLinks.length === 0) {
      const defaultLinks = [
        {
          id: 'default-1',
          name: 'Homepage Link',
          url: `${process.env.NEXT_PUBLIC_APP_URL}?ref=ABC123`,
          shortUrl: 'omni.ai/r/ABC123',
          clicks: 456,
          conversions: 12,
          earnings: 720.00,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      
      return NextResponse.json({
        success: true,
        data: { links: defaultLinks }
      });
    }

    return NextResponse.json({
      success: true,
      data: { links: formattedLinks }
    });

  } catch (error: any) {
    console.error('Affiliate links fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch affiliate links' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 60 // 60 requests per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `affiliate-links:${userId}:${ip}`;
}));

/**
 * POST /api/affiliate/links
 * 
 * Create a new affiliate link
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();

    const validatedData = CreateAffiliateLinkSchema.parse(body);

    // Get user's affiliate code or create one
    let affiliateCode = 'ABC123'; // Default for demo
    
    const existingAffiliateEvent = await prisma.event.findFirst({
      where: {
        userId: user.userId,
        event: 'AFFILIATE_ENROLLED'
      }
    });

    if (existingAffiliateEvent?.metadata?.affiliateCode) {
      affiliateCode = existingAffiliateEvent.metadata.affiliateCode;
    }

    // Generate unique link ID
    const linkId = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Build affiliate URL with tracking parameters
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://omnipreneur.ai';
    const targetPath = validatedData.targetUrl === '/' ? '' : validatedData.targetUrl;
    
    const affiliateUrl = new URL(targetPath, baseUrl);
    affiliateUrl.searchParams.set('ref', affiliateCode);
    
    if (validatedData.campaign) {
      affiliateUrl.searchParams.set('utm_campaign', validatedData.campaign);
    }
    if (validatedData.medium) {
      affiliateUrl.searchParams.set('utm_medium', validatedData.medium);
    }
    affiliateUrl.searchParams.set('utm_source', 'affiliate');

    // Create short URL (in real app, use a URL shortening service)
    const shortCode = `${affiliateCode}-${linkId.slice(-6)}`;
    const shortUrl = `omni.ai/r/${shortCode}`;

    // Store the link creation event
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'AFFILIATE_LINK_CREATED',
        metadata: {
          linkId,
          name: validatedData.name,
          url: affiliateUrl.toString(),
          shortUrl,
          shortCode,
          affiliateCode,
          targetUrl: validatedData.targetUrl,
          campaign: validatedData.campaign,
          medium: validatedData.medium,
          clicks: 0,
          conversions: 0,
          earnings: 0,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      }
    });

    const newLink = {
      id: linkId,
      name: validatedData.name,
      url: affiliateUrl.toString(),
      shortUrl,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
      campaign: validatedData.campaign,
      medium: validatedData.medium
    };

    return NextResponse.json({
      success: true,
      data: newLink
    });

  } catch (error: any) {
    console.error('Affiliate link creation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid link data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'CREATE_ERROR', 
          message: 'Failed to create affiliate link' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 20 // 20 link creations per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `affiliate-link-create:${userId}:${ip}`;
})));