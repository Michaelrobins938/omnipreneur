import { NextRequest, NextResponse } from 'next/server';
import { PerformanceLearningService } from '@/lib/performance-learning';
import { verifyAuth } from '@/lib/auth';

// GET /api/performance/preferences - Get user preferences learned from behavior
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const preferences = await PerformanceLearningService.getUserPreferences(
      user.userId,
      category
    );

    return NextResponse.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Performance preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to get user preferences' },
      { status: 500 }
    );
  }
}

// POST /api/performance/preferences - Learn a user preference
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const preference = await PerformanceLearningService.learnUserPreference({
      userId: user.userId,
      ...data
    });

    return NextResponse.json({
      success: true,
      data: preference
    });
  } catch (error) {
    console.error('Performance preference learning error:', error);
    return NextResponse.json(
      { error: 'Failed to learn user preference' },
      { status: 500 }
    );
  }
}