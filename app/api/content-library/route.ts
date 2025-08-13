import { NextRequest, NextResponse } from 'next/server';
import { ContentLibraryService } from '@/lib/content-library';
import { verifyAuth } from '@/lib/auth';

// GET /api/content-library - Search and retrieve content
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || undefined;
    const contentType = searchParams.get('type') || undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const folderId = searchParams.get('folder') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await ContentLibraryService.searchContent({
      userId: user.userId,
      query,
      contentType,
      tags,
      folderId,
      sortBy,
      sortOrder,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Content library search error:', error);
    return NextResponse.json(
      { error: 'Failed to search content library' },
      { status: 500 }
    );
  }
}

// POST /api/content-library - Create new content item
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const contentItem = await ContentLibraryService.autoSaveContent({
      userId: user.userId,
      ...data
    });

    return NextResponse.json({
      success: true,
      data: contentItem
    });
  } catch (error) {
    console.error('Content library creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create content item' },
      { status: 500 }
    );
  }
}