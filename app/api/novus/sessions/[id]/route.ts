// app/api/novus/sessions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/novus/storage';

// Mock user authentication for development
const getUserId = (request: NextRequest): string => {
  // In a real implementation, this would come from the authenticated user
  return 'user_dev_123';
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    const sessionId = params.id;
    
    const session = await storage.getSession(userId, sessionId);
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            message: 'Session not found' 
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error fetching session:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch session' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    const sessionId = params.id;
    const body = await request.json();
    
    // Check if session exists
    const existing = await storage.getSession(userId, sessionId);
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            message: 'Session not found' 
          } 
        },
        { status: 404 }
      );
    }
    
    // Update session
    const updated = await storage.updateSession(userId, sessionId, body);
    
    if (!updated) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UPDATE_ERROR', 
            message: 'Failed to update session' 
          } 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    console.error('Error updating session:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'UPDATE_ERROR', 
          message: 'Failed to update session' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    const sessionId = params.id;
    
    // Check if session exists
    const existing = await storage.getSession(userId, sessionId);
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            message: 'Session not found' 
          } 
        },
        { status: 404 }
      );
    }
    
    // Delete session
    const deleted = await storage.deleteSession(userId, sessionId);
    
    if (!deleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'DELETE_ERROR', 
            message: 'Failed to delete session' 
          } 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: 'Failed to delete session' 
        } 
      },
      { status: 500 }
    );
  }
}