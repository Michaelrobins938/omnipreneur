'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface RealTimeMetrics {
  activeUsers: number;
  revenueToday: number;
  conversionRate: number;
  topProducts: Array<{ productId: string; usage: number }>;
  recentActivity: Array<any>;
  performanceMetrics: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
  realTimeStats: {
    sessionsActive: number;
    eventsPerMinute: number;
    currentLoad: number;
  };
}

interface AnalyticsData {
  realtime: {
    totalEvents: number;
    events: Array<any>;
    metrics: any;
    trends: any;
  };
  dashboard: RealTimeMetrics;
  timestamp: string;
}

export default function RealTimeAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    connectWebSocket();
    fetchInitialData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const connectWebSocket = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Get auth token
      const token = localStorage.getItem('auth_token') || 'demo_token';
      
      // Connect to WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/analytics/websocket?token=${token}`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Subscribe to metrics updates
        ws.send(JSON.stringify({
          type: 'subscribe_metrics',
          payload: {
            metrics: ['activeUsers', 'revenueToday', 'conversionRate', 'performanceMetrics'],
            interval: 5000 // Update every 5 seconds
          }
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Retry connection after 5 seconds
        retryTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };
      
      wsRef.current = ws;
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('disconnected');
      
      // Retry after 5 seconds
      retryTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 5000);
    }
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'connected':
        console.log('WebSocket connection confirmed');
        break;
        
      case 'initial_analytics':
      case 'analytics_snapshot':
        setAnalyticsData(message.payload);
        break;
        
      case 'metrics_update':
        setAnalyticsData(prev => prev ? {
          ...prev,
          dashboard: { ...prev.dashboard, ...message.payload },
          timestamp: message.timestamp
        } : null);
        break;
        
      case 'analytics_update':
        // Handle real-time event updates
        setAnalyticsData(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            realtime: {
              ...prev.realtime,
              totalEvents: prev.realtime.totalEvents + 1,
              events: [...prev.realtime.events.slice(-99), message.payload]
            }
          };
        });
        break;
        
      case 'error':
        console.error('WebSocket error message:', message.message);
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const fetchInitialData = async () => {
    try {
      const response = await fetch('/api/analytics/real-time?timeRange=24h');
      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch initial analytics data:', error);
    }
  };

  const trackEvent = (event: string, data: any = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'track_event',
        payload: { event, data }
      }));
    }
  };

  if (!analyticsData) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading real-time analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const { dashboard, realtime } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Real-Time Analytics</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-zinc-400 capitalize">{connectionStatus}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={dashboard.activeUsers}
          icon={<Users className="w-5 h-5" />}
          trend={realtime.trends?.growth || 0}
          color="blue"
        />
        
        <MetricCard
          title="Revenue Today"
          value={`$${dashboard.revenueToday.toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={15.3}
          color="green"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${dashboard.conversionRate.toFixed(1)}%`}
          icon={<Target className="w-5 h-5" />}
          trend={-2.1}
          color="purple"
        />
        
        <MetricCard
          title="Events/Min"
          value={dashboard.realTimeStats.eventsPerMinute}
          icon={<Activity className="w-5 h-5" />}
          trend={8.7}
          color="orange"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Metrics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Response Time</span>
              <span className="text-white font-medium">
                {dashboard.performanceMetrics.avgResponseTime.toFixed(0)}ms
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Success Rate</span>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-white font-medium">
                  {dashboard.performanceMetrics.successRate.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Error Rate</span>
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-white font-medium">
                  {dashboard.performanceMetrics.errorRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            System Status
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Active Sessions</span>
              <span className="text-white font-medium">
                {dashboard.realTimeStats.sessionsActive}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">System Load</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-zinc-700 rounded-full mr-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, dashboard.realTimeStats.currentLoad)}%` }}
                  />
                </div>
                <span className="text-white font-medium">
                  {dashboard.realTimeStats.currentLoad.toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Last Updated</span>
              <span className="text-white font-medium text-sm">
                {new Date(analyticsData.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {dashboard.recentActivity.slice(-10).map((activity, index) => (
            <motion.div
              key={activity.timestamp || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between py-2 px-3 bg-zinc-800/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-white text-sm">
                  {activity.event || 'Unknown Event'}
                </span>
              </div>
              <span className="text-zinc-400 text-xs">
                {activity.timestamp ? 
                  new Date(activity.timestamp).toLocaleTimeString() : 
                  'Just now'
                }
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Debug Panel */}
      <button
        onClick={() => trackEvent('test_event', { source: 'debug_panel' })}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Send Test Event
      </button>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, icon, trend, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm ${
          trend >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
      
      <div>
        <p className="text-zinc-400 text-sm mb-1">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}