'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  FileText, 
  Package, 
  LinkIcon, 
  DollarSign,
  Activity,
  Calendar,
  Clock,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Target,
  Sparkles,
  Crown,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    activeUserRate: string;
    newUsers: number;
    totalRevenue: number;
    totalTransactions: number;
    avgTransactionValue: number;
  };
  aiUsage: {
    totalRequests: number;
    totalTokens: number;
    avgProcessingTime: string;
    byProduct: Array<{
      productId: string;
      requests: number;
      avgTime: string;
    }>;
  };
  subscriptions: {
    distribution: Record<string, number>;
  };
  content: {
    byType: Record<string, number>;
  };
  aiInsights?: {
    insights: string[];
    warnings: string[];
    opportunities: string[];
  };
}

interface InsightItem {
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionableSteps?: string[];
  predictedOutcome?: string;
}

interface UsageData {
  range: string;
  productUsage: Array<{
    productId: string;
    name: string;
    requests: number;
    avgResponseTime: number;
    totalTokens: number;
    successRate: number;
    percentage: number;
  }>;
  dailyStats: Record<string, number>;
  summary: {
    totalRequests: number;
    totalProducts: number;
    mostUsedProduct: string;
    avgSuccessRate: number;
  };
}

interface PerformanceData {
  topContent: Array<{
    id: string;
    contentType: string;
    createdAt: string;
  }>;
  topAffiliateLinks: Array<{
    linkId: string;
    revenue: number;
    clicks: number;
    conversions: number;
  }>;
}

