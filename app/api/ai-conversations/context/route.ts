import { NextRequest, NextResponse } from 'next/server';
import { AIConversationMemory } from '@/lib/ai-conversation-memory';
import { verifyAuth } from '@/lib/auth';

// GET /api/ai-conversations/context - Build AI context from conversation history
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productContext = searchParams.get('product');
    const sessionId = searchParams.get('session') || undefined;

    if (!productContext) {
      return NextResponse.json(
        { error: 'Product context is required' },
        { status: 400 }
      );
    }

    const context = await AIConversationMemory.buildAIContext(
      user.userId,
      productContext,
      sessionId
    );

    return NextResponse.json({
      success: true,
      data: context
    });
  } catch (error) {
    console.error('AI context building error:', error);
    return NextResponse.json(
      { error: 'Failed to build AI context' },
      { status: 500 }
    );
  }
}