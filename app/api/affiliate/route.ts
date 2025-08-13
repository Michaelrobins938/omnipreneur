// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

// Types
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

const prisma = new PrismaClient();

// Query validation schema
const AffiliateQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100).default('20'),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'clicks', 'conversions', 'revenue', 'campaignName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['active', 'expired', 'limited', 'all']).default('all')
});

/**
 * GET /api/affiliate
 * 
 * List user's affiliate links with pagination and filtering
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20, max: 100)
 * - search?: string (searches in campaign name and original URL)
 * - sortBy?: 'createdAt' | 'clicks' | 'conversions' | 'revenue' | 'campaignName' (default: 'createdAt')
 * - sortOrder?: 'asc' | 'desc' (default: 'desc')
 * - status?: 'active' | 'expired' | 'limited' | 'all' (default: 'all')
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    const { searchParams } = new URL(request.url);
    
    // Extract and validate query parameters
    const queryData = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      status: searchParams.get('status') || 'all'
    };

    const validatedQuery = AffiliateQuerySchema.parse(queryData);
    const { page, limit, search, sortBy, sortOrder, status } = validatedQuery;

    // Build where clause
    const whereClause: { userId: string; [key: string]: any } = { userId: user.userId };
    
    if (search) {
      whereClause['OR'] = [
        { campaignName: { contains: search, mode: 'insensitive' } },
        { originalUrl: { contains: search, mode: 'insensitive' } },
        { linkId: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get all links for status filtering
    let allLinks: any[] = [];
    if (status !== 'all') {
      allLinks = await prisma.affiliateLink.findMany({
        where: whereClause,
        select: {
          id: true,
          linkId: true,
          optimizationData: true,
          clicks: true,
          createdAt: true
        }
      });
    }

    // Apply status filter
    if (status !== 'all') {
      const now = new Date();
      const filteredIds = allLinks.filter(link => {
        const optimizationData = link.optimizationData as any;
        
        switch (status) {
          case 'expired':
            return optimizationData?.expiryDate && new Date(optimizationData.expiryDate) < now;
          case 'limited':
            return optimizationData?.clickLimit && link.clicks >= optimizationData.clickLimit;
          case 'active':
            return (!optimizationData?.expiryDate || new Date(optimizationData.expiryDate) >= now) &&
                   (!optimizationData?.clickLimit || link.clicks < optimizationData.clickLimit);
          default:
            return true;
        }
      }).map(link => link.id);

      whereClause['id'] = { in: filteredIds };
    }

    // Get total count for pagination
    const totalCount = await prisma.affiliateLink.count({
      where: whereClause
    });

    // Get paginated results
    const affiliateLinks = await prisma.affiliateLink.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
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
        optimizationData: true,
        createdAt: true
      }
    });

    // Enhance results with computed fields
    const enhancedResults = affiliateLinks.map(link => {
      const optimizationData = link.optimizationData as any;
      const conversionRate = link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0;
      const averageCommission = link.conversions > 0 ? link.revenue / link.conversions : 0;
      
      // Determine status
      const now = new Date();
      let linkStatus = 'active';
      if (optimizationData?.expiryDate && new Date(optimizationData.expiryDate) < now) {
        linkStatus = 'expired';
      } else if (optimizationData?.clickLimit && link.clicks >= optimizationData.clickLimit) {
        linkStatus = 'limited';
      }

      return {
        ...link,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageCommission: Math.round(averageCommission * 100) / 100,
        status: linkStatus,
        performance: getPerformanceRating(conversionRate, link.clicks),
        daysActive: Math.ceil((now.getTime() - link.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        clicksPerDay: link.clicks > 0 ? 
          link.clicks / Math.max(1, Math.ceil((now.getTime() - link.createdAt.getTime()) / (1000 * 60 * 60 * 24))) 
          : 0
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Calculate summary statistics
    const summary = {
      totalLinks: totalCount,
      totalClicks: enhancedResults.reduce((sum, link) => sum + link.clicks, 0),
      totalConversions: enhancedResults.reduce((sum, link) => sum + link.conversions, 0),
      totalRevenue: enhancedResults.reduce((sum, link) => sum + link.revenue, 0),
      averageConversionRate: enhancedResults.length > 0 ? 
        enhancedResults.reduce((sum, link) => sum + link.conversionRate, 0) / enhancedResults.length : 0,
      topPerformer: enhancedResults.sort((a, b) => b.revenue - a.revenue)[0]?.linkId || null,
      statusBreakdown: await getStatusBreakdown(user.userId)
    };

    return NextResponse.json({
      success: true,
      data: enhancedResults,
      meta: {
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasNextPage,
          hasPreviousPage
        },
        filters: {
          search,
          sortBy,
          sortOrder,
          status
        },
        summary
      }
    });

  } catch (error: unknown) {
    console.error('Affiliate links listing error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid query parameters',
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
          code: 'LISTING_ERROR', 
          message: 'Failed to retrieve affiliate links' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/affiliate
 * 
 * Bulk delete affiliate links
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   linkIds: string[]
 * }
 */
