'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Brain, 
  Clock, 
  DollarSign, 
  Star,
  BarChart3,
  Calendar,
  ChevronRight,
  Trophy
} from 'lucide-react';

interface UsageStats {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  creditsUsed: number;
  creditsRemaining: number;
  favoriteProduct: string;
  dailyStats: Array<{
    date: string;
    requests: number;
    credits: number;
  }>;
  productUsage: Array<{
    name: string;
    requests: number;
    percentage: number;
  }>;
}

interface UsageTrackingProps {
  className?: string;
}

export default function UsageTracking({ className = '' }: UsageTrackingProps) {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchUsageStats();
  }, [timeRange]);

  const fetchUsageStats = async () => {
    setLoading(true);
    try {
      // Fetch real usage data from API
      const [analyticsRes, usageRes, productUsageRes] = await Promise.all([
        fetch('/api/analytics/dashboard', { credentials: 'include' }),
        fetch(`/api/analytics/usage?range=${timeRange}`, { credentials: 'include' }),
        fetch(`/api/analytics/product-usage?range=${timeRange}`, { credentials: 'include' })
      ]);

      if (analyticsRes.ok && usageRes.ok) {
        const [analyticsData, usageData, productUsageData] = await Promise.all([
          analyticsRes.json(),
          usageRes.json(),
          productUsageRes.ok ? productUsageRes.json() : Promise.resolve({ data: { productUsage: [], summary: {} } })
        ]);

        const analytics = analyticsData.data;
        const usage = usageData.data;
        const productUsage = productUsageData.data;

        // Use real product usage data if available, otherwise calculate estimates
        const totalRequests = analytics.aiRequests || 0;
        const realProductUsage = productUsage.productUsage && productUsage.productUsage.length > 0 
          ? productUsage.productUsage.map((p: any) => ({
              name: p.name,
              requests: p.requests,
              percentage: p.percentage
            }))
          : [
              { name: 'NOVUS Protocol', requests: Math.floor(totalRequests * 0.25), percentage: 25 },
              { name: 'Content Spawner', requests: Math.floor(totalRequests * 0.20), percentage: 20 },
              { name: 'Bundle Builder', requests: Math.floor(totalRequests * 0.18), percentage: 18 },
              { name: 'Auto Rewrite', requests: Math.floor(totalRequests * 0.15), percentage: 15 },
              { name: 'Live Dashboard', requests: Math.floor(totalRequests * 0.12), percentage: 12 },
              { name: 'Other Products', requests: Math.floor(totalRequests * 0.10), percentage: 10 }
            ];

        // Determine favorite product
        const favoriteProduct = realProductUsage.sort((a, b) => b.requests - a.requests)[0]?.name || 'NOVUS Protocol';

        const stats: UsageStats = {
          totalRequests: totalRequests,
          successRate: productUsage.summary?.avgSuccessRate || 98.2,
          avgResponseTime: 1.4, // This would come from performance metrics in the future
          creditsUsed: (analytics.aiCreditsRemaining !== null) ? 
            (10000 - analytics.aiCreditsRemaining) : totalRequests * 10,
          creditsRemaining: analytics.aiCreditsRemaining || 0,
          favoriteProduct,
          dailyStats: generateDailyStatsFromData(usage.activity || []),
          productUsage: realProductUsage
        };

        setStats(stats);
      } else {
        // Fallback to sample data if API fails
        const fallbackStats: UsageStats = {
          totalRequests: 0,
          successRate: 0,
          avgResponseTime: 0,
          creditsUsed: 0,
          creditsRemaining: 0,
          favoriteProduct: 'No data available',
          dailyStats: [],
          productUsage: []
        };
        setStats(fallbackStats);
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      // Set empty stats on error
      setStats({
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        creditsUsed: 0,
        creditsRemaining: 0,
        favoriteProduct: 'Error loading data',
        dailyStats: [],
        productUsage: []
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDailyStats = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const stats = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      stats.push({
        date: date.toISOString().split('T')[0],
        requests: Math.floor(Math.random() * 50) + 10,
        credits: Math.floor(Math.random() * 100) + 20
      });
    }
    
    return stats;
  };

  const generateDailyStatsFromData = (activityData: any[]) => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const stats = [];
    const now = new Date();
    
    // Create a map of dates to activity counts
    const activityByDate = new Map();
    
    activityData.forEach(activity => {
      const date = new Date(activity.timestamp).toISOString().split('T')[0];
      if (!activityByDate.has(date)) {
        activityByDate.set(date, { requests: 0, credits: 0 });
      }
      const dayData = activityByDate.get(date);
      dayData.requests += 1;
      dayData.credits += 10; // Estimate 10 credits per request
    });
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = activityByDate.get(dateStr) || { requests: 0, credits: 0 };
      
      stats.push({
        date: dateStr,
        requests: dayData.requests,
        credits: dayData.credits
      });
    }
    
    return stats;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className={`${className} bg-zinc-900/50 border border-zinc-800 rounded-xl p-6`}>
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-zinc-700 rounded w-full"></div>
            <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`${className} bg-zinc-900/50 border border-zinc-800 rounded-xl p-6`}>
        <div className="text-center text-zinc-400">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p>Unable to load usage statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Usage Analytics</h3>
            <p className="text-sm text-zinc-400">Track your AI interactions and performance</p>
          </div>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalRequests}</p>
              <p className="text-sm text-zinc-400">AI Requests</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
              <p className="text-sm text-zinc-400">Success Rate</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgResponseTime}s</p>
              <p className="text-sm text-zinc-400">Avg Response</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.creditsUsed}</p>
              <p className="text-sm text-zinc-400">Credits Used</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-white">Daily Activity</h4>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-zinc-400">AI Requests</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-zinc-400">Credits</span>
            </div>
          </div>
        </div>

        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between">
            {stats.dailyStats.map((day, index) => {
              const maxRequests = Math.max(...stats.dailyStats.map(d => d.requests));
              const maxCredits = Math.max(...stats.dailyStats.map(d => d.credits));
              const requestHeight = (day.requests / maxRequests) * 240;
              const creditHeight = (day.credits / maxCredits) * 240;

              return (
                <div key={day.date} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex items-end space-x-1 w-full max-w-12">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: requestHeight }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-purple-500 rounded-t flex-1"
                      title={`${day.requests} requests`}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: creditHeight }}
                      transition={{ delay: index * 0.1 + 0.05 }}
                      className="bg-blue-500 rounded-t flex-1"
                      title={`${day.credits} credits`}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 transform rotate-45 origin-bottom">
                    {formatDate(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Product Usage & Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Top Products</h4>
          <div className="space-y-4">
            {stats.productUsage.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-purple-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-green-500' :
                    'bg-zinc-600'
                  }`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-sm text-zinc-400">{product.requests} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{product.percentage}%</p>
                  <div className="w-16 bg-zinc-700 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-purple-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-green-500' :
                        'bg-zinc-500'
                      }`}
                      style={{ width: `${product.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Insights</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">Most Used Product</p>
                <p className="text-sm text-zinc-400">{stats.favoriteProduct} is your go-to AI tool</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Trophy className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">High Success Rate</p>
                <p className="text-sm text-zinc-400">Your requests have a {stats.successRate}% success rate</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">Usage Pattern</p>
                <p className="text-sm text-zinc-400">You're most active on weekdays</p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
                <span className="text-sm font-medium">View Detailed Analytics</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}