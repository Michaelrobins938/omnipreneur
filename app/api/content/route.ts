// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

// Query validation schema
const ContentQuerySchema = z.object({
  page: z.string().default('1').transform(val => parseInt(val, 10)).refine(val => val > 0),
  limit: z.string().default('20').transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100),
  contentType: z.enum(['SOCIAL', 'BLOG', 'EMAIL', 'VIDEO', 'MIXED']).optional(),
  niche: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'contentType', 'niche']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

/**
 * GET /api/content
 * 
 * List user's generated content with pagination and filtering
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20, max: 100)
 * - contentType?: 'SOCIAL' | 'BLOG' | 'EMAIL' | 'VIDEO' | 'MIXED'
 * - niche?: string
 * - search?: string (searches in content and keywords)
 * - sortBy?: 'createdAt' | 'contentType' | 'niche' (default: 'createdAt')
 * - sortOrder?: 'asc' | 'desc' (default: 'desc')
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    // Extract and validate query parameters
    const queryData = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      contentType: searchParams.get('contentType'),
      niche: searchParams.get('niche'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    };

    const validatedQuery = ContentQuerySchema.parse(queryData);
    const { page, limit, contentType, niche, search, sortBy, sortOrder } = validatedQuery;

    // Build where clause
    const whereClause: any = { userId: user.userId };
    
    if (contentType) {
      whereClause.contentType = contentType;
    }
    
    if (niche) {
      whereClause.niche = { contains: niche, mode: 'insensitive' };
    }
    
    if (search) {
      whereClause.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { keywords: { hasSome: [search] } },
        { niche: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.contentPiece.count({
      where: whereClause
    });

    // Get paginated results
    const contentPieces = await prisma.contentPiece.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        niche: true,
        contentType: true,
        tone: true,
        content: true,
        keywords: true,
        targetAudience: true,
        createdAt: true
      }
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: contentPieces,
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
          contentType,
          niche,
          search,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error: any) {
    console.error('Content listing error:', error);

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
          message: 'Failed to retrieve content' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/content
 * 
 * Bulk delete content pieces
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   contentIds: string[]
 * }
 */
export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { contentIds } = await request.json();

    if (!Array.isArray(contentIds) || contentIds.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_INPUT', 
            message: 'contentIds must be a non-empty array' 
          } 
        },
        { status: 400 }
      );
    }

    // Verify all content pieces belong to the user
    const userContentCount = await prisma.contentPiece.count({
      where: {
        id: { in: contentIds },
        userId: user.userId
      }
    });

    if (userContentCount !== contentIds.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED_DELETE', 
            message: 'Some content pieces do not belong to the user' 
          } 
        },
        { status: 403 }
      );
    }

    // Delete content pieces and update usage counter
    const result = await prisma.$transaction(async (tx) => {
      // Delete content pieces
      const deletedContent = await tx.contentPiece.deleteMany({
        where: {
          id: { in: contentIds },
          userId: user.userId
        }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: user.userId },
        data: {
          contentPieces: { decrement: deletedContent.count }
        }
      });

      // Log deletion event
      await tx.event.create({
        data: {
          userId: user.userId,
          event: 'content_deleted',
          metadata: {
            deletedCount: deletedContent.count,
            contentIds: contentIds,
            batchDelete: true
          }
        }
      });

      return { deletedCount: deletedContent.count };
    });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        deletedIds: contentIds
      }
    });

  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: error.message || 'Failed to delete content' 
        } 
      },
      { status: 500 }
    );
  }
});