interface RevenueData {
  range: string;
  totalRevenue: number;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    createdAt: string;
    plan: string;
    productName: string;
  }>;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, insightsRes, usageRes, performanceRes, revenueRes] = await Promise.all([
        fetch(`/api/admin/analytics?period=${timeRange}&includeAI=true`, { credentials: 'include' }),
        fetch('/api/analytics/insights', { credentials: 'include' }),
        fetch(`/api/analytics/product-usage?range=${timeRange}`, { credentials: 'include' }),
        fetch(`/api/analytics/performance?limit=10`, { credentials: 'include' }),
        fetch(`/api/analytics/revenue?range=${timeRange}`, { credentials: 'include' })
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.data);
      }

      if (insightsRes.ok) {
        const data = await insightsRes.json();
        setInsights(data.data);
      }

      if (usageRes.ok) {
        const data = await usageRes.json();
        setUsageData(data.data);
      }

      if (performanceRes.ok) {
        const data = await performanceRes.json();
        setPerformanceData(data.data);
      }

      if (revenueRes.ok) {
        const data = await revenueRes.json();
        setRevenueData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAdvancedInsights = async () => {
    setInsightsLoading(true);
    try {
      const response = await fetch('/api/analytics/insights?advanced=true', { 
        credentials: 'include' 
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Failed to generate advanced insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-800';
      default: return 'text-blue-400 bg-blue-900/20 border-blue-800';
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'ai': return <Brain className="w-5 h-5" />;
      case 'content': return <FileText className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Loading Analytics</h3>
              <p className="text-zinc-400">Gathering insights and data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-zinc-400">AI-powered insights and performance metrics</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'border-green-500 text-green-400' : ''}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>

              <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue */}
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Total Revenue</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(analytics.overview.totalRevenue)}</p>
                <p className="text-sm text-zinc-400 mt-1">{analytics.overview.totalTransactions} transactions</p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Active Users</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatNumber(analytics.overview.activeUsers)}</p>
                <p className="text-sm text-zinc-400 mt-1">{analytics.overview.activeUserRate} active rate</p>
              </CardContent>
            </Card>

            {/* AI Requests */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">AI Requests</h3>
                <p className="text-3xl font-bold text-white mt-2">{formatNumber(analytics.aiUsage.totalRequests)}</p>
                <p className="text-sm text-zinc-400 mt-1">Avg: {analytics.aiUsage.avgProcessingTime}</p>
              </CardContent>
            </Card>

            {/* Content Generated */}
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-400" />
                  </div>
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Content Created</h3>
                <p className="text-3xl font-bold text-white mt-2">
                  {Object.values(analytics.content.byType).reduce((sum, count) => sum + count, 0)}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Across all types</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI-Powered Insights */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <CardTitle>AI-Powered Insights</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateAdvancedInsights}
                    disabled={insightsLoading}
                  >
                    {insightsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate Insights
                  </Button>
                </div>
                <CardDescription>
                  Actionable recommendations powered by advanced analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getImpactColor(insight.impact)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{insight.title}</h4>
                        <Badge variant="outline" className={getImpactColor(insight.impact)}>
                          {insight.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-zinc-300 mb-3">{insight.description}</p>
                      
                      {insight.actionableSteps && insight.actionableSteps.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-zinc-400 mb-2">Action Steps:</h5>
                          <ul className="space-y-1">
                            {insight.actionableSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm text-zinc-300 flex items-start">
                                <ArrowRight className="w-3 h-3 text-zinc-500 mt-0.5 mr-2 flex-shrink-0" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {insight.predictedOutcome && (
                        <div className="text-sm text-zinc-400 bg-zinc-800/50 p-2 rounded">
                          <span className="font-medium">Expected Impact:</span> {insight.predictedOutcome}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {insights.length === 0 && !insightsLoading && (
                    <div className="text-center py-8">
                      <Info className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                      <p className="text-zinc-400">No insights available. Click "Generate Insights" to analyze your data.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Usage Breakdown */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Product Usage</CardTitle>
                <CardDescription>AI tool utilization breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {usageData && (
                  <div className="space-y-4">
                    {usageData.productUsage.slice(0, 5).map((product, index) => (
                      <div key={product.productId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-orange-500' :
                            'bg-zinc-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-white">{product.name}</p>
                            <p className="text-xs text-zinc-400">{product.requests} requests</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{product.percentage}%</p>
                          <p className="text-xs text-zinc-400">{product.successRate}% success</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance & Revenue Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your most successful content pieces</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceData && (
                <div className="space-y-4">
                  {performanceData.topContent.map((content, index) => (
                    <div key={content.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{content.contentType}</p>
                          <p className="text-xs text-zinc-400">
                            {new Date(content.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Payment trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              {revenueData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">{formatCurrency(revenueData.totalRevenue)}</p>
                      <p className="text-xs text-zinc-400">Total Revenue</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{revenueData.payments.length}</p>
                      <p className="text-xs text-zinc-400">Transactions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(revenueData.totalRevenue / Math.max(revenueData.payments.length, 1))}
                      </p>
                      <p className="text-xs text-zinc-400">Avg Value</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-zinc-800 pt-4">
                    <h4 className="text-sm font-medium text-white mb-3">Recent Transactions</h4>
                    <div className="space-y-2">
                      {revenueData.payments.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-white">{payment.productName || payment.plan}</p>
                            <p className="text-zinc-400 text-xs">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-green-400 font-medium">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Admin Insights */}
        {analytics?.aiInsights && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <CardTitle>Strategic Insights</CardTitle>
              </div>
              <CardDescription>Platform-level recommendations for growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Growth Opportunities */}
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {analytics.aiInsights.opportunities?.map((opportunity, index) => (
                      <li key={index} className="text-sm text-zinc-300 flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Insights
                  </h4>
                  <ul className="space-y-2">
                    {analytics.aiInsights.insights?.map((insight, index) => (
                      <li key={index} className="text-sm text-zinc-300 flex items-start">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warnings */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Warnings
                  </h4>
                  <ul className="space-y-2">
                    {analytics.aiInsights.warnings?.map((warning, index) => (
                      <li key={index} className="text-sm text-zinc-300 flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link href="/dashboard/analytics/reports">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </Link>
            <Link href="/dashboard/analytics/exports">
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}