import { NextRequest, NextResponse } from 'next/server';
import { AIConversationMemory } from '@/lib/ai-conversation-memory';
import { verifyAuth } from '@/lib/auth';

// GET /api/ai-conversations/[id] - Get specific conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversation = await AIConversationMemory.getConversation(
      params.id,
      user.userId
    );

    return NextResponse.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('AI conversation get error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-conversations/[id] - Update conversation with feedback
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    
    const conversation = await AIConversationMemory.updateConversationFeedback(
      params.id,
      user.userId,
      updates
    );

    return NextResponse.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('AI conversation update error:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}