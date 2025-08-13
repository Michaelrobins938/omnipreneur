import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

/**
 * GET /api/content-library/[id]
 * 
 * Get a specific content library item
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop() || '';

    const contentItem = await prisma.contentLibraryItem.findFirst({
      where: {
        id,
        userId: user.userId
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
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

    return NextResponse.json({
      success: true,
      data: contentItem
    });

  } catch (error: any) {
    console.error('Content item fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch content item' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 requests per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `content-item-get:${userId}:${ip}`;
  }
}));

/**
 * PUT /api/content-library/[id]
 * 
 * Update a content library item
 */
export const PUT = requireAuth(withCsrfProtection(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop() || '';
    const body = await request.json();

    const UpdateSchema = z.object({
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      tags: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional(),
      targetAudience: z.string().optional(),
      niche: z.string().optional(),
      folderId: z.string().optional(),
      userRating: z.number().min(1).max(5).optional()
    });

    const validatedData = UpdateSchema.parse(body);

    // Check if content item exists and belongs to user
    const existingItem = await prisma.contentLibraryItem.findFirst({
      where: {
        id,
        userId: user.userId
      }
    });

    if (!existingItem) {
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

    // Update content item
    const updatedItem = await prisma.contentLibraryItem.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    });

    // Log the update
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'CONTENT_UPDATED',
        metadata: {
          contentId: id,
          updatedFields: Object.keys(validatedData),
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedItem
    });

  } catch (error: any) {
    console.error('Content item update error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
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
          code: 'UPDATE_ERROR', 
          message: 'Failed to update content item' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 updates per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `content-item-update:${userId}:${ip}`;
  }
})));

/**
 * DELETE /api/content-library/[id]
 * 
 * Delete a content library item
 */
export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop() || '';

    // Check if content item exists and belongs to user
    const existingItem = await prisma.contentLibraryItem.findFirst({
      where: {
        id,
        userId: user.userId
      }
    });

    if (!existingItem) {
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

    // Delete content item
    await prisma.contentLibraryItem.delete({
      where: { id }
    });

    // Log the deletion
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'CONTENT_DELETED',
        metadata: {
          contentId: id,
          title: existingItem.title,
          contentType: existingItem.contentType,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Content item deleted successfully'
    });

  } catch (error: any) {
    console.error('Content item deletion error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: 'Failed to delete content item' 
        } 
      },
      { status: 500 }
    );
  }
});