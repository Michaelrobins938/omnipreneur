// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getRealtimeServer } from '@/lib/websocket/server';

// GET /api/websocket - Get WebSocket connection info
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const server = getRealtimeServer();
    
    // Generate JWT token for WebSocket authentication
    const jwt = require('jsonwebtoken');
    const wsToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const wsUrl = process.env.WEBSOCKET_URL || `ws://localhost:3001?token=${wsToken}`;

    return NextResponse.json({
      success: true,
      data: {
        wsUrl: `${wsUrl}?token=${wsToken}`,
        connectedClients: server.getConnectedClients(),
        activeChannels: server.getActiveChannels(),
        token: wsToken
      }
    });

  } catch (error) {
    console.error('WebSocket info error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to get WebSocket info' } },
      { status: 500 }
    );
  }
});

// POST /api/websocket - Send broadcast message (admin only)
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check admin permissions
    const prisma = (await import('@/lib/db')).default;
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true }
    });

    if (userRecord?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, payload, channel, targetUserId } = body;

    if (!type || !payload) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Type and payload are required' } },
        { status: 400 }
      );
    }

    const server = getRealtimeServer();

    if (targetUserId) {
      // Send to specific user
      server.broadcastToUser(targetUserId, type, payload);
    } else if (channel) {
      // Send to specific channel
      server.broadcast(type, payload, channel);
    } else {
      // Broadcast to all
      server.broadcast(type, payload);
    }

    return NextResponse.json({
      success: true,
      data: { 
        message: 'Broadcast sent successfully',
        recipients: targetUserId ? 1 : (channel ? 'channel' : 'all')
      }
    });

  } catch (error) {
    console.error('WebSocket broadcast error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BROADCAST_FAILED', message: 'Failed to send broadcast' } },
      { status: 500 }
    );
  }
});