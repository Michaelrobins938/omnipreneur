import { NextRequest, NextResponse } from 'next/server';
import { PerformanceLearningService } from '@/lib/performance-learning';
import { verifyAuth } from '@/lib/auth';

// GET /api/performance/insights - Get actionable insights and recommendations
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product') || undefined;

    const insights = await PerformanceLearningService.getActionableInsights(
      user.userId,
      productId
    );

    return NextResponse.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Performance insights error:', error);
    return NextResponse.json(
      { error: 'Failed to get performance insights' },
      { status: 500 }
    );
  }
}