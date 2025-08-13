import { NextRequest, NextResponse } from 'next/server';
import { PerformanceLearningService } from '@/lib/performance-learning';
import { verifyAuth } from '@/lib/auth';

// POST /api/performance/content - Track content performance
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentId, productId, performanceData } = await request.json();
    
    if (!contentId || !productId || !performanceData) {
      return NextResponse.json(
        { error: 'Content ID, product ID, and performance data are required' },
        { status: 400 }
      );
    }

    await PerformanceLearningService.trackContentPerformance(
      user.userId,
      contentId,
      productId,
      performanceData
    );

    return NextResponse.json({
      success: true,
      message: 'Content performance tracked successfully'
    });
  } catch (error) {
    console.error('Content performance tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track content performance' },
      { status: 500 }
    );
  }
}