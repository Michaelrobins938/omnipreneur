import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const BulkMoveSchema = z.object({
  contentIds: z.array(z.string()).min(1),
  targetFolderId: z.string().optional() // undefined means move to root (no folder)
});

/**
 * POST /api/content-library/folders/[id]/move
 * 
 * Move multiple content items to a different folder
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id: sourceFolderId } = params;
    const body = await request.json();

    const { contentIds, targetFolderId } = BulkMoveSchema.parse(body);

    // Check if source folder exists and belongs to user (if not moving from root)
    if (sourceFolderId !== 'root') {
      const sourceFolder = await prisma.contentFolder.findFirst({
        where: {
          id: sourceFolderId,
          userId: user.userId
        }
      });

      if (!sourceFolder) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'SOURCE_FOLDER_NOT_FOUND', 
              message: 'Source folder not found' 
            } 
          },
          { status: 404 }
        );
      }
    }

    // Check if target folder exists and belongs to user (if specified)
    if (targetFolderId) {
      const targetFolder = await prisma.contentFolder.findFirst({
        where: {
          id: targetFolderId,
          userId: user.userId
        }
      });

      if (!targetFolder) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'TARGET_FOLDER_NOT_FOUND', 
              message: 'Target folder not found' 
            } 
          },
          { status: 404 }
        );
      }
    }

    // Verify all content items belong to the user and are in the source folder
    const contentItems = await prisma.contentLibraryItem.findMany({
      where: {
        id: { in: contentIds },
        userId: user.userId,
        folderId: sourceFolderId === 'root' ? null : sourceFolderId
      }
    });

    if (contentItems.length !== contentIds.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_CONTENT_ITEMS', 
            message: 'Some content items not found or not accessible' 
          } 
        },
        { status: 400 }
      );
    }

    // Move content items to target folder
    const result = await prisma.contentLibraryItem.updateMany({
      where: {
        id: { in: contentIds },
        userId: user.userId
      },
      data: {
        folderId: targetFolderId || null,
        updatedAt: new Date()
      }
    });

    // Log the bulk move operation
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'CONTENT_BULK_MOVED',
        metadata: {
          sourceFolderId: sourceFolderId === 'root' ? null : sourceFolderId,
          targetFolderId: targetFolderId || null,
          contentIds,
          itemCount: result.count,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        movedCount: result.count,
        sourceFolderId: sourceFolderId === 'root' ? null : sourceFolderId,
        targetFolderId: targetFolderId || null
      }
    });

  } catch (error: any) {
    console.error('Bulk move error:', error);
    
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
          code: 'MOVE_ERROR', 
          message: 'Failed to move content items' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 20 // 20 bulk moves per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `bulk-move:${userId}:${ip}`;
})));