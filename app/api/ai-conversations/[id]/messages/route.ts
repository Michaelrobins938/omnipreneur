import { NextRequest, NextResponse } from 'next/server';
import { AIConversationMemory } from '@/lib/ai-conversation-memory';
import { verifyAuth } from '@/lib/auth';

// POST /api/ai-conversations/[id]/messages - Add message to conversation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, contextUpdates } = await request.json();
    
    const conversation = await AIConversationMemory.addMessage(
      params.id,
      user.userId,
      {
        ...message,
        timestamp: new Date()
      },
      contextUpdates
    );

    return NextResponse.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('AI conversation message error:', error);
    return NextResponse.json(
      { error: 'Failed to add message to conversation' },
      { status: 500 }
    );
  }
}