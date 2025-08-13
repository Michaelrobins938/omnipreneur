#!/usr/bin/env node

// Standalone WebSocket Server Starter
const { getRealtimeServer } = require('../lib/websocket/server.ts');

console.log('Starting WebSocket server...');

// Initialize the WebSocket server
const server = getRealtimeServer();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nWebSocket server terminated');
  server.close();
  process.exit(0);
});

console.log('WebSocket server started successfully');
console.log('Press Ctrl+C to stop the server');

// Keep the process alive
setInterval(() => {
  // Health check or periodic tasks can go here
}, 30000);