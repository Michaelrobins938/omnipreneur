// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { getNovusHistory } from '@/lib/db/novus';

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : 20;

    const items = await getNovusHistory(user.id, isFinite(limit) ? limit : 20);

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('NOVUS history error:', error);
    return NextResponse.json({ success: false, error: { code: 'HISTORY_ERROR', message: 'Failed to fetch NOVUS history' } }, { status: 500 });
  }
});

