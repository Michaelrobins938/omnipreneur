// app/api/novus/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/novus/storage';
import { NovusSession } from '@/lib/novus/types';

// Mock user authentication for development
const getUserId = (request: NextRequest): string => {
  // In a real implementation, this would come from the authenticated user
  return 'user_dev_123';
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const sessions = await storage.getSessions(userId);
    
    return NextResponse.json({
      success: true,
      data: sessions
    });
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch sessions' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    
    // Validate required fields
    if (!body.input || !body.optimized) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_INPUT', 
            message: 'Input and optimized prompt are required' 
          } 
        },
        { status: 400 }
      );
    }
    
    // Create session
    const session = await storage.createSession(userId, {
      title: body.title || 'Untitled Session',
      tags: body.tags || [],
      input: body.input,
      optimized: body.optimized,
      metrics: body.metrics || {
        readability: 0,
        structure: 0,
        safety: 0,
        tokenDeltaPct: 0
      },
      diff: body.diff || ''
    });
    
    return NextResponse.json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error creating session:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'CREATE_ERROR', 
          message: 'Failed to create session' 
        } 
      },
      { status: 500 }
    );
  }
}