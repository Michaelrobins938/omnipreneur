import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const ActionSchema = z.object({
  action: z.enum(['view', 'copy', 'share', 'use', 'download'])
});

/**
 * POST /api/templates/[id]/action
 * 
 * Track user actions on templates (view, copy, share, use, download)
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id } = params;
    const body = await request.json();

    const { action } = ActionSchema.parse(body);

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

    // Update counters based on action
    const updateData: any = {
      lastAccessedAt: new Date()
    };

    // Update context data for use count
    let newContextData = { ...template.contextData };

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
      case 'use':
        newContextData.useCount = (newContextData.useCount || 0) + 1;
        updateData.contextData = newContextData;
        break;
      case 'download':
        // For future use when download functionality is implemented
        break;
    }

    // Update template
    const updatedTemplate = await prisma.contentLibraryItem.update({
      where: { id },
      data: updateData
    });

    // Log the action for analytics
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: `TEMPLATE_${action.toUpperCase()}`,
        metadata: {
          templateId: id,
          title: template.title,
          category: template.contextData?.category,
          difficulty: template.contextData?.difficulty,
          isOwner: template.userId === user.userId,
          timestamp: new Date().toISOString()
        }
      }
    });

    // Get the new count based on action
    let newCount = 0;
    switch (action) {
      case 'view':
        newCount = updatedTemplate.viewCount;
        break;
      case 'copy':
        newCount = updatedTemplate.copyCount;
        break;
      case 'share':
        newCount = updatedTemplate.shareCount;
        break;
      case 'use':
        newCount = updatedTemplate.contextData?.useCount || 0;
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        newCount
      }
    });

  } catch (error: any) {
    console.error('Template action error:', error);
    
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
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 50 // 50 actions per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `template-action:${userId}:${ip}`;
})));