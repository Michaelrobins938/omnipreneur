// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { withCsrfProtection } from '@/lib/security/csrf';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

// Update validation schema
const UpdateContentSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  tone: z.string().min(1).max(50).optional(),
  keywords: z.array(z.string()).max(10).optional(),
  targetAudience: z.string().max(200).optional()
});

/**
 * GET /api/content/[id]
 * 
 * Get specific content piece by ID
 * 
 * Authentication: Required
 * Authorization: Content must belong to authenticated user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Content ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Get content piece with ownership verification
    const contentPiece = await prisma.contentPiece.findUnique({
      where: { 
        id,
        userId: authResult.userId // Ensure user owns the content
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!contentPiece) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CONTENT_NOT_FOUND', 
            message: 'Content piece not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Log view event for analytics
    await prisma.event.create({
      data: {
        userId: authResult.userId,
        event: 'content_viewed',
        metadata: {
          contentId: id,
          contentType: contentPiece.contentType,
          niche: contentPiece.niche
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: contentPiece
    });

  } catch (error: any) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to retrieve content' 
        } 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content/[id]
 * 
 * Update specific content piece
 * 
 * Authentication: Required
 * Authorization: Content must belong to authenticated user
 * 
 * Body:
 * {
 *   content?: string,
 *   tone?: string,
 *   keywords?: string[],
 *   targetAudience?: string
 * }
 */
export const PUT = withCsrfProtection(async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Content ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = UpdateContentSchema.parse(body);

    // Verify content exists and user owns it
    const existingContent = await prisma.contentPiece.findUnique({
      where: { 
        id,
        userId: authResult.userId
      }
    });

    if (!existingContent) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CONTENT_NOT_FOUND', 
            message: 'Content piece not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Update content piece
    const updatedContent = await prisma.$transaction(async (tx) => {
      const updated = await tx.contentPiece.update({
        where: { id },
        data: {
          ...validatedData,
          // updatedAt is handled automatically by Prisma
        }
      });

      // Log update event
      await tx.event.create({
        data: {
          userId: authResult.userId,
          event: 'content_updated',
          metadata: {
            contentId: id,
            updatedFields: Object.keys(validatedData),
            contentType: existingContent.contentType,
            niche: existingContent.niche
          }
        }
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      data: updatedContent,
      message: 'Content updated successfully'
    });

  } catch (error: any) {
    console.error('Update content error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
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
          code: 'UPDATE_ERROR', 
          message: error.message || 'Failed to update content' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/content/[id]
 * 
 * Delete specific content piece
 * 
 * Authentication: Required
 * Authorization: Content must belong to authenticated user
 */
export const DELETE = withCsrfProtection(async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Content ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Verify content exists and user owns it
    const existingContent = await prisma.contentPiece.findUnique({
      where: { 
        id,
        userId: authResult.userId
      }
    });

    if (!existingContent) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CONTENT_NOT_FOUND', 
            message: 'Content piece not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Delete content piece and update usage counter
    await prisma.$transaction(async (tx) => {
      // Delete the content piece
      await tx.contentPiece.delete({
        where: { id }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: authResult.userId },
        data: {
          contentPieces: { decrement: 1 }
        }
      });

      // Log deletion event
      await tx.event.create({
        data: {
          userId: authResult.userId,
          event: 'content_deleted',
          metadata: {
            contentId: id,
            contentType: existingContent.contentType,
            niche: existingContent.niche,
            deletedAt: new Date().toISOString()
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        id,
        deleted: true
      },
      message: 'Content deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete content error:', error);
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

/**
 * POST /api/content/[id]/duplicate
 * 
 * Duplicate specific content piece
 * 
 * Authentication: Required
 * Authorization: Content must belong to authenticated user
 */
export const POST = withCsrfProtection(async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'duplicate') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ACTION', 
            message: 'Invalid action. Use ?action=duplicate' 
          } 
        },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Content ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Get original content piece
    const originalContent = await prisma.contentPiece.findUnique({
      where: { 
        id,
        userId: authResult.userId
      }
    });

    if (!originalContent) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CONTENT_NOT_FOUND', 
            message: 'Content piece not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Check usage limits
    const userWithUsage = await prisma.user.findUnique({
      where: { id: authResult.userId },
      include: { 
        usage: true,
        subscription: true
      }
    });

    if (!userWithUsage || !userWithUsage.usage || !userWithUsage.subscription) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USER_DATA_ERROR', 
            message: 'User data not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Usage limits by plan
    const PLAN_LIMITS = {
      FREE: { contentPieces: 10 },
      PRO: { contentPieces: 500 },
      ENTERPRISE: { contentPieces: -1 } // Unlimited
    };

    const currentPlan = userWithUsage.subscription.plan;
    const planLimit = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS];
    
    if (planLimit.contentPieces !== -1 && 
        userWithUsage.usage.contentPieces >= planLimit.contentPieces) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USAGE_LIMIT_EXCEEDED', 
            message: `Content generation limit reached for ${currentPlan} plan` 
          } 
        },
        { status: 402 }
      );
    }

    // Duplicate the content piece
    const duplicatedContent = await prisma.$transaction(async (tx) => {
      const duplicate = await tx.contentPiece.create({
        data: {
          userId: originalContent.userId,
          niche: originalContent.niche,
          contentType: originalContent.contentType,
          tone: originalContent.tone,
          content: `${originalContent.content}\n\n[Duplicated on ${new Date().toLocaleDateString()}]`,
          keywords: originalContent.keywords,
          targetAudience: originalContent.targetAudience
        }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: authResult.userId },
        data: {
          contentPieces: { increment: 1 }
        }
      });

      // Log duplication event
      await tx.event.create({
        data: {
          userId: authResult.userId,
          event: 'content_duplicated',
          metadata: {
            originalContentId: id,
            duplicatedContentId: duplicate.id,
            contentType: originalContent.contentType,
            niche: originalContent.niche
          }
        }
      });

      return duplicate;
    });

    return NextResponse.json({
      success: true,
      data: duplicatedContent,
      message: 'Content duplicated successfully'
    });

  } catch (error: any) {
    console.error('Duplicate content error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DUPLICATE_ERROR', 
          message: error.message || 'Failed to duplicate content' 
        } 
      },
      { status: 500 }
    );
  }
});