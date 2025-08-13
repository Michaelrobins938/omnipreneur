// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { wsServer } from '@/lib/websocket/server';

// GET /api/websocket/status - Get WebSocket server status
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check if user is admin for detailed stats
    const isAdmin = user.role === 'ADMIN';
    
    const stats = wsServer.getStats();
    
    const response = {
      success: true,
      data: {
        isRunning: stats.connectedClients !== undefined,
        connectedClients: isAdmin ? stats.connectedClients : undefined,
        uptime: stats.uptime,
        serverTime: new Date().toISOString(),
        wsUrl: process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:${process.env.WS_PORT || 3001}`,
        ...(isAdmin && {
          activeSubscriptions: stats.activeSubscriptions,
          detailedStats: stats
        })
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Failed to get WebSocket status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'STATUS_ERROR', 
          message: 'Failed to get WebSocket status' 
        },
        data: {
          isRunning: false,
          wsUrl: process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:${process.env.WS_PORT || 3001}`
        }
      },
      { status: 500 }
    );
  }
});