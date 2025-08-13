import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/db';

/**
 * GET /api/content-library/stats
 * 
 * Get content library statistics for the user
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Get total items count
    const totalItems = await prisma.contentLibraryItem.count({
      where: {
        userId: user.userId,
        isArchived: false
      }
    });

    // Get count by content type
    const typeStats = await prisma.contentLibraryItem.groupBy({
      by: ['contentType'],
      where: {
        userId: user.userId,
        isArchived: false
      },
      _count: {
        id: true
      }
    });

    const totalByType = typeStats.reduce((acc, stat) => {
      acc[stat.contentType] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Get average quality score
    const qualityStats = await prisma.contentLibraryItem.aggregate({
      where: {
        userId: user.userId,
        isArchived: false,
        qualityScore: { not: null }
      },
      _avg: {
        qualityScore: true
      }
    });

    const averageQualityScore = qualityStats._avg.qualityScore || 0;

    // Get most used tags
    const allContent = await prisma.contentLibraryItem.findMany({
      where: {
        userId: user.userId,
        isArchived: false
      },
      select: {
        tags: true
      }
    });

    const tagCount = allContent.reduce((acc, item) => {
      item.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const mostUsedTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Get recent activity from events
    const recentEvents = await prisma.event.findMany({
      where: {
        userId: user.userId,
        event: {
          in: ['CONTENT_CREATED', 'CONTENT_UPDATED', 'CONTENT_VIEWED', 'CONTENT_COPIED']
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    const recentActivity = recentEvents.map(event => ({
      id: event.id,
      title: event.metadata?.title || 'Unknown Content',
      action: event.event.replace('CONTENT_', '').toLowerCase(),
      timestamp: event.timestamp.toISOString()
    }));

    const stats = {
      totalItems,
      totalByType,
      averageQualityScore,
      mostUsedTags,
      recentActivity
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: any) {
    console.error('Content library stats error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'STATS_ERROR', 
          message: 'Failed to fetch content library statistics' 
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
  return `content-stats:${userId}:${ip}`;
}));