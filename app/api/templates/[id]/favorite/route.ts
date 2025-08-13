import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';

/**
 * POST /api/templates/[id]/favorite
 * 
 * Toggle favorite status of a template
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id } = params;

    // Check if template exists and is accessible
    const template = await prisma.contentLibraryItem.findFirst({
      where: {
        id,
        contentType: 'TEMPLATE',
        OR: [
          { userId: user.userId },
          { 
            AND: [
              { userId: { not: user.userId } },
              { contextData: { path: ['isPublic'], equals: true } }
            ]
          }
        ]
      }
    });

    if (!template) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'TEMPLATE_NOT_FOUND', 
            message: 'Template not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Only allow favorites for templates the user owns or public templates
    if (template.userId !== user.userId && !template.contextData?.isPublic) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'ACCESS_DENIED', 
            message: 'Cannot favorite this template' 
          } 
        },
        { status: 403 }
      );
    }

    // For public templates not owned by user, we need to create a separate favorite record
    // For now, we'll only allow favoriting own templates
    if (template.userId !== user.userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_IMPLEMENTED', 
            message: 'Favoriting public templates not yet implemented' 
          } 
        },
        { status: 501 }
      );
    }

    // Toggle favorite status
    const updatedTemplate = await prisma.contentLibraryItem.update({
      where: { id },
      data: {
        isFavorited: !template.isFavorited,
        updatedAt: new Date()
      }
    });

    // Log the action
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: updatedTemplate.isFavorited ? 'TEMPLATE_FAVORITED' : 'TEMPLATE_UNFAVORITED',
        metadata: {
          templateId: id,
          title: template.title,
          category: template.contextData?.category,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        isFavorited: updatedTemplate.isFavorited
      }
    });

  } catch (error: any) {
    console.error('Template favorite error:', error);
    
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
  max: 30 // 30 favorites per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `template-favorite:${userId}:${ip}`;
})));