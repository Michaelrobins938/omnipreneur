import { NextRequest, NextResponse } from 'next/server';
import { AIConversationMemory } from '@/lib/ai-conversation-memory';
import { verifyAuth } from '@/lib/auth';

// GET /api/ai-conversations/analytics - Get conversation analytics
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analytics = await AIConversationMemory.getConversationAnalytics(user.userId);

    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('AI conversation analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversation analytics' },
      { status: 500 }
    );
  }
}