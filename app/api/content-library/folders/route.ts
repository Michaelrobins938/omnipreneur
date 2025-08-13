import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const getHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    const folders = await prisma.contentFolder.findMany({
      where: {
        userId: user.userId
      },
      include: {
        _count: {
          select: {
            content: {
              where: {
                isArchived: false
              }
            }
          }
        },
        children: {
          include: {
            _count: {
              select: {
                content: {
                  where: {
                    isArchived: false
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: folders
    });

  } catch (error: any) {
    console.error('Folders fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FOLDERS_ERROR', 
          message: 'Failed to fetch folders' 
        } 
      },
      { status: 500 }
    );
  }
};

const CreateFolderSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().optional(),
  parentId: z.string().optional()
});

const postHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();

    const { name, color, parentId } = CreateFolderSchema.parse(body);

    // Check if folder name already exists for this user
    const existingFolder = await prisma.contentFolder.findFirst({
      where: {
        userId: user.userId,
        name,
        parentId: parentId || null
      }
    });

    if (existingFolder) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'FOLDER_EXISTS', 
            message: 'A folder with this name already exists' 
          } 
        },
        { status: 409 }
      );
    }

    // If parentId is provided, check if parent folder exists and belongs to user
    if (parentId) {
      const parentFolder = await prisma.contentFolder.findFirst({
        where: {
          id: parentId,
          userId: user.userId
        }
      });

      if (!parentFolder) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'PARENT_NOT_FOUND', 
              message: 'Parent folder not found' 
            } 
          },
          { status: 404 }
        );
      }
    }

    // Create folder
    const folder = await prisma.contentFolder.create({
      data: {
        userId: user.userId,
        name,
        color: color || '#3B82F6', // Default blue color
        parentId: parentId || null
      },
      include: {
        _count: {
          select: {
            content: true
          }
        }
      }
    });

    // Log folder creation
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'FOLDER_CREATED',
        metadata: {
          folderId: folder.id,
          folderName: folder.name,
          parentId: parentId || null,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: folder
    });

  } catch (error: any) {
    console.error('Folder creation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid folder data',
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
          code: 'FOLDER_CREATE_ERROR', 
          message: 'Failed to create folder' 
        } 
      },
      { status: 500 }
    );
  }
};

export const GET = requireAuth(withRateLimit(getHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 requests per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `content-folders:${userId}:${ip}`;
  }
}));

export const POST = requireAuth(withCsrfProtection(withRateLimit(postHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 folder creations per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `folder-create:${userId}:${ip}`;
  }
})));