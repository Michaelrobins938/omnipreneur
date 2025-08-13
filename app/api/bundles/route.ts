// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

// Query validation schema
const BundleQuerySchema = z.object({
  page: z.string().default('1').transform(val => parseInt(val, 10)).refine(val => val > 0),
  limit: z.string().default('10').transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 50),
  bundleType: z.enum(['COURSE', 'TEMPLATE', 'TOOLKIT', 'MASTERCLASS', 'SOFTWARE']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'name', 'price', 'bundleType']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

/**
 * GET /api/bundles
 * 
 * List user's bundles with pagination and filtering
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 10, max: 50)
 * - bundleType?: 'COURSE' | 'TEMPLATE' | 'TOOLKIT' | 'MASTERCLASS' | 'SOFTWARE'
 * - search?: string (searches in name and description)
 * - sortBy?: 'createdAt' | 'name' | 'price' | 'bundleType' (default: 'createdAt')
 * - sortOrder?: 'asc' | 'desc' (default: 'desc')
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    // Extract and validate query parameters
    const queryData = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      bundleType: searchParams.get('bundleType'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    };

    const validatedQuery = BundleQuerySchema.parse(queryData);
    const { page, limit, bundleType, search, sortBy, sortOrder } = validatedQuery;

    // Build where clause
    const whereClause: any = { userId: user.userId };
    
    if (bundleType) {
      whereClause.bundleType = bundleType;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { targetAudience: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.bundle.count({
      where: whereClause
    });

    // Get paginated results
    const bundles = await prisma.bundle.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        bundleType: true,
        targetAudience: true,
        description: true,
        products: true,
        createdAt: true,
        bundleData: true
      }
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: bundles,
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
          bundleType,
          search,
          sortBy,
          sortOrder
        },
        summary: {
          totalBundles: totalCount,
          totalValue: bundles.reduce((sum, bundle) => sum + bundle.price, 0),
          averagePrice: totalCount > 0 ? bundles.reduce((sum, bundle) => sum + bundle.price, 0) / totalCount : 0,
          bundleTypes: await getBundleTypesSummary(user.userId)
        }
      }
    });

  } catch (error: any) {
    console.error('Bundles listing error:', error);

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
          message: 'Failed to retrieve bundles' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/bundles
 * 
 * Bulk delete bundles
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   bundleIds: string[]
 * }
 */
export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { bundleIds } = await request.json();

    if (!Array.isArray(bundleIds) || bundleIds.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_INPUT', 
            message: 'bundleIds must be a non-empty array' 
          } 
        },
        { status: 400 }
      );
    }

    // Verify all bundles belong to the user
    const userBundleCount = await prisma.bundle.count({
      where: {
        id: { in: bundleIds },
        userId: user.userId
      }
    });

    if (userBundleCount !== bundleIds.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED_DELETE', 
            message: 'Some bundles do not belong to the user' 
          } 
        },
        { status: 403 }
      );
    }

    // Get bundle details before deletion for audit
    const bundlesToDelete = await prisma.bundle.findMany({
      where: {
        id: { in: bundleIds },
        userId: user.userId
      },
      select: {
        id: true,
        name: true,
        bundleType: true,
        price: true
      }
    });

    // Delete bundles and update usage counter
    const result = await prisma.$transaction(async (tx) => {
      // Delete bundles
      const deletedBundles = await tx.bundle.deleteMany({
        where: {
          id: { in: bundleIds },
          userId: user.userId
        }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: user.userId },
        data: {
          bundles: { decrement: deletedBundles.count }
        }
      });

      // Log deletion event
      await tx.event.create({
        data: {
          userId: user.userId,
          event: 'bundles_deleted',
          metadata: {
            deletedCount: deletedBundles.count,
            bundleIds: bundleIds,
            bundleDetails: bundlesToDelete,
            totalValue: bundlesToDelete.reduce((sum, bundle) => sum + bundle.price, 0)
          }
        }
      });

      return { deletedCount: deletedBundles.count };
    });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        deletedIds: bundleIds,
        deletedBundles: bundlesToDelete
      }
    });

  } catch (error: any) {
    console.error('Bulk delete bundles error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: error.message || 'Failed to delete bundles' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * Get bundle types summary for the user
 */
async function getBundleTypesSummary(userId: string) {
  const bundleTypes = await prisma.bundle.groupBy({
    by: ['bundleType'],
    where: { userId },
    _count: {
      bundleType: true
    },
    _avg: {
      price: true
    }
  });

  return bundleTypes.reduce((acc, item) => {
    acc[item.bundleType] = {
      count: item._count.bundleType,
      averagePrice: Math.round(item._avg.price || 0)
    };
    return acc;
  }, {} as Record<string, { count: number; averagePrice: number }>);
}