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
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
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

    // Format template data
    const formattedTemplate = {
      id: template.id,
      title: template.title,
      content: template.content,
      description: (template.contextData as any)?.description || '',
      category: (template.contextData as any)?.category || 'OTHER',
      tags: template.tags,
      variables: (template.contextData as any)?.variables || [],
      difficulty: (template.contextData as any)?.difficulty || 'BEGINNER',
      isPublic: (template.contextData as any)?.isPublic || false,
      isFavorited: template.isFavorited,
      isArchived: template.isArchived,
      viewCount: template.viewCount,
      copyCount: template.copyCount,
      shareCount: template.shareCount,
      useCount: (template.contextData as any)?.useCount || 0,
      rating: (template.contextData as any)?.rating || 0,
      userRating: template.userRating,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
      author: template.user,
      isOwner: template.userId === user.userId
    };

    return NextResponse.json({
      success: true,
      data: formattedTemplate
    });

  } catch (error: any) {
    console.error('Template fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch template' 
        } 
      },
      { status: 500 }
    );
  }
};

const UpdateTemplateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  description: z.string().max(500).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  variables: z.array(z.string()).optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  isPublic: z.boolean().optional()
});

const putHandler = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = (request as any).user;
    const { id } = params;
    const body = await request.json();

    const validatedData = UpdateTemplateSchema.parse(body);

    // Check if template exists and user owns it
    const existingTemplate = await prisma.contentLibraryItem.findFirst({
      where: {
        id,
        userId: user.userId,
        contentType: 'TEMPLATE'
      }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'TEMPLATE_NOT_FOUND', 
            message: 'Template not found or you do not have permission to edit it' 
          } 
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    if (validatedData.title) updateData.title = validatedData.title;
    if (validatedData.content) updateData.content = validatedData.content;
    if (validatedData.tags) updateData.tags = validatedData.tags;

    // Update context data
    const newContextData = { ...(existingTemplate.contextData as any) };
    if (validatedData.description !== undefined) newContextData.description = validatedData.description;
    if (validatedData.category) newContextData.category = validatedData.category;
    if (validatedData.difficulty) newContextData.difficulty = validatedData.difficulty;
    if (validatedData.isPublic !== undefined) newContextData.isPublic = validatedData.isPublic;
    if (validatedData.variables) newContextData.variables = validatedData.variables;

    // Extract variables from content if content was updated
    if (validatedData.content) {
      const extractedVariables = extractVariables(validatedData.content);
      const finalVariables = [...new Set([...(validatedData.variables || []), ...extractedVariables])];
      newContextData.variables = finalVariables;
    }

    updateData.contextData = newContextData;

    // Update template
    const updatedTemplate = await prisma.contentLibraryItem.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Log the update
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'TEMPLATE_UPDATED',
        metadata: {
          templateId: id,
          updatedFields: Object.keys(validatedData),
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTemplate
    });

  } catch (error: any) {
    console.error('Template update error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid template data',
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
          message: 'Failed to update template' 
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

    // Check if template exists and user owns it
    const existingTemplate = await prisma.contentLibraryItem.findFirst({
      where: {
        id,
        userId: user.userId,
        contentType: 'TEMPLATE'
      }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'TEMPLATE_NOT_FOUND', 
            message: 'Template not found or you do not have permission to delete it' 
          } 
        },
        { status: 404 }
      );
    }

    // Delete template
    await prisma.contentLibraryItem.delete({
      where: { id }
    });

    // Log the deletion
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'TEMPLATE_DELETED',
        metadata: {
          templateId: id,
          title: existingTemplate.title,
          category: (existingTemplate.contextData as any)?.category,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });

  } catch (error: any) {
    console.error('Template deletion error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: 'Failed to delete template' 
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
    return `template-get:${userId}:${ip}`;
  }
}));

export const PUT = requireAuth(withCsrfProtection(withRateLimit(putHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 updates per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `template-update:${userId}:${ip}`;
  }
})));

export const DELETE = requireAuth(deleteHandler as any);

/**
 * Extract variables from template content
 * Looks for patterns like {{variable}}, [variable], {variable}
 */
function extractVariables(content: string): string[] {
  const patterns = [
    /\{\{([^}]+)\}\}/g,  // {{variable}}
    /\[([^\]]+)\]/g,     // [variable]
    /\{([^}]+)\}/g,      // {variable}
    /%([^%]+)%/g,        // %variable%
    /\$\{([^}]+)\}/g     // ${variable}
  ];

  const variables = new Set<string>();

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const variable = match[1].trim();
      if (variable && !variable.includes(' ') && variable.length < 50) {
        variables.add(variable);
      }
    }
  });

  return Array.from(variables);
}