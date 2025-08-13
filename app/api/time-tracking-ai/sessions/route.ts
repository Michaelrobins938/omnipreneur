import { NextRequest, NextResponse } from 'next/server';
import { toolkitStorage } from '@/lib/toolkit/storage';

const PRODUCT_ID = 'time-tracking-ai';

export async function GET(request: NextRequest) {
  try {
    const userId = 'demo-user';
    const sessions = await toolkitStorage.getSessions(PRODUCT_ID, userId);

    return NextResponse.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to load sessions' }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, tags, input, result, metrics } = body;

    if (!title || !input || !result) {
      return NextResponse.json({
        success: false,
        error: { message: 'Title, input, and result are required' }
      }, { status: 400 });
    }

    const userId = 'demo-user';
    const session = await toolkitStorage.createSession(PRODUCT_ID, userId, {
      title,
      tags: tags || [],
      input,
      result,
      metrics: metrics || {}
    });

    return NextResponse.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to create session' }
    }, { status: 500 });
  }
}