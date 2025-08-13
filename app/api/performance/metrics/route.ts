import { NextRequest, NextResponse } from 'next/server';
import { PerformanceLearningService } from '@/lib/performance-learning';
import { verifyAuth } from '@/lib/auth';

// POST /api/performance/metrics - Track a performance metric
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const metric = await PerformanceLearningService.trackMetric({
      userId: user.userId,
      ...data
    });

    return NextResponse.json({
      success: true,
      data: metric
    });
  } catch (error) {
    console.error('Performance metric tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track performance metric' },
      { status: 500 }
    );
  }
}

// GET /api/performance/metrics - Get performance trends
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product') || undefined;
    const metricName = searchParams.get('metric') || undefined;
    const days = parseInt(searchParams.get('days') || '30');

    const trends = await PerformanceLearningService.getPerformanceTrends(
      user.userId,
      productId,
      metricName,
      days
    );

    return NextResponse.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Performance trends error:', error);
    return NextResponse.json(
      { error: 'Failed to get performance trends' },
      { status: 500 }
    );
  }
}