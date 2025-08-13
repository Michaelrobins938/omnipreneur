'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Zap,
  Target,
  Brain,
  Loader2,
  AlertTriangle,
  Crown,
  Activity,
  PieChart,
  LineChart,
  Eye,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    totalUsers: number;
    userGrowth: number;
    conversionRate: number;
    conversionGrowth: number;
    averageOrderValue: number;
    aovGrowth: number;
  };
  traffic: {
    sessions: number;
    pageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
    topPages: Array<{ page: string; views: number; engagement: number }>;
    trafficSources: Array<{ source: string; sessions: number; percentage: number }>;
  };
  products: {
    topProducts: Array<{ 
      name: string; 
      revenue: number; 
      usage: number; 
      satisfaction: number;
      growth: number;
    }>;
    categoryPerformance: Array<{ category: string; revenue: number; users: number }>;
  };
  users: {
    activeUsers: number;
    newUsers: number;
    churnRate: number;
    lifetimeValue: number;
    userSegments: Array<{ segment: string; count: number; value: number }>;
    retention: Array<{ period: string; rate: number }>;
  };
  ai: {
    apiCalls: number;
    processingTime: number;
    successRate: number;
    costOptimization: number;
    modelPerformance: Array<{ model: string; usage: number; cost: number; performance: number }>;
  };
  predictions: {
    revenueNext30Days: number;
    confidenceLevel: number;
    growthOpportunities: Array<{ opportunity: string; impact: string; probability: number }>;
    risks: Array<{ risk: string; severity: string; probability: number }>;
  };
}

export default function PremiumAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedView, setSelectedView] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/insights?range=${timeRange}&premium=true`, {
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else if (response.status === 403) {
        throw new Error('Premium subscription required');
      } else {
        throw new Error('Failed to load analytics');
      }
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading premium analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Premium Analytics</h1>
            <p className="text-zinc-400 mb-6">{error}</p>
            <div className="space-x-4">
              <Link href="/pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block">
                Upgrade Now
              </Link>
              <Link href="/dashboard" className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors inline-block">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold">Premium Analytics</h1>
              </div>
              <p className="text-zinc-400 mt-2">Advanced insights and predictive analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:border-green-500 hover:text-green-400 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'traffic', label: 'Traffic', icon: Activity },
              { id: 'products', label: 'Products', icon: Target },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'ai', label: 'AI Performance', icon: Brain },
              { id: 'predictions', label: 'Predictions', icon: Zap }
            ].map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    selectedView === view.id
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Dashboard */}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className={`w-5 h-5 ${getGrowthColor(data.overview.revenueGrowth)}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Total Revenue</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(data.overview.totalRevenue)}</p>
                <p className={`text-sm mt-1 ${getGrowthColor(data.overview.revenueGrowth)}`}>
                  {formatPercentage(data.overview.revenueGrowth)} vs last period
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className={`w-5 h-5 ${getGrowthColor(data.overview.userGrowth)}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Active Users</h3>
                <p className="text-3xl font-bold text-white mt-2">{data.overview.totalUsers.toLocaleString()}</p>
                <p className={`text-sm mt-1 ${getGrowthColor(data.overview.userGrowth)}`}>
                  {formatPercentage(data.overview.userGrowth)} vs last period
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className={`w-5 h-5 ${getGrowthColor(data.overview.conversionGrowth)}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Conversion Rate</h3>
                <p className="text-3xl font-bold text-white mt-2">{data.overview.conversionRate.toFixed(2)}%</p>
                <p className={`text-sm mt-1 ${getGrowthColor(data.overview.conversionGrowth)}`}>
                  {formatPercentage(data.overview.conversionGrowth)} vs last period
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className={`w-5 h-5 ${getGrowthColor(data.overview.aovGrowth)}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Avg Order Value</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(data.overview.averageOrderValue)}</p>
                <p className={`text-sm mt-1 ${getGrowthColor(data.overview.aovGrowth)}`}>
                  {formatPercentage(data.overview.aovGrowth)} vs last period
                </p>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Revenue Trend</h3>
                  <LineChart className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-full h-40 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-end justify-between p-4">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div key={i} className={`bg-green-500 rounded-t w-8`} style={{ height: `${Math.random() * 100 + 20}%` }}></div>
                      ))}
                    </div>
                    <p className="text-zinc-400 text-sm mt-4">Revenue trending upward with strong growth</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">User Growth</h3>
                  <PieChart className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                      <div className="text-2xl font-bold text-white">{formatPercentage(data.overview.userGrowth)}</div>
                    </div>
                    <p className="text-zinc-400 text-sm">User acquisition exceeding targets</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* AI Performance View */}
        {selectedView === 'ai' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">API Calls</h3>
                <p className="text-3xl font-bold text-white mt-2">{data.ai.apiCalls.toLocaleString()}</p>
                <p className="text-sm text-zinc-400 mt-1">Last {timeRange}</p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Avg Processing Time</h3>
                <p className="text-3xl font-bold text-white mt-2">{data.ai.processingTime}ms</p>
                <p className="text-sm text-green-400 mt-1">-12% faster</p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Success Rate</h3>
                <p className="text-3xl font-bold text-white mt-2">{data.ai.successRate.toFixed(1)}%</p>
                <p className="text-sm text-green-400 mt-1">+2.3% improvement</p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Cost Optimization</h3>
                <p className="text-3xl font-bold text-white mt-2">{data.ai.costOptimization.toFixed(1)}%</p>
                <p className="text-sm text-green-400 mt-1">Cost savings vs baseline</p>
              </div>
            </div>

            {/* AI Model Performance */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Model Performance Breakdown</h3>
              <div className="space-y-4">
                {data.ai.modelPerformance.map((model, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{model.model}</h4>
                        <p className="text-sm text-zinc-400">{model.usage.toLocaleString()} requests</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{formatCurrency(model.cost)}</div>
                        <div className="text-sm text-zinc-400">{model.performance.toFixed(1)}% accuracy</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Predictions View */}
        {selectedView === 'predictions' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Revenue Forecast</h3>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">
                    {formatCurrency(data.predictions.revenueNext30Days)}
                  </p>
                  <p className="text-zinc-400 mb-4">Predicted revenue next 30 days</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-zinc-400">
                      {data.predictions.confidenceLevel}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Growth Opportunities</h3>
                </div>
                <div className="space-y-3">
                  {data.predictions.growthOpportunities.slice(0, 3).map((opp, index) => (
                    <div key={index} className="p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">{opp.opportunity}</p>
                          <p className="text-xs text-zinc-400">{opp.impact} impact</p>
                        </div>
                        <div className="text-right">
                          <span className="text-green-400 text-sm font-medium">
                            {opp.probability}% likely
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Risk Assessment</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {data.predictions.risks.map((risk, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{risk.risk}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.severity === 'High' ? 'bg-red-900 text-red-300' :
                        risk.severity === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {risk.probability}% probability
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}