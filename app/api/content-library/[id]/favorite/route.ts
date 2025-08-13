import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';

/**
 * POST /api/content-library/[id]/favorite
 * 
 * Toggle favorite status of a content item
 */
export const POST = requireAuth(withCsrfProtection(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { id } = (request as any).params;

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

    // Toggle favorite status
    const updatedItem = await prisma.contentLibraryItem.update({
      where: { id },
      data: {
        isFavorited: !contentItem.isFavorited,
        updatedAt: new Date()
      }
    });

    // Log the action
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: updatedItem.isFavorited ? 'CONTENT_FAVORITED' : 'CONTENT_UNFAVORITED',
        metadata: {
          contentId: id,
          contentType: contentItem.contentType,
          title: contentItem.title,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        isFavorited: updatedItem.isFavorited
      }
    });

  } catch (error: any) {
    console.error('Content favorite error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FAVORITE_ERROR', 
          message: 'Failed to toggle favorite status' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 favorites per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `content-favorite:${userId}:${ip}`;
  }
})));