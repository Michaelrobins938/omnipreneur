import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const ActionSchema = z.object({
  action: z.enum(['view', 'copy', 'share', 'download'])
});

const postHandler = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id } = params;
    const body = await request.json();

    const { action } = ActionSchema.parse(body);

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

    // Update counters based on action
    const updateData: any = {
      lastAccessedAt: new Date()
    };

    switch (action) {
      case 'view':
        updateData.viewCount = { increment: 1 };
        break;
      case 'copy':
        updateData.copyCount = { increment: 1 };
        break;
      case 'share':
        updateData.shareCount = { increment: 1 };
        break;
      case 'download':
        // For future use when download functionality is implemented
        break;
    }

    // Update content item
    const updatedItem = await prisma.contentLibraryItem.update({
      where: { id },
      data: updateData
    });

    // Log the action for analytics
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: `CONTENT_${action.toUpperCase()}`,
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
        action,
        newCount: action === 'view' ? updatedItem.viewCount :
                  action === 'copy' ? updatedItem.copyCount :
                  action === 'share' ? updatedItem.shareCount : 0
      }
    });

  } catch (error: any) {
    console.error('Content action error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid action',
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
          code: 'ACTION_ERROR', 
          message: 'Failed to track action' 
        } 
      },
      { status: 500 }
    );
  }
};

export const POST = requireAuth(withCsrfProtection(withRateLimit(postHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 50, // 50 actions per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `content-action:${userId}:${ip}`;
  }
})));