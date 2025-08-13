import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

const postHandler = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    
    // Try to get authenticated user, but don't require it
    let userId: string | undefined;
    try {
      const user = await requireAuth(request as any);
      userId = (user as any)?.user?.userId;
    } catch {
      // Anonymous user - that's okay for view tracking
    }

    // In a real application, you would:
    // 1. Update the article view count in your CMS/database
    // 2. Track user-specific analytics if authenticated
    // 3. Store anonymous analytics data
    
    // Log the view for analytics
    if (userId) {
      await prisma.event.create({
        data: {
          userId,
          event: 'HELP_ARTICLE_VIEWED',
          metadata: {
            articleId: id,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent'),
            referrer: request.headers.get('referer')
          }
        }
      });
    }

    // For now, just return success
    // In a real app, you might update article view counts in your CMS
    console.log(`Help article ${id} viewed by user ${userId || 'anonymous'}`);

    return NextResponse.json({
      success: true,
      data: {
        articleId: id,
        viewTracked: true
      }
    });

  } catch (error: any) {
    console.error('Help article view tracking error:', error);
    
    // Don't fail the request if view tracking fails
    return NextResponse.json({
      success: true,
      data: {
        articleId: params.id,
        viewTracked: false
      }
    });
  }
};

export const POST = withRateLimit(postHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 views per minute (generous for reading)
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `help-view:${ip}`;
  }
});