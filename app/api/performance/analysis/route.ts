import { NextRequest, NextResponse } from 'next/server';
import { PerformanceLearningService } from '@/lib/performance-learning';
import { verifyAuth } from '@/lib/auth';

// GET /api/performance/analysis - Get comprehensive performance analysis
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product') || undefined;

    const analysis = await PerformanceLearningService.getPerformanceAnalysis(
      user.userId,
      productId
    );

    return NextResponse.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Performance analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to get performance analysis' },
      { status: 500 }
    );
  }
}