export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    const { linkIds } = await request.json();

    if (!Array.isArray(linkIds) || linkIds.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_INPUT', 
            message: 'linkIds must be a non-empty array' 
          } 
        },
        { status: 400 }
      );
    }

    // Verify all links belong to the user
    const userLinkCount = await prisma.affiliateLink.count({
      where: {
        linkId: { in: linkIds },
        userId: user.userId
      }
    });

    if (userLinkCount !== linkIds.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED_DELETE', 
            message: 'Some affiliate links do not belong to the user' 
          } 
        },
        { status: 403 }
      );
    }

    // Get link details before deletion for audit
    const linksToDelete = await prisma.affiliateLink.findMany({
      where: {
        linkId: { in: linkIds },
        userId: user.userId
      },
      select: {
        id: true,
        linkId: true,
        campaignName: true,
        clicks: true,
        conversions: true,
        revenue: true
      }
    });

    // Delete links and related data using transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete click tracking records
      await tx.clickTracking.deleteMany({
        where: { linkId: { in: linkIds } }
      });

      // Delete affiliate links
      const deletedLinks = await tx.affiliateLink.deleteMany({
        where: {
          linkId: { in: linkIds },
          userId: user.userId
        }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: user.userId },
        data: {
          affiliateLinks: { decrement: deletedLinks.count }
        }
      });

      // Log deletion event
      await tx.event.create({
        data: {
          userId: user.userId,
          event: 'affiliate_links_deleted',
          metadata: {
            deletedCount: deletedLinks.count,
            linkIds: linkIds,
            linkDetails: linksToDelete,
            totalClicks: linksToDelete.reduce((sum, link) => sum + link.clicks, 0),
            totalRevenue: linksToDelete.reduce((sum, link) => sum + link.revenue, 0)
          }
        }
      });

      return { deletedCount: deletedLinks.count };
    });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        deletedIds: linkIds,
        deletedLinks: linksToDelete
      }
    });

  } catch (error: unknown) {
    console.error('Bulk delete affiliate links error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: (error as Error).message || 'Failed to delete affiliate links' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * Helper functions
 */

function getPerformanceRating(conversionRate: number, clicks: number): 'excellent' | 'good' | 'average' | 'poor' | 'new' {
  if (clicks < 10) return 'new';
  if (conversionRate >= 5) return 'excellent';
  if (conversionRate >= 2) return 'good';
  if (conversionRate >= 0.5) return 'average';
  return 'poor';
}

async function getStatusBreakdown(userId: string) {
  const allLinks = await prisma.affiliateLink.findMany({
    where: { userId },
    select: {
      optimizationData: true,
      clicks: true,
      createdAt: true
    }
  });

  const now = new Date();
  const breakdown = {
    active: 0,
    expired: 0,
    limited: 0,
    new: 0 // Less than 7 days old
  };

  allLinks.forEach(link => {
    const optimizationData = link.optimizationData as any;
    const daysOld = (now.getTime() - link.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysOld < 7) {
      breakdown.new++;
    } else if (optimizationData?.expiryDate && new Date(optimizationData.expiryDate) < now) {
      breakdown.expired++;
    } else if (optimizationData?.clickLimit && link.clicks >= optimizationData.clickLimit) {
      breakdown.limited++;
    } else {
      breakdown.active++;
    }
  });

  return breakdown;
}