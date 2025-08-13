import { NextRequest, NextResponse } from 'next/server';
import { AIConversationMemory } from '@/lib/ai-conversation-memory';
import { verifyAuth } from '@/lib/auth';

// GET /api/ai-conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productContext = searchParams.get('product') || undefined;
    const query = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    let conversations;
    
    if (query) {
      conversations = await AIConversationMemory.searchConversations(
        user.userId,
        query,
        productContext,
        limit
      );
    } else {
      conversations = await AIConversationMemory.getRecentConversations(
        user.userId,
        productContext,
        limit
      );
    }

    return NextResponse.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('AI conversations get error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}

// POST /api/ai-conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const conversation = await AIConversationMemory.createConversation({
      userId: user.userId,
      ...data
    });

    return NextResponse.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('AI conversation creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}