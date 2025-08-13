import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const RatingSchema = z.object({
  rating: z.number().min(1).max(5).int()
});

/**
 * POST /api/content-library/[id]/rate
 * 
 * Rate a content item (1-5 stars)
 */
export const POST = requireAuth(withCsrfProtection(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { id } = (request as any).params;
    const body = await request.json();

    const { rating } = RatingSchema.parse(body);

    // Check if content item exists and belongs to user
    const contentItem = await prisma.contentLibraryItem.findFirst({
      where: {
        id,
        userId: user.userId
      }
    });

    if (!contentItem) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CONTENT_NOT_FOUND', 
            message: 'Content item not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Update rating
    const updatedItem = await prisma.contentLibraryItem.update({
      where: { id },
      data: {
        userRating: rating,
        updatedAt: new Date()
      }
    });

    // Log the rating
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'CONTENT_RATED',
        metadata: {
          contentId: id,
          contentType: contentItem.contentType,
          title: contentItem.title,
          rating,
          previousRating: contentItem.userRating,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        rating: updatedItem.userRating
      }
    });

  } catch (error: any) {
    console.error('Content rating error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid rating. Must be between 1 and 5.',
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
          code: 'RATING_ERROR', 
          message: 'Failed to rate content item' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 ratings per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `content-rate:${userId}:${ip}`;
  }
})));