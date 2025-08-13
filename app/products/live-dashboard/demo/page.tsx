"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Share2,
  Settings,
  Eye,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Globe,
  PieChart,
  LineChart,
  Smartphone,
  Desktop,
  Tablet
} from 'lucide-react';

export default function LiveDashboardDemo() {
  const [currentMetrics, setCurrentMetrics] = useState({
    revenue: 124750,
    users: 15420,
    conversions: 8.2,
    growth: 23.5,
    activeUsers: 3742,
    pageViews: 89643,
    avgSession: 4.2,
    bounceRate: 24.3
  });

  const [isLive, setIsLive] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setCurrentMetrics(prev => ({
          ...prev,
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
          pageViews: prev.pageViews + Math.floor(Math.random() * 50),
          revenue: prev.revenue + Math.floor(Math.random() * 1000),
          users: prev.users + Math.floor(Math.random() * 10)
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentMetrics(prev => ({
      ...prev,
      revenue: prev.revenue + Math.floor(Math.random() * 5000),
      users: prev.users + Math.floor(Math.random() * 100),
      conversions: parseFloat((Math.random() * 2 + 7).toFixed(1)),
      growth: parseFloat((Math.random() * 10 + 20).toFixed(1))
    }));
    setRefreshing(false);
  };

  const chartData = [
    { time: '12:00', revenue: 45000, users: 1200, sessions: 3400 },
    { time: '13:00', revenue: 52000, users: 1350, sessions: 3800 },
    { time: '14:00', revenue: 61000, users: 1480, sessions: 4200 },
    { time: '15:00', revenue: 58000, users: 1420, sessions: 3900 },
    { time: '16:00', revenue: 72000, users: 1680, sessions: 4600 },
    { time: '17:00', revenue: 85000, users: 1920, sessions: 5100 },
    { time: '18:00', revenue: 124750, users: 2140, sessions: 5800 }
  ];

  const deviceData = [
    { device: 'Desktop', percentage: 45.2, users: 6942, color: 'bg-blue-500' },
    { device: 'Mobile', percentage: 38.7, users: 5967, color: 'bg-green-500' },
    { device: 'Tablet', percentage: 16.1, users: 2511, color: 'bg-purple-500' }
  ];

  const topPages = [
    { page: '/dashboard', views: 23456, change: +12.3 },
    { page: '/products', views: 18432, change: +8.7 },
    { page: '/analytics', views: 15678, change: +15.2 },
    { page: '/settings', views: 12345, change: -2.1 },
    { page: '/reports', views: 9876, change: +5.4 }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/products/live-dashboard" className="flex items-center text-zinc-400 hover:text-zinc-300 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Live Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${isLive ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700/50 text-zinc-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-zinc-400'}`} />
                {isLive ? 'Live Updates' : 'Paused'}
              </div>
              <button
                onClick={() => setIsLive(!isLive)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                {isLive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1 
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Live Analytics Dashboard
            </motion.h1>
            <p className="text-zinc-400">Real-time business intelligence and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUp className="w-4 h-4 mr-1" />
                +{currentMetrics.growth}%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${currentMetrics.revenue.toLocaleString()}
            </div>
            <div className="text-sm text-zinc-400">Total Revenue</div>
          </motion.div>

          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center text-blue-400 text-sm">
                <ArrowUp className="w-4 h-4 mr-1" />
                +12.3%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentMetrics.users.toLocaleString()}
            </div>
            <div className="text-sm text-zinc-400">Total Users</div>
          </motion.div>

          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex items-center text-orange-400 text-sm">
                <Eye className="w-4 h-4 mr-1" />
                Live
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentMetrics.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm text-zinc-400">Active Users</div>
          </motion.div>

          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center text-purple-400 text-sm">
                <ArrowUp className="w-4 h-4 mr-1" />
                +{currentMetrics.conversions}%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentMetrics.conversions}%
            </div>
            <div className="text-sm text-zinc-400">Conversion Rate</div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">Last 7 hours</span>
              </div>
            </div>
            
            <div className="h-48 flex items-end space-x-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${(data.revenue / 125000) * 100}%` }}
                  />
                  <div className="text-xs text-zinc-400 mt-2">{data.time}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div 
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Device Analytics</h3>
              <PieChart className="w-5 h-5 text-zinc-400" />
            </div>
            
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${device.color}`} />
                    <span className="text-zinc-300">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-zinc-400 text-sm">{device.users.toLocaleString()}</span>
                    <span className="text-white font-semibold">{device.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <div className="text-sm text-zinc-400">
                Total Sessions: <span className="text-white font-semibold">15,420</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Pages Table */}
        <motion.div 
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Performing Pages</h3>
            <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
              <span className="text-sm">View All</span>
              <ArrowUp className="w-4 h-4 rotate-45" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-zinc-400 text-sm font-medium py-3">Page</th>
                  <th className="text-left text-zinc-400 text-sm font-medium py-3">Views</th>
                  <th className="text-left text-zinc-400 text-sm font-medium py-3">Change</th>
                  <th className="text-left text-zinc-400 text-sm font-medium py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => (
                  <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4">
                      <span className="text-white font-medium">{page.page}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-zinc-300">{page.views.toLocaleString()}</span>
                    </td>
                    <td className="py-4">
                      <div className={`flex items-center space-x-1 ${page.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {page.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        <span className="text-sm font-medium">{Math.abs(page.change)}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-1">
                        {[...Array(7)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-1 rounded-full ${Math.random() > 0.3 ? 'bg-green-400' : 'bg-zinc-600'}`}
                            style={{ height: `${Math.random() * 20 + 10}px` }}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          className="mt-8 flex items-center justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/products/live-dashboard/docs">
            <button className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>View Documentation</span>
            </button>
          </Link>
          
          <Link href="/products/live-dashboard">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Get Live Dashboard</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}