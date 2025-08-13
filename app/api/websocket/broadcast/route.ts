// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { 
  broadcastNotification, 
  broadcastUserActivity, 
  broadcastAIProgress, 
  broadcastAdminAlert,
  broadcastActivityFeed 
} from '@/lib/websocket/server';

interface BroadcastRequest {
  type: 'notification' | 'user_activity' | 'ai_progress' | 'admin_alert' | 'activity_feed';
  userId?: string;
  data: any;
}

// POST /api/websocket/broadcast - Broadcast messages via WebSocket
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body: BroadcastRequest = await request.json();
    
    const { type, userId, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Type and data are required' } },
        { status: 400 }
      );
    }

    // Check permissions for different broadcast types
    switch (type) {
      case 'admin_alert':
        if (user.role !== 'ADMIN') {
          return NextResponse.json(
            { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
            { status: 403 }
          );
        }
        broadcastAdminAlert(data);
        break;

      case 'notification':
        if (!userId) {
          return NextResponse.json(
            { success: false, error: { code: 'INVALID_INPUT', message: 'userId required for notifications' } },
            { status: 400 }
          );
        }
        
        // Users can only send notifications to themselves unless they're admin
        if (user.role !== 'ADMIN' && userId !== user.userId) {
          return NextResponse.json(
            { success: false, error: { code: 'FORBIDDEN', message: 'Cannot send notifications to other users' } },
            { status: 403 }
          );
        }
        
        broadcastNotification(userId, data);
        break;

      case 'user_activity':
        // Only admins can broadcast user activity
        if (user.role !== 'ADMIN') {
          return NextResponse.json(
            { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
            { status: 403 }
          );
        }
        broadcastUserActivity(data);
        break;

      case 'ai_progress':
        if (!userId) {
          return NextResponse.json(
            { success: false, error: { code: 'INVALID_INPUT', message: 'userId required for AI progress' } },
            { status: 400 }
          );
        }
        
        // Users can only send AI progress to themselves
        if (userId !== user.userId && user.role !== 'ADMIN') {
          return NextResponse.json(
            { success: false, error: { code: 'FORBIDDEN', message: 'Cannot send AI progress to other users' } },
            { status: 403 }
          );
        }
        
        broadcastAIProgress(userId, data);
        break;

      case 'activity_feed':
        // Only admins can broadcast activity feed updates
        if (user.role !== 'ADMIN') {
          return NextResponse.json(
            { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
            { status: 403 }
          );
        }
        broadcastActivityFeed();
        break;

      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_TYPE', message: 'Invalid broadcast type' } },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${type} broadcast sent successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BROADCAST_ERROR', message: 'Failed to send broadcast' } },
      { status: 500 }
    );
  }
});