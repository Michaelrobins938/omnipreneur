import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const CreateTemplateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  description: z.string().max(500).optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  variables: z.array(z.string()).default([]),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  isPublic: z.boolean().default(false)
});

/**
 * GET /api/templates
 * 
 * Search and retrieve templates based on filters
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query') || undefined;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const filter = searchParams.get('filter') || 'all'; // all, my, public, favorites
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      contentType: 'TEMPLATE',
      isArchived: false
    };

    // Apply filter
    switch (filter) {
      case 'my':
        where.userId = user.userId;
        break;
      case 'public':
        where.OR = [
          { userId: user.userId },
          { 
            AND: [
              { userId: { not: user.userId } },
              { contextData: { path: ['isPublic'], equals: true } }
            ]
          }
        ];
        break;
      case 'favorites':
        where.userId = user.userId;
        where.isFavorited = true;
        break;
      default: // 'all'
        where.OR = [
          { userId: user.userId },
          { 
            AND: [
              { userId: { not: user.userId } },
              { contextData: { path: ['isPublic'], equals: true } }
            ]
          }
        ];
    }

    // Add search filters
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } }
      ];
    }

    if (category) {
      where.contextData = {
        ...where.contextData,
        path: ['category'],
        equals: category
      };
    }

    if (difficulty) {
      where.contextData = {
        ...where.contextData,
        path: ['difficulty'],
        equals: difficulty
      };
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Get total count
    const total = await prisma.contentLibraryItem.count({ where });

    // Get templates with author info
    const templates = await prisma.contentLibraryItem.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        viewCount: true,
        copyCount: true,
        isFavorited: true,
        createdAt: true,
        updatedAt: true,
        contextData: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Format template data
    const formattedTemplates = templates.map(template => ({
      id: template.id,
      title: template.title,
      content: template.content,
      description: template.contextData?.description || '',
      category: template.contextData?.category || 'OTHER',
      tags: template.tags,
      variables: template.contextData?.variables || [],
      difficulty: template.contextData?.difficulty || 'BEGINNER',
      isPublic: template.contextData?.isPublic || false,
      isFavorited: template.isFavorited,
      viewCount: template.viewCount,
      copyCount: template.copyCount,
      useCount: template.contextData?.useCount || 0,
      rating: template.contextData?.rating || 0,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
      author: template.user
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formattedTemplates,
        total,
        hasMore: offset + templates.length < total
      }
    });

  } catch (error: any) {
    console.error('Templates search error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'SEARCH_ERROR', 
          message: 'Failed to search templates' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 30 // 30 searches per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `templates-search:${userId}:${ip}`;
}));

/**
 * POST /api/templates
 * 
 * Create a new template
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const validatedData = CreateTemplateSchema.parse(body);
    
    // Extract variables from template content
    const extractedVariables = extractVariables(validatedData.content);
    const finalVariables = [...new Set([...validatedData.variables, ...extractedVariables])];

    // Create template as content library item
    const template = await prisma.contentLibraryItem.create({
      data: {
        userId: user.userId,
        title: validatedData.title,
        content: validatedData.content,
        contentType: 'TEMPLATE',
        productSource: 'Template Manager',
        tags: validatedData.tags,
        contextData: {
          description: validatedData.description,
          category: validatedData.category,
          variables: finalVariables,
          difficulty: validatedData.difficulty,
          isPublic: validatedData.isPublic,
          rating: 0,
          useCount: 0
        }
      }
    });

    // Log template creation
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'TEMPLATE_CREATED',
        metadata: {
          templateId: template.id,
          title: template.title,
          category: validatedData.category,
          difficulty: validatedData.difficulty,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error: any) {
    console.error('Template creation error:', error);
    
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
          code: 'CREATE_ERROR', 
          message: 'Failed to create template' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 template creations per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `templates-create:${userId}:${ip}`;
})));

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