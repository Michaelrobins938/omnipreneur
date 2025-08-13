import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const getHandler = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id } = params;

    const folder = await prisma.contentFolder.findFirst({
      where: {
        id,
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
      }
    });

    if (!folder) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'FOLDER_NOT_FOUND', 
            message: 'Folder not found' 
          } 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: folder
    });

  } catch (error: any) {
    console.error('Folder fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch folder' 
        } 
      },
      { status: 500 }
    );
  }
};

const UpdateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().optional(),
  parentId: z.string().optional()
});

const putHandler = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id } = params;
    const body = await request.json();

    const validatedData = UpdateFolderSchema.parse(body);

    // Check if folder exists and belongs to user
    const existingFolder = await prisma.contentFolder.findFirst({
      where: {
        id,
        userId: user.userId
      }
    });

    if (!existingFolder) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'FOLDER_NOT_FOUND', 
            message: 'Folder not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Check if new name conflicts with existing folder in same parent
    if (validatedData.name && validatedData.name !== existingFolder.name) {
      const nameConflict = await prisma.contentFolder.findFirst({
        where: {
          userId: user.userId,
          name: validatedData.name,
          parentId: validatedData.parentId !== undefined ? validatedData.parentId : existingFolder.parentId,
          id: { not: id }
        }
      });

      if (nameConflict) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'NAME_CONFLICT', 
              message: 'A folder with this name already exists in the target location' 
            } 
          },
          { status: 409 }
        );
      }
    }

    // If parentId is provided, check if parent folder exists and belongs to user
    // Also prevent circular references
    if (validatedData.parentId) {
      if (validatedData.parentId === id) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'CIRCULAR_REFERENCE', 
              message: 'A folder cannot be its own parent' 
            } 
          },
          { status: 400 }
        );
      }

      const parentFolder = await prisma.contentFolder.findFirst({
        where: {
          id: validatedData.parentId,
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

      // Check for circular reference by checking if new parent is a descendant
      const isDescendant = await checkIfDescendant(validatedData.parentId, id);
      if (isDescendant) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'CIRCULAR_REFERENCE', 
              message: 'Cannot move folder to its own descendant' 
            } 
          },
          { status: 400 }
        );
      }
    }

    // Update folder
    const updatedFolder = await prisma.contentFolder.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.color && { color: validatedData.color }),
        ...(validatedData.parentId !== undefined && { parentId: validatedData.parentId || null })
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
        }
      }
    });

    // Log the update
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'FOLDER_UPDATED',
        metadata: {
          folderId: id,
          folderName: updatedFolder.name,
          updatedFields: Object.keys(validatedData),
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedFolder
    });

  } catch (error: any) {
    console.error('Folder update error:', error);
    
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
          code: 'UPDATE_ERROR', 
          message: 'Failed to update folder' 
        } 
      },
      { status: 500 }
    );
  }
};

const deleteHandler = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const moveToParent = searchParams.get('moveToParent') === 'true';

    // Check if folder exists and belongs to user
    const existingFolder = await prisma.contentFolder.findFirst({
      where: {
        id,
        userId: user.userId
      },
      include: {
        content: true,
        children: true
      }
    });

    if (!existingFolder) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'FOLDER_NOT_FOUND', 
            message: 'Folder not found' 
          } 
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      if (moveToParent) {
        // Move content items to parent folder
        await tx.contentLibraryItem.updateMany({
          where: { folderId: id },
          data: { folderId: existingFolder.parentId }
        });

        // Move child folders to parent folder
        await tx.contentFolder.updateMany({
          where: { parentId: id },
          data: { parentId: existingFolder.parentId }
        });
      } else {
        // Set content items to no folder
        await tx.contentLibraryItem.updateMany({
          where: { folderId: id },
          data: { folderId: null }
        });

        // Move child folders to root level
        await tx.contentFolder.updateMany({
          where: { parentId: id },
          data: { parentId: null }
        });
      }

      // Delete the folder
      await tx.contentFolder.delete({
        where: { id }
      });
    });

    // Log the deletion
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'FOLDER_DELETED',
        metadata: {
          folderId: id,
          folderName: existingFolder.name,
          contentCount: existingFolder.content.length,
          childFolderCount: existingFolder.children.length,
          moveToParent,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Folder deleted successfully'
    });

  } catch (error: any) {
    console.error('Folder deletion error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: 'Failed to delete folder' 
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
    return `folder-get:${userId}:${ip}`;
  }
}));

export const PUT = requireAuth(withCsrfProtection(withRateLimit(putHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 updates per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `folder-update:${userId}:${ip}`;
  }
})));

export const DELETE = requireAuth(deleteHandler as any);

async function checkIfDescendant(potentialAncestorId: string, folderId: string): Promise<boolean> {
  const folder = await prisma.contentFolder.findUnique({
    where: { id: potentialAncestorId },
    select: { parentId: true }
  });

  if (!folder || !folder.parentId) {
    return false;
  }

  if (folder.parentId === folderId) {
    return true;
  }

  return checkIfDescendant(folder.parentId, folderId);
}