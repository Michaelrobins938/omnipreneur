import { NextRequest, NextResponse } from 'next/server';
import { toolkitStorage } from '@/lib/toolkit/storage';

const PRODUCT_ID = 'invoice-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'demo-user';
    const session = await toolkitStorage.getSession(PRODUCT_ID, userId, params.id);

    if (!session) {
      return NextResponse.json({
        success: false,
        error: { message: 'Session not found' }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to load session' }
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'demo-user';
    await toolkitStorage.deleteSession(PRODUCT_ID, userId, params.id);

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to delete session' }
    }, { status: 500 });
  }
}