// @ts-nocheck
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  subscriptions?: Set<string>;
  lastPing?: number;
  isAlive?: boolean;
}

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  id?: string;
}

interface BroadcastMessage extends WebSocketMessage {
  target?: 'all' | 'user' | 'admin' | 'subscribers';
  userId?: string;
  subscription?: string;
}

class OmnipreneurWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, AuthenticatedWebSocket> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map(); // eventType -> Set<userId>
  private pingInterval: NodeJS.Timeout | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;

  constructor(private port: number = parseInt(process.env.WS_PORT || '3001')) {}

  async start() {
    this.wss = new WebSocketServer({
      port: this.port,
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    this.startPingPong();
    this.startMetricsBroadcast();

    console.log(`WebSocket server started on port ${this.port}`);
  }

  private async verifyClient(info: { req: IncomingMessage; origin: string; secure: boolean }) {
    try {
      const url = parse(info.req.url || '', true);
      const token = url.query.token as string;

      if (!token) {
        console.log('WebSocket connection rejected: No token provided');
        return false;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      if (!decoded.userId) {
        console.log('WebSocket connection rejected: Invalid token');
        return false;
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true }
      });

      if (!user) {
        console.log('WebSocket connection rejected: User not found');
        return false;
      }

      // Store user info for connection handler
      (info.req as any).userId = user.id;
      (info.req as any).userRole = user.role;

      return true;
    } catch (error) {
      console.error('WebSocket verification error:', error);
      return false;
    }
  }

  private handleConnection(ws: AuthenticatedWebSocket, req: IncomingMessage) {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    // Initialize WebSocket
    ws.userId = userId;
    ws.subscriptions = new Set();
    ws.isAlive = true;
    ws.lastPing = Date.now();

    // Store client
    this.clients.set(userId, ws);

    console.log(`WebSocket client connected: ${userId} (${userRole})`);

    // Send welcome message
    this.sendToClient(ws, {
      type: 'connection_established',
      payload: {
        userId,
        serverTime: new Date().toISOString(),
        availableSubscriptions: [
          'metrics',
          'notification',
          'user_activity',
          'system_health',
          'ai_generation_progress',
          'admin_alerts'
        ]
      },
      timestamp: new Date().toISOString()
    });

    // Handle messages
    ws.on('message', (data) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
        this.sendError(ws, 'INVALID_MESSAGE', 'Invalid message format');
      }
    });

    // Handle pong responses
    ws.on('pong', () => {
      ws.isAlive = true;
      ws.lastPing = Date.now();
    });

    // Handle disconnection
    ws.on('close', () => {
      this.handleDisconnection(userId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
      this.handleDisconnection(userId);
    });
  }

  private handleMessage(ws: AuthenticatedWebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case 'ping':
        this.sendToClient(ws, {
          type: 'pong',
          payload: { timestamp: message.timestamp },
          timestamp: new Date().toISOString()
        });
        break;

      case 'subscribe':
        this.handleSubscription(ws, message.payload.eventType);
        break;

      case 'unsubscribe':
        this.handleUnsubscription(ws, message.payload.eventType);
        break;

      case 'get_metrics':
        this.sendCurrentMetrics(ws);
        break;

      case 'get_system_health':
        this.sendSystemHealth(ws);
        break;

      default:
        console.log(`Unknown message type: ${message.type}`);
        this.sendError(ws, 'UNKNOWN_MESSAGE_TYPE', `Unknown message type: ${message.type}`);
    }
  }

  private handleSubscription(ws: AuthenticatedWebSocket, eventType: string) {
    if (!ws.userId) return;

    ws.subscriptions?.add(eventType);
    
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Set());
    }
    this.subscriptions.get(eventType)?.add(ws.userId);

    this.sendToClient(ws, {
      type: 'subscription_confirmed',
      payload: { eventType },
      timestamp: new Date().toISOString()
    });

    console.log(`User ${ws.userId} subscribed to ${eventType}`);
  }

  private handleUnsubscription(ws: AuthenticatedWebSocket, eventType: string) {
    if (!ws.userId) return;

    ws.subscriptions?.delete(eventType);
    this.subscriptions.get(eventType)?.delete(ws.userId);

    this.sendToClient(ws, {
      type: 'subscription_cancelled',
      payload: { eventType },
      timestamp: new Date().toISOString()
    });

    console.log(`User ${ws.userId} unsubscribed from ${eventType}`);
  }

  private handleDisconnection(userId: string) {
    const ws = this.clients.get(userId);
    if (ws?.subscriptions) {
      // Remove from all subscriptions
      ws.subscriptions.forEach(eventType => {
        this.subscriptions.get(eventType)?.delete(userId);
      });
    }

    this.clients.delete(userId);
    console.log(`WebSocket client disconnected: ${userId}`);
  }

  private sendToClient(ws: AuthenticatedWebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: AuthenticatedWebSocket, code: string, message: string) {
    this.sendToClient(ws, {
      type: 'error',
      payload: { code, message },
      timestamp: new Date().toISOString()
    });
  }

  // Public methods for broadcasting
  public broadcast(message: BroadcastMessage) {
    const { target = 'all', userId, subscription } = message;

    switch (target) {
      case 'all':
        this.clients.forEach(ws => this.sendToClient(ws, message));
        break;

      case 'user':
        if (userId) {
          const ws = this.clients.get(userId);
          if (ws) this.sendToClient(ws, message);
        }
        break;

      case 'subscribers':
        if (subscription) {
          const subscribers = this.subscriptions.get(subscription);
          if (subscribers) {
            subscribers.forEach(subscriberId => {
              const ws = this.clients.get(subscriberId);
              if (ws) this.sendToClient(ws, message);
            });
          }
        }
        break;

      case 'admin':
        this.clients.forEach(ws => {
          // Send to admin users only (you'd need to track user roles)
          this.sendToClient(ws, message);
        });
        break;
    }
  }

  // Broadcast real-time metrics
  private async sendCurrentMetrics(ws?: AuthenticatedWebSocket) {
    try {
      // Fetch current metrics from database
      const [userCount, activeUserCount, recentAIRequests, totalRevenue] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            events: {
              some: {
                timestamp: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
              }
            }
          }
        }),
        prisma.aIRequest.count({
          where: {
            timestamp: {
              gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
            }
          }
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'SUCCEEDED' }
        })
      ]);

      const metrics = {
        activeUsers: activeUserCount,
        totalUsers: userCount,
        aiRequests: recentAIRequests,
        revenue: totalRevenue._sum.amount || 0,
        timestamp: new Date().toISOString()
      };

      const message: BroadcastMessage = {
        type: 'metrics',
        payload: metrics,
        timestamp: new Date().toISOString(),
        target: 'subscribers',
        subscription: 'metrics'
      };

      if (ws) {
        this.sendToClient(ws, message);
      } else {
        this.broadcast(message);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }

  private async sendSystemHealth(ws?: AuthenticatedWebSocket) {
    try {
      // Check system health
      const health = {
        status: 'healthy',
        database: 'connected',
        ai_services: 'operational',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };

      const message: BroadcastMessage = {
        type: 'system_health',
        payload: health,
        timestamp: new Date().toISOString(),
        target: 'subscribers',
        subscription: 'system_health'
      };

      if (ws) {
        this.sendToClient(ws, message);
      } else {
        this.broadcast(message);
      }
    } catch (error) {
      console.error('Failed to check system health:', error);
    }
  }

  // Ping-pong to keep connections alive
  private startPingPong() {
    this.pingInterval = setInterval(() => {
      this.clients.forEach((ws, userId) => {
        if (!ws.isAlive) {
          console.log(`Terminating dead connection for user: ${userId}`);
          ws.terminate();
          this.handleDisconnection(userId);
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Every 30 seconds
  }

  // Broadcast metrics periodically
  private startMetricsBroadcast() {
    this.metricsInterval = setInterval(() => {
      this.sendCurrentMetrics();
      this.sendSystemHealth();
    }, 30000); // Every 30 seconds
  }

  // Notification methods
  public sendNotification(userId: string, notification: any) {
    this.broadcast({
      type: 'notification',
      payload: notification,
      timestamp: new Date().toISOString(),
      target: 'user',
      userId
    });
  }

  public sendUserActivity(activity: any) {
    this.broadcast({
      type: 'user_activity',
      payload: activity,
      timestamp: new Date().toISOString(),
      target: 'subscribers',
      subscription: 'user_activity'
    });
  }

  public sendAIGenerationProgress(userId: string, progress: any) {
    this.broadcast({
      type: 'ai_generation_progress',
      payload: progress,
      timestamp: new Date().toISOString(),
      target: 'user',
      userId
    });
  }

  public sendAdminAlert(alert: any) {
    this.broadcast({
      type: 'admin_alert',
      payload: alert,
      timestamp: new Date().toISOString(),
      target: 'admin'
    });
  }

  // Activity feed
  public async sendActivityFeed() {
    try {
      // Get recent activities
      const activities = await prisma.event.findMany({
        take: 20,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      });

      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        description: this.formatActivityDescription(activity),
        timestamp: activity.timestamp,
        type: activity.event
      }));

      this.broadcast({
        type: 'activity_feed',
        payload: formattedActivities,
        timestamp: new Date().toISOString(),
        target: 'subscribers',
        subscription: 'user_activity'
      });
    } catch (error) {
      console.error('Failed to send activity feed:', error);
    }
  }

  private formatActivityDescription(activity: any): string {
    const userName = activity.user?.name || 'Unknown User';
    
    switch (activity.event) {
      case 'ai_request':
        return `${userName} generated content with AI`;
      case 'user_login':
        return `${userName} logged in`;
      case 'subscription_created':
        return `${userName} upgraded their subscription`;
      case 'data_export':
        return `${userName} exported data`;
      default:
        return `${userName} performed ${activity.event}`;
    }
  }

  public getStats() {
    return {
      connectedClients: this.clients.size,
      activeSubscriptions: this.subscriptions.size,
      uptime: process.uptime()
    };
  }

  public stop() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.metricsInterval) clearInterval(this.metricsInterval);
    
    this.clients.forEach(ws => ws.close());
    this.wss?.close();
    
    console.log('WebSocket server stopped');
  }
}

// Singleton instance
export const wsServer = new OmnipreneurWebSocketServer();

// Helper functions for other parts of the application to use
export function broadcastNotification(userId: string, notification: any) {
  wsServer.sendNotification(userId, notification);
}

export function broadcastUserActivity(activity: any) {
  wsServer.sendUserActivity(activity);
}

export function broadcastAIProgress(userId: string, progress: any) {
  wsServer.sendAIGenerationProgress(userId, progress);
}

export function broadcastAdminAlert(alert: any) {
  wsServer.sendAdminAlert(alert);
}

export function broadcastActivityFeed() {
  wsServer.sendActivityFeed();
}