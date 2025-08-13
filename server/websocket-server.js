// @ts-nocheck
/**
 * Standalone WebSocket Server for Real-time Data Broadcasting
 * 
 * This server handles real-time updates for:
 * - Analytics dashboard updates
 * - Chat notifications
 * - System status broadcasts
 * - User activity feeds
 */

const { WebSocketServer } = require('ws');
const { createServer } = require('http');
const jwt = require('jsonwebtoken');

// Configuration
const PORT = process.env.WS_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Create HTTP server for WebSocket upgrade
const server = createServer();
const wss = new WebSocketServer({ 
  server,
  verifyClient: (info) => {
    try {
      const url = new URL(info.req.url, `http://${info.req.headers.host}`);
      const token = url.searchParams.get('token');
      
      if (!token) {
        console.log('WebSocket connection rejected: No token provided');
        return false;
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Store user info for later use
      info.req.user = decoded;
      
      console.log(`WebSocket connection authorized for user: ${decoded.userId}`);
      return true;
      
    } catch (error) {
      console.log('WebSocket connection rejected: Invalid token', error.message);
      return false;
    }
  }
});

// Connected clients registry
const clients = new Map();
const subscriptions = new Map();

wss.on('connection', (ws, request) => {
  const user = request.user;
  const clientId = `${user.userId}-${Date.now()}`;
  
  // Register client
  clients.set(clientId, {
    ws,
    userId: user.userId,
    connectedAt: new Date(),
    subscriptions: new Set()
  });
  
  console.log(`Client connected: ${clientId} (User: ${user.userId})`);
  console.log(`Total clients: ${clients.size}`);
  
  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    payload: {
      clientId,
      timestamp: new Date().toISOString()
    }
  }));
  
  // Handle incoming messages
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      await handleClientMessage(clientId, message);
    } catch (error) {
      console.error('Error processing client message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
  
  // Handle ping messages for latency measurement
  ws.on('ping', () => {
    ws.pong();
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    const client = clients.get(clientId);
    if (client) {
      // Unsubscribe from all topics
      client.subscriptions.forEach(topic => {
        unsubscribe(clientId, topic);
      });
      
      clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
      console.log(`Total clients: ${clients.size}`);
    }
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
  });
});

/**
 * Handle messages from clients
 */
async function handleClientMessage(clientId, message) {
  const client = clients.get(clientId);
  if (!client) return;
  
  const { type, payload } = message;
  
  switch (type) {
    case 'subscribe_metrics':
      await handleMetricsSubscription(clientId, payload);
      break;
      
    case 'subscribe_notifications':
      subscribe(clientId, 'notifications');
      client.ws.send(JSON.stringify({
        type: 'subscription_confirmed',
        payload: { topic: 'notifications' }
      }));
      break;
      
    case 'subscribe_chat':
      subscribe(clientId, `chat:${payload.sessionId}`);
      break;
      
    case 'track_event':
      await handleEventTracking(clientId, payload);
      break;
      
    case 'ping':
      client.ws.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date().toISOString()
      }));
      break;
      
    default:
      console.log(`Unknown message type: ${type}`);
  }
}

/**
 * Handle metrics subscription
 */
async function handleMetricsSubscription(clientId, payload) {
  const client = clients.get(clientId);
  if (!client) return;
  
  const { metrics = [], interval = 5000 } = payload;
  
  // Subscribe to metrics updates
  subscribe(clientId, 'metrics');
  
  // Start periodic metrics updates
  const metricsInterval = setInterval(async () => {
    try {
      if (!clients.has(clientId)) {
        clearInterval(metricsInterval);
        return;
      }
      
      // Generate mock real-time metrics (replace with actual data source)
      const dashboardMetrics = generateMockMetrics();
      
      // Filter metrics if specified
      let filteredMetrics = dashboardMetrics;
      if (metrics.length > 0) {
        filteredMetrics = {};
        metrics.forEach(metric => {
          if (dashboardMetrics[metric]) {
            filteredMetrics[metric] = dashboardMetrics[metric];
          }
        });
      }
      
      client.ws.send(JSON.stringify({
        type: 'metrics_update',
        payload: filteredMetrics,
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Metrics update error:', error);
    }
  }, interval);
  
  // Clear interval when client disconnects
  client.ws.on('close', () => {
    clearInterval(metricsInterval);
  });
  
  // Send confirmation
  client.ws.send(JSON.stringify({
    type: 'subscription_confirmed',
    payload: {
      topic: 'metrics',
      metrics: metrics.length > 0 ? metrics : 'all',
      interval
    }
  }));
}

/**
 * Handle event tracking
 */
async function handleEventTracking(clientId, payload) {
  const { event, data } = payload;
  
  // Broadcast event to subscribers
  broadcast('analytics', {
    type: 'analytics_update',
    payload: {
      event,
      data,
      timestamp: new Date().toISOString(),
      userId: clients.get(clientId)?.userId
    }
  });
}

/**
 * Subscribe client to a topic
 */
function subscribe(clientId, topic) {
  const client = clients.get(clientId);
  if (!client) return;
  
  client.subscriptions.add(topic);
  
  if (!subscriptions.has(topic)) {
    subscriptions.set(topic, new Set());
  }
  subscriptions.get(topic).add(clientId);
}

/**
 * Unsubscribe client from a topic
 */
function unsubscribe(clientId, topic) {
  const client = clients.get(clientId);
  if (client) {
    client.subscriptions.delete(topic);
  }
  
  if (subscriptions.has(topic)) {
    subscriptions.get(topic).delete(clientId);
    if (subscriptions.get(topic).size === 0) {
      subscriptions.delete(topic);
    }
  }
}

/**
 * Broadcast message to all subscribers of a topic
 */
function broadcast(topic, message) {
  const subscribers = subscriptions.get(topic);
  if (!subscribers) return;
  
  subscribers.forEach(clientId => {
    const client = clients.get(clientId);
    if (client && client.ws.readyState === client.ws.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${clientId}:`, error);
      }
    }
  });
}

/**
 * Generate mock real-time metrics (replace with actual data source)
 */
function generateMockMetrics() {
  return {
    activeUsers: Math.floor(Math.random() * 100) + 50,
    revenueToday: (Math.random() * 10000).toFixed(2),
    conversionRate: (Math.random() * 10).toFixed(2),
    performanceMetrics: {
      responseTime: Math.floor(Math.random() * 200) + 50,
      uptime: 99.9,
      errorRate: (Math.random() * 2).toFixed(3)
    }
  };
}

/**
 * API functions for external use
 */
const WebSocketAPI = {
  // Broadcast system notification
  broadcastNotification: (notification) => {
    broadcast('notifications', {
      type: 'notification',
      payload: notification
    });
  },
  
  // Broadcast to specific user
  sendToUser: (userId, message) => {
    for (const [clientId, client] of clients.entries()) {
      if (client.userId === userId && client.ws.readyState === client.ws.OPEN) {
        try {
          client.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending message to user ${userId}:`, error);
        }
      }
    }
  },
  
  // Get connected clients count
  getConnectionCount: () => clients.size,
  
  // Get user connection status
  isUserConnected: (userId) => {
    for (const client of clients.values()) {
      if (client.userId === userId) return true;
    }
    return false;
  }
};

// Start server
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📡 Ready for real-time connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Shutting down WebSocket server...');
  wss.clients.forEach(ws => {
    ws.close();
  });
  server.close(() => {
    console.log('✅ WebSocket server closed');
    process.exit(0);
  });
});

module.exports = { WebSocketAPI };