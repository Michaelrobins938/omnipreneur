import { NextRequest, NextResponse } from 'next/server';
import { ContentLibraryService } from '@/lib/content-library';
import { verifyAuth } from '@/lib/auth';

// POST /api/content-library/interact - Track content interactions
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentId, action } = await request.json();
    
    if (!['copy', 'share', 'view'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action type' },
        { status: 400 }
      );
    }

    await ContentLibraryService.trackInteraction(contentId, user.id, action);

    return NextResponse.json({
      success: true,
      message: `${action} tracked successfully`
    });
  } catch (error) {
    console.error('Content library interaction error:', error);
    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    );
  }
}