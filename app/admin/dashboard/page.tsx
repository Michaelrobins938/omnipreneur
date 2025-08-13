'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Users,
  DollarSign,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Database,
  Server,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Bell,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  systemUptime: number;
  apiCalls: number;
  errorRate: number;
  avgResponseTime: number;
  storageUsed: number;
  storageTotal: number;
  cpuUsage: number;
  memoryUsage: number;
  lastUpdated: string;
}

interface UserStats {
  newSignups: number;
  activeUsers: number;
  churnRate: number;
  avgSessionDuration: number;
  topSubscriptionPlan: string;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'critical';
  api: 'healthy' | 'warning' | 'critical';
  payment: 'healthy' | 'warning' | 'critical';
  storage: 'healthy' | 'warning' | 'critical';
  email: 'healthy' | 'warning' | 'critical';
}

interface RecentAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

const sampleMetrics: SystemMetrics = {
  totalUsers: 15847,
  activeUsers: 4321,
  totalRevenue: 287400.50,
  monthlyRevenue: 34200.75,
  systemUptime: 99.97,
  apiCalls: 1247853,
  errorRate: 0.23,
  avgResponseTime: 145,
  storageUsed: 1.2,
  storageTotal: 5.0,
  cpuUsage: 45,
  memoryUsage: 62,
  lastUpdated: new Date().toISOString()
};

const sampleUserStats: UserStats = {
  newSignups: 127,
  activeUsers: 4321,
  churnRate: 3.2,
  avgSessionDuration: 42.5,
  topSubscriptionPlan: 'Professional'
};

const sampleSystemHealth: SystemHealth = {
  database: 'healthy',
  api: 'healthy',
  payment: 'healthy',
  storage: 'warning',
  email: 'healthy'
};

const sampleAlerts: RecentAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High Storage Usage',
    message: 'Storage usage has reached 80% capacity',
    timestamp: '2025-01-15T10:30:00Z',
    resolved: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Scheduled Maintenance',
    message: 'Database maintenance completed successfully',
    timestamp: '2025-01-15T06:00:00Z',
    resolved: true
  }
];

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>(sampleMetrics);
  const [userStats, setUserStats] = useState<UserStats>(sampleUserStats);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(sampleSystemHealth);
  const [alerts, setAlerts] = useState<RecentAlert[]>(sampleAlerts);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In real app, fetch from admin APIs
      // const response = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`, {
      //   credentials: 'include'
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   setMetrics(data.data.metrics);
      //   setUserStats(data.data.userStats);
      //   setSystemHealth(data.data.systemHealth);
      //   setAlerts(data.data.alerts);
      // }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      default: return Clock;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-zinc-400 mt-2">System overview and management tools</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* System Health Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            System Health
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(systemHealth).map(([service, status]) => {
              const HealthIcon = getHealthIcon(status);
              return (
                <div key={service} className="text-center">
                  <div className={`w-12 h-12 ${getHealthColor(status)} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <HealthIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-white capitalize">{service}</h3>
                  <p className={`text-sm capitalize ${getHealthColor(status).split(' ')[0]}`}>
                    {status}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(metrics.totalUsers)}</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{formatNumber(userStats.newSignups)} this month
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(metrics.monthlyRevenue)}</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% vs last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">System Uptime</p>
                <p className="text-2xl font-bold text-white">{metrics.systemUptime}%</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  All systems operational
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">API Calls</p>
                <p className="text-2xl font-bold text-white">{formatNumber(metrics.apiCalls)}</p>
                <p className="text-blue-400 text-sm flex items-center mt-1">
                  <Zap className="w-3 h-3 mr-1" />
                  {metrics.avgResponseTime}ms avg response
                </p>
              </div>
              <Server className="w-8 h-8 text-orange-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Resource Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Cpu className="w-5 h-5 mr-2" />
              Resource Usage
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400">CPU Usage</span>
                  <span className="text-white">{metrics.cpuUsage}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.cpuUsage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400">Memory Usage</span>
                  <span className="text-white">{metrics.memoryUsage}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.memoryUsage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400">Storage</span>
                  <span className="text-white">{metrics.storageUsed}TB / {metrics.storageTotal}TB</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(metrics.storageUsed / metrics.storageTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map(alert => {
                  const AlertIcon = getAlertIcon(alert.type);
                  return (
                    <div key={alert.id} className="p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertIcon className={`w-5 h-5 mt-0.5 ${getAlertColor(alert.type)}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{alert.title}</h4>
                          <p className="text-zinc-400 text-sm">{alert.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-zinc-500 text-xs">
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                            {alert.resolved ? (
                              <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded">
                                Resolved
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-zinc-400 text-center py-4">No recent alerts</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              href="/admin/users"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-center"
            >
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <span className="text-sm text-white">Manage Users</span>
            </Link>

            <Link
              href="/admin/system"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-center"
            >
              <Settings className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <span className="text-sm text-white">System Config</span>
            </Link>

            <Link
              href="/admin/monitoring"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-center"
            >
              <BarChart3 className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <span className="text-sm text-white">Monitoring</span>
            </Link>

            <Link
              href="/admin/logs"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-center"
            >
              <Eye className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <span className="text-sm text-white">View Logs</span>
            </Link>

            <Link
              href="/admin/backups"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-center"
            >
              <Database className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <span className="text-sm text-white">Backups</span>
            </Link>

            <Link
              href="/admin/security"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-center"
            >
              <Shield className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <span className="text-sm text-white">Security</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}