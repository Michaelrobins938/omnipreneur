import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/db';

/**
 * GET /api/templates/stats
 * 
 * Get template library statistics for the user
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Get total templates count (both owned and public)
    const totalTemplates = await prisma.contentLibraryItem.count({
      where: {
        contentType: 'TEMPLATE',
        isArchived: false,
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

    // Get templates by category
    const templates = await prisma.contentLibraryItem.findMany({
      where: {
        contentType: 'TEMPLATE',
        isArchived: false,
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
      select: {
        id: true,
        title: true,
        tags: true,
        viewCount: true,
        copyCount: true,
        contextData: true
      }
    });

    // Count by category
    const totalByCategory = templates.reduce((acc, template) => {
      const category = template.contextData?.category || 'OTHER';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count by difficulty
    const totalByDifficulty = templates.reduce((acc, template) => {
      const difficulty = template.contextData?.difficulty || 'BEGINNER';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get most used tags
    const tagCount = templates.reduce((acc, template) => {
      template.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const mostUsedTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Get popular templates (by view count + copy count)
    const popularTemplates = templates
      .map(template => ({
        id: template.id,
        title: template.title,
        popularity: template.viewCount + (template.copyCount * 2) // Weight copies more than views
      }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);

    const stats = {
      totalTemplates,
      totalByCategory,
      totalByDifficulty,
      mostUsedTags,
      popularTemplates
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Template stats error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'STATS_ERROR', 
          message: 'Failed to fetch template statistics' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 20 // 20 requests per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `template-stats:${userId}:${ip}`;
}));