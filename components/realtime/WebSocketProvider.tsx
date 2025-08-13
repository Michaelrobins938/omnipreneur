'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  id?: string;
}

interface WebSocketState {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  retryCount: number;
  ping: number;
}

interface WebSocketContextValue {
  state: WebSocketState;
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (eventType: string, callback: (payload: any) => void) => () => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  url?: string;
  reconnectInterval?: number;
  maxRetries?: number;
  children: React.ReactNode;
}

export function WebSocketProvider({
  url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  reconnectInterval = 3000,
  maxRetries = 5,
  children
}: WebSocketProviderProps) {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    lastMessage: null,
    connectionStatus: 'disconnected',
    retryCount: 0,
    ping: 0
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();
  const lastPingRef = useRef<number>(0);
  const subscribersRef = useRef<Map<string, Set<(payload: any) => void>>>(new Map());

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          connectionStatus: 'connected',
          retryCount: 0
        }));

        // Start ping-pong to measure latency
        startPingPong();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // Handle pong response
          if (message.type === 'pong') {
            const ping = Date.now() - lastPingRef.current;
            setState(prev => ({ ...prev, ping }));
            return;
          }

          setState(prev => ({ ...prev, lastMessage: message }));

          // Notify subscribers
          const subscribers = subscribersRef.current.get(message.type);
          if (subscribers) {
            subscribers.forEach(callback => callback(message.payload));
          }

          // Notify wildcard subscribers
          const wildcardSubscribers = subscribersRef.current.get('*');
          if (wildcardSubscribers) {
            wildcardSubscribers.forEach(callback => callback(message));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          connectionStatus: 'disconnected'
        }));

        stopPingPong();
        scheduleReconnect();
      };

      ws.onerror = () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          connectionStatus: 'error'
        }));
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setState(prev => ({
        ...prev,
        connectionStatus: 'error'
      }));
      scheduleReconnect();
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    stopPingPong();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      connectionStatus: 'disconnected'
    }));
  };

  const scheduleReconnect = () => {
    if (state.retryCount >= maxRetries) {
      setState(prev => ({ ...prev, connectionStatus: 'error' }));
      return;
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }));
      connect();
    }, reconnectInterval);
  };

  const startPingPong = () => {
    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        lastPingRef.current = Date.now();
        sendMessage({ type: 'ping', payload: {}, timestamp: new Date().toISOString() });
      }
    }, 30000); // Ping every 30 seconds
  };

  const stopPingPong = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  };

  const subscribe = (eventType: string, callback: (payload: any) => void) => {
    if (!subscribersRef.current.has(eventType)) {
      subscribersRef.current.set(eventType, new Set());
    }
    subscribersRef.current.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = subscribersRef.current.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          subscribersRef.current.delete(eventType);
        }
      }
    };
  };

  const reconnect = () => {
    disconnect();
    setState(prev => ({ ...prev, retryCount: 0 }));
    setTimeout(connect, 1000);
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const contextValue: WebSocketContextValue = {
    state,
    sendMessage,
    subscribe,
    reconnect
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
      <WebSocketStatusIndicator />
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

// Real-time data hooks
export function useRealtimeData<T>(eventType: string, initialData?: T) {
  const [data, setData] = useState<T | undefined>(initialData);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(eventType, (payload: T) => {
      setData(payload);
    });

    return unsubscribe;
  }, [eventType, subscribe]);

  return data;
}

export function useRealtimeMetrics() {
  return useRealtimeData('metrics');
}

export function useRealtimeNotifications() {
  return useRealtimeData('notification');
}

export function useRealtimeUserActivity() {
  return useRealtimeData('user_activity');
}

export function useRealtimeSystemHealth() {
  return useRealtimeData('system_health');
}

// WebSocket status indicator component
function WebSocketStatusIndicator() {
  const { state, reconnect } = useWebSocket();
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = () => {
    switch (state.connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'disconnected': return 'bg-zinc-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-zinc-500';
    }
  };

  const getStatusIcon = () => {
    switch (state.connectionStatus) {
      case 'connected': return <Wifi className="w-3 h-3" />;
      case 'connecting': return <Activity className="w-3 h-3 animate-spin" />;
      case 'error': return <AlertTriangle className="w-3 h-3" />;
      default: return <WifiOff className="w-3 h-3" />;
    }
  };

  const getStatusText = () => {
    switch (state.connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <Badge
          variant="outline"
          className={`cursor-pointer transition-all duration-300 ${
            state.connectionStatus === 'connected' 
              ? 'border-green-500 text-green-400 hover:bg-green-900/20' 
              : state.connectionStatus === 'error'
              ? 'border-red-500 text-red-400 hover:bg-red-900/20'
              : 'border-zinc-500 text-zinc-400 hover:bg-zinc-800'
          }`}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor()}`} />
          {getStatusIcon()}
          <span className="ml-2">{getStatusText()}</span>
          {state.connectionStatus === 'connected' && state.ping > 0 && (
            <span className="ml-2 text-xs opacity-60">{state.ping}ms</span>
          )}
        </Badge>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-2 p-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg min-w-[200px]"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className={`capitalize ${
                    state.connectionStatus === 'connected' ? 'text-green-400' :
                    state.connectionStatus === 'error' ? 'text-red-400' :
                    'text-zinc-300'
                  }`}>
                    {state.connectionStatus}
                  </span>
                </div>
                
                {state.connectionStatus === 'connected' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Latency:</span>
                      <span className="text-zinc-300">{state.ping}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Last Message:</span>
                      <span className="text-zinc-300">
                        {state.lastMessage ? new Date(state.lastMessage.timestamp).toLocaleTimeString() : 'None'}
                      </span>
                    </div>
                  </>
                )}

                {state.retryCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Retries:</span>
                    <span className="text-yellow-400">{state.retryCount}</span>
                  </div>
                )}

                {state.connectionStatus !== 'connected' && (
                  <button
                    onClick={reconnect}
                    className="w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                  >
                    Reconnect
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Real-time notification system
export function useRealtimeNotificationSystem() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    duration?: number;
  }>>([]);

  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe('notification', (notification) => {
      const newNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date()
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto-remove after duration
      if (notification.duration !== 0) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, notification.duration || 5000);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, removeNotification };
}

// Live analytics component
export function LiveAnalytics() {
  const metrics = useRealtimeMetrics();
  const systemHealth = useRealtimeSystemHealth();
  const userActivity = useRealtimeUserActivity();

  return (
    <div className="space-y-4">
      {metrics && (
        <motion.div
          key={JSON.stringify(metrics)}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Live Metrics</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">Active Users:</span>
              <span className="text-white ml-2">{metrics.activeUsers}</span>
            </div>
            <div>
              <span className="text-zinc-400">AI Requests:</span>
              <span className="text-white ml-2">{metrics.aiRequests}</span>
            </div>
            <div>
              <span className="text-zinc-400">Revenue:</span>
              <span className="text-white ml-2">${metrics.revenue}</span>
            </div>
          </div>
        </motion.div>
      )}

      {systemHealth && (
        <motion.div
          key={JSON.stringify(systemHealth)}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-lg border ${
            systemHealth.status === 'healthy' 
              ? 'bg-green-900/20 border-green-800' 
              : 'bg-red-900/20 border-red-800'
          }`}
        >
          <h3 className="text-lg font-semibold text-white mb-2">System Health</h3>
          <div className="flex items-center space-x-2">
            {systemHealth.status === 'healthy' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <span className={`capitalize ${
              systemHealth.status === 'healthy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {systemHealth.status}
            </span>
          </div>
        </motion.div>
      )}

      {userActivity && (
        <motion.div
          key={JSON.stringify(userActivity)}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
          <p className="text-zinc-300 text-sm">{userActivity.description}</p>
          <p className="text-zinc-400 text-xs mt-1">
            {new Date(userActivity.timestamp).toLocaleTimeString()}
          </p>
        </motion.div>
      )}
    </div>
  );
}