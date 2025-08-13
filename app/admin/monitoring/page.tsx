"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  Database,
  Cpu,
  HardDrive,
  Globe
} from 'lucide-react';
import { apiGet } from '@/lib/client/fetch';
import { useErrorHandler } from '@/app/hooks/useErrorHandler';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  database: {
    connected: boolean;
    responseTime: number;
    connections: number;
  };
  api: {
    responseTime: number;
    errorRate: number;
    requestsPerMinute: number;
  };
  memory: {
    usage: number;
    total: number;
    percentage: number;
  };
  uptime: number;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userId?: string;
  endpoint?: string;
  userAgent?: string;
}

interface RealTimeMetrics {
  activeUsers: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorCount: number;
  successRate: number;
}

export default function MonitoringDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { handleApiError } = useErrorHandler();

  useEffect(() => {
    fetchMonitoringData();
    
    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchMonitoringData, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchMonitoringData = async () => {
    try {
      const [healthResponse, logsResponse, metricsResponse] = await Promise.all([
        apiGet('/api/admin/monitoring/health'),
        apiGet('/api/admin/monitoring/logs?limit=20'),
        apiGet('/api/admin/monitoring/metrics')
      ]);

      if (healthResponse.success) {
        setSystemHealth(healthResponse.data);
      }

      if (logsResponse.success) {
        setErrorLogs(logsResponse.data);
      }

      if (metricsResponse.success) {
        setRealTimeMetrics(metricsResponse.data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/10';
      case 'warning': return 'text-orange-400 bg-orange-500/10';
      case 'critical': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400 bg-red-500/10';
      case 'warning': return 'text-orange-400 bg-orange-500/10';
      case 'info': return 'text-blue-400 bg-blue-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Activity className="w-8 h-8 mr-3 text-blue-500" />
              System Monitoring
            </h1>
            <p className="text-zinc-400 mt-2">
              Real-time system health and performance metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-zinc-400">Auto-refresh</span>
            </label>
            
            <button
              onClick={fetchMonitoringData}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* System Status Overview */}
        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(systemHealth.status)}`}>
                  {systemHealth.status}
                </span>
              </div>
              <div className="flex items-center">
                {systemHealth.status === 'healthy' ? (
                  <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-orange-400 mr-3" />
                )}
                <div>
                  <p className="text-sm text-zinc-400">Uptime</p>
                  <p className="text-xl font-bold">{formatUptime(systemHealth.uptime)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Database</h3>
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status</span>
                  <span className={systemHealth.database.connected ? 'text-green-400' : 'text-red-400'}>
                    {systemHealth.database.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Response Time</span>
                  <span className="text-white">{systemHealth.database.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Connections</span>
                  <span className="text-white">{systemHealth.database.connections}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">API Performance</h3>
                <Server className="w-6 h-6 text-green-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Response Time</span>
                  <span className="text-white">{systemHealth.api.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Error Rate</span>
                  <span className={systemHealth.api.errorRate > 5 ? 'text-red-400' : 'text-green-400'}>
                    {systemHealth.api.errorRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Requests/min</span>
                  <span className="text-white">{systemHealth.api.requestsPerMinute}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Memory Usage</h3>
                <Cpu className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Used</span>
                  <span className="text-white">{(systemHealth.memory.usage / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-white">{(systemHealth.memory.total / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      systemHealth.memory.percentage > 80 ? 'bg-red-500' :
                      systemHealth.memory.percentage > 60 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${systemHealth.memory.percentage}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-zinc-400">
                  {systemHealth.memory.percentage.toFixed(1)}% used
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Real-time Metrics */}
        {realTimeMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-zinc-900 rounded-xl p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-sm text-zinc-400">Active Users</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-sm text-zinc-400">Requests/sec</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.requestsPerSecond}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-zinc-400">Avg Response</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.averageResponseTime}ms</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
                <div>
                  <p className="text-sm text-zinc-400">Errors</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.errorCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mr-3" />
                <div>
                  <p className="text-sm text-zinc-400">Success Rate</p>
                  <p className="text-2xl font-bold">{realTimeMetrics.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Logs */}
        <div className="bg-zinc-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Error Logs</h2>
            <span className="text-zinc-400 text-sm">Last 20 entries</span>
          </div>

          <div className="space-y-3">
            {errorLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getLogLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-zinc-400 text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      {log.endpoint && (
                        <span className="text-blue-400 text-sm">
                          {log.endpoint}
                        </span>
                      )}
                    </div>
                    <p className="text-white mb-2">{log.message}</p>
                    {log.stack && (
                      <details className="text-zinc-400 text-sm">
                        <summary className="cursor-pointer">Stack trace</summary>
                        <pre className="mt-2 p-2 bg-zinc-900 rounded text-xs overflow-auto">
                          {log.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {errorLogs.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-400 mb-2">No Recent Errors</h3>
                <p className="text-zinc-400">System is running smoothly</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}