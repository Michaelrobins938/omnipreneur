#!/usr/bin/env node
// @ts-nocheck
/**
 * WebSocket Server Startup Script
 * 
 * This script starts the WebSocket server for real-time communications.
 * Run with: npm run ws:start or node scripts/start-websocket.ts
 */

import { wsServer } from '../lib/websocket/server';

async function startWebSocketServer() {
  try {
    console.log('🚀 Starting Omnipreneur WebSocket Server...');
    
    // Start the WebSocket server
    await wsServer.start();
    
    console.log('✅ WebSocket Server successfully started!');
    console.log(`📡 Listening on port ${process.env.WS_PORT || 3001}`);
    console.log('📊 Broadcasting real-time analytics and notifications');
    
    // Log server stats periodically
    setInterval(() => {
      const stats = wsServer.getStats();
      console.log(`📈 Stats: ${stats.connectedClients} clients, ${stats.activeSubscriptions} subscriptions, ${Math.floor(stats.uptime)}s uptime`);
    }, 60000); // Every minute

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT. Gracefully shutting down WebSocket server...');
      wsServer.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM. Gracefully shutting down WebSocket server...');
      wsServer.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start WebSocket server:', error);
    process.exit(1);
  }
}

// Start the server
startWebSocketServer();