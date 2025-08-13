// @ts-nocheck
import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { realTimeAnalytics } from '@/lib/analytics/real-time';
import { verifyToken } from '@/lib/auth';

// WebSocket server instance
let wss: WebSocketServer | null = null;

/**
 * GET /api/analytics/websocket
 * 
 * WebSocket endpoint for real-time analytics updates
 * 
 * Authentication: Required via query token
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return new Response('Authentication token required', { status: 401 });
  }
  
  try {
    // Verify the authentication token
    const user = await verifyToken(token);
    
    if (!user) {
      return new Response('Invalid token', { status: 401 });
    }
    
    // Initialize WebSocket server if not already created
    if (!wss) {
      wss = new WebSocketServer({ 
        port: parseInt(process.env.WS_PORT || '3001'),
        verifyClient: async (info) => {
          try {
            const url = new URL(info.req.url!, `http://${info.req.headers.host}`);
            const wsToken = url.searchParams.get('token');
            
            if (!wsToken) return false;
            
            const wsUser = await verifyToken(wsToken);
            return !!wsUser;
          } catch {
            return false;
          }
        }
      });
      
      console.log(`WebSocket server started on port ${process.env.WS_PORT || '3001'}`);
    }
    
    // Handle WebSocket connections
    wss.on('connection', async (ws, req) => {
      try {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const wsToken = url.searchParams.get('token');
        
        if (!wsToken) {
          ws.close(1008, 'Token required');
          return;
        }
        
        const wsUser = await verifyToken(wsToken);
        
        if (!wsUser) {
          ws.close(1008, 'Invalid token');
          return;
        }
        
        console.log(`WebSocket connected for user: ${wsUser.userId}`);
        
        // Add connection to real-time analytics
        realTimeAnalytics.addWSConnection(wsUser.userId, ws);
        
        // Handle incoming messages from client
        ws.on('message', async (data) => {
          try {
            const message = JSON.parse(data.toString());
            
            switch (message.type) {
              case 'subscribe_metrics':
                // Subscribe to specific metrics updates
                await handleMetricsSubscription(wsUser.userId, message.payload, ws);
                break;
                
              case 'request_snapshot':
                // Send current analytics snapshot
                await sendAnalyticsSnapshot(wsUser.userId, ws);
                break;
                
              case 'track_event':
                // Track event via WebSocket
                realTimeAnalytics.trackEvent(
                  wsUser.userId,
                  message.payload.event,
                  message.payload.data
                );
                break;
                
              default:
                ws.send(JSON.stringify({
                  type: 'error',
                  message: 'Unknown message type'
                }));
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format'
            }));
          }
        });
        
        // Handle connection close
        ws.on('close', () => {
          console.log(`WebSocket disconnected for user: ${wsUser.userId}`);
        });
        
        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connected',
          payload: {
            userId: wsUser.userId,
            timestamp: new Date().toISOString()
          }
        }));
        
      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1011, 'Server error');
      }
    });
    
    return new Response('WebSocket server initialized', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('WebSocket initialization error:', error);
    return new Response('Server error', { status: 500 });
  }
}

/**
 * Handle metrics subscription requests
 */
async function handleMetricsSubscription(userId: string, payload: any, ws: any) {
  const { metrics, interval = 5000 } = payload;
  
  // Set up periodic metrics updates
  const metricsInterval = setInterval(async () => {
    try {
      const dashboardMetrics = await realTimeAnalytics.getLiveDashboardMetrics(userId);
      
      // Filter metrics if specified
      let filteredMetrics = dashboardMetrics;
      if (metrics && Array.isArray(metrics)) {
        filteredMetrics = {};
        metrics.forEach(metric => {
          if (dashboardMetrics[metric]) {
            filteredMetrics[metric] = dashboardMetrics[metric];
          }
        });
      }
      
      ws.send(JSON.stringify({
        type: 'metrics_update',
        payload: filteredMetrics,
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Metrics update error:', error);
    }
  }, interval);
  
  // Clear interval when connection closes
  ws.on('close', () => {
    clearInterval(metricsInterval);
  });
  
  // Send confirmation
  ws.send(JSON.stringify({
    type: 'subscription_confirmed',
    payload: {
      metrics: metrics || 'all',
      interval
    }
  }));
}

/**
 * Send current analytics snapshot
 */
async function sendAnalyticsSnapshot(userId: string, ws: any) {
  try {
    const [realtimeData, dashboardMetrics] = await Promise.all([
      realTimeAnalytics.getRealTimeAnalytics(userId, '24h'),
      realTimeAnalytics.getLiveDashboardMetrics(userId)
    ]);
    
    ws.send(JSON.stringify({
      type: 'analytics_snapshot',
      payload: {
        realtime: realtimeData,
        dashboard: dashboardMetrics,
        timestamp: new Date().toISOString()
      }
    }));
    
  } catch (error) {
    console.error('Snapshot error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to generate analytics snapshot'
    }));
  }
}

/**
 * Cleanup WebSocket server
 */
export function cleanup() {
  if (wss) {
    wss.close();
    wss = null;
  }
}

// Handle process termination
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);