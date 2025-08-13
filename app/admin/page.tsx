'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Shield,
  Users,
  Settings,
  BarChart3,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  FileCheck,
  Edit,
  Trash2,
  Eye,
  Crown,
  Mail,
  Calendar,
  User,
  Package,
  FileText,
  LinkIcon,
  Target,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Info,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SystemHealth {
  status: string;
  timestamp: string;
  database: {
    status: string;
    responseTime: string;
    tables: {
      users: number;
      aiRequests: number;
      payments: number;
    };
  };
  aiServices: {
    openai: {
      status: string;
      responseTime: string | null;
      error?: string;
    };
    anthropic: {
      status: string;
      responseTime: string | null;
      error?: string;
    };
  };
  system: {
    memory: {
      heapUsed: string;
      heapTotal: string;
      rss: string;
      external: string;
    };
    uptime: string;
    nodeVersion: string;
    platform: string;
  };
  errors: {
    last24Hours: {
      failedAIRequests: number;
      failedPayments: number;
    };
    lastHour: {
      failedAIRequests: number;
      failedPayments: number;
    };
    errorRate: {
      ai: string;
      payments: string;
    };
  };
  configuration: {
    database: boolean;
    openai: boolean;
    anthropic: boolean;
    stripe: boolean;
    email: boolean;
    storage: boolean;
  };
  environment: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  ai_credits_remaining: number;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  };
  usage: {
    aiRequestsUsed: number;
    rewrites: number;
    contentPieces: number;
    bundles: number;
    affiliateLinks: number;
  };
  _count: {
    events: number;
    payments: number;
  };
}

interface AdminAnalytics {
  period: string;
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

interface AIConfig {
  providers: {
    openai: {
      configured: boolean;
      models: string[];
      default: boolean;
    };
    anthropic: {
      configured: boolean;
      models: string[];
      default: boolean;
    };
    openrouter: {
      configured: boolean;
      models: string[];
    };
  };
  settings: {
    defaultProvider: string;
    defaultModel: string;
    temperature: number;
    maxTokens: number;
  };
  usage: {
    last24Hours: Array<{
      model: string;
      requests: number;
      totalTokens: number;
      avgResponseTime: string;
    }>;
  };
  costs: {
    estimated: {
      last24Hours: string;
      projected30Days: string;
      breakdown: Record<string, any>;
    };
  };
}

export default function AdminDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [aiConfig, setAIConfig] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/admin/system', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      if (userFilter !== 'all') params.append('plan', userFilter);
      
      const response = await fetch(`/api/admin/users?${params}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics?period=30d&includeAI=true', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchAIConfig = async () => {
    try {
      const response = await fetch('/api/admin/ai-config', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAIConfig(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch AI config:', error);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchSystemHealth(),
      fetchUsers(),
      fetchAnalytics(),
      fetchAIConfig()
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await refreshAll();
      setLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userSearch, userFilter]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'degraded': return 'text-orange-400 bg-orange-900/20 border-orange-800';
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-800';
      default: return 'text-zinc-400 bg-zinc-900/20 border-zinc-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Loading Admin Dashboard</h3>
              <p className="text-zinc-400">Gathering system information...</p>
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
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-zinc-400">System monitoring and management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {systemHealth && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${getHealthStatusColor(systemHealth.status)}`}>
                  {getStatusIcon(systemHealth.status)}
                  <span className="text-sm font-medium capitalize">{systemHealth.status}</span>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAll}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-zinc-900/50 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'system', label: 'System Health', icon: Server },
            { id: 'ai-config', label: 'AI Configuration', icon: Brain },
            { id: 'testing', label: 'System Testing', icon: FileCheck, href: '/admin/testing' },
            { id: 'validation', label: 'API Validation', icon: Shield, href: '/admin/validation' },
            { id: 'monitoring', label: 'Monitoring', icon: Activity, href: '/admin/monitoring' }
          ].map((tab) => {
            if (tab.href) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4">Total Users</h3>
                  <p className="text-3xl font-bold text-white mt-2">{formatNumber(analytics.overview.totalUsers)}</p>
                  <p className="text-sm text-zinc-400 mt-1">{analytics.overview.activeUserRate} active</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4">Revenue</h3>
                  <p className="text-3xl font-bold text-white mt-2">{formatCurrency(analytics.overview.totalRevenue)}</p>
                  <p className="text-sm text-zinc-400 mt-1">{analytics.overview.totalTransactions} transactions</p>
                </CardContent>
              </Card>

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

              <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Activity className="w-6 h-6 text-orange-400" />
                    </div>
                    <Target className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4">Content Created</h3>
                  <p className="text-3xl font-bold text-white mt-2">
                    {Object.values(analytics.content.byType).reduce((sum, count) => sum + count, 0)}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">All content types</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Usage Breakdown */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>AI Product Usage</CardTitle>
                  <CardDescription>Request distribution by product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.aiUsage.byProduct.map((product, index) => (
                      <div key={product.productId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            'bg-zinc-500'
                          }`} />
                          <span className="text-white font-medium">{product.productId}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{product.requests}</p>
                          <p className="text-zinc-400 text-sm">{product.avgTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                  <CardDescription>Active subscriptions by plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.subscriptions.distribution).map(([plan, count]) => (
                      <div key={plan} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {plan.includes('PRO') || plan.includes('ENTERPRISE') ? (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <User className="w-4 h-4 text-zinc-400" />
                          )}
                          <span className="text-white">{plan.replace('_', ' ')}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Insights */}
            {analytics.aiInsights && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Strategic Insights</CardTitle>
                  <CardDescription>Platform-level recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-green-400 mb-3">Opportunities</h4>
                      <ul className="space-y-2">
                        {analytics.aiInsights.opportunities?.map((opportunity, index) => (
                          <li key={index} className="text-sm text-zinc-300 flex items-start">
                            <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-3">Insights</h4>
                      <ul className="space-y-2">
                        {analytics.aiInsights.insights?.map((insight, index) => (
                          <li key={index} className="text-sm text-zinc-300 flex items-start">
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-yellow-400 mb-3">Warnings</h4>
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
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="w-40 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Plans</option>
                  <option value="FREE">Free</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Bulk Email
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">User</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Plan</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Usage</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Last Active</th>
                        <th className="text-left py-3 px-4 font-medium text-zinc-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-zinc-400 text-xs">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <Badge 
                                variant="outline" 
                                className={
                                  user.subscription?.plan === 'FREE' ? 'text-zinc-400' :
                                  user.subscription?.plan === 'PRO' ? 'text-blue-400 border-blue-500' :
                                  'text-yellow-400 border-yellow-500'
                                }
                              >
                                {user.subscription?.plan || 'FREE'}
                              </Badge>
                              <p className="text-xs text-zinc-400">{user.subscription?.status || 'Active'}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <p className="text-white text-sm">{user.usage?.aiRequestsUsed || 0} AI requests</p>
                              <p className="text-zinc-400 text-xs">
                                {(user.usage?.rewrites || 0) + (user.usage?.contentPieces || 0)} content pieces
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-zinc-400 text-sm">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'system' && systemHealth && (
          <div className="space-y-8">
            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`border ${getHealthStatusColor(systemHealth.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Overall Status</h3>
                      <p className="text-2xl font-bold text-white mt-2 capitalize">{systemHealth.status}</p>
                    </div>
                    {getStatusIcon(systemHealth.status)}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border ${getHealthStatusColor(systemHealth.database.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Database</h3>
                      <p className="text-sm text-zinc-400">{systemHealth.database.responseTime}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Uptime</h3>
                      <p className="text-2xl font-bold text-white mt-2">{systemHealth.system.uptime}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Services Status */}
            <Card>
              <CardHeader>
                <CardTitle>AI Services Status</CardTitle>
                <CardDescription>Health check for AI providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${getHealthStatusColor(systemHealth.aiServices.openai.status)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">OpenAI</h4>
                          <p className="text-sm text-zinc-400">
                            {systemHealth.aiServices.openai.responseTime || 'Not configured'}
                          </p>
                        </div>
                        <Badge className={getHealthStatusColor(systemHealth.aiServices.openai.status)}>
                          {systemHealth.aiServices.openai.status}
                        </Badge>
                      </div>
                      {systemHealth.aiServices.openai.error && (
                        <p className="text-red-400 text-sm mt-2">{systemHealth.aiServices.openai.error}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${getHealthStatusColor(systemHealth.aiServices.anthropic.status)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Anthropic</h4>
                          <p className="text-sm text-zinc-400">
                            {systemHealth.aiServices.anthropic.responseTime || 'Not configured'}
                          </p>
                        </div>
                        <Badge className={getHealthStatusColor(systemHealth.aiServices.anthropic.status)}>
                          {systemHealth.aiServices.anthropic.status}
                        </Badge>
                      </div>
                      {systemHealth.aiServices.anthropic.error && (
                        <p className="text-red-400 text-sm mt-2">{systemHealth.aiServices.anthropic.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Resources */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>Current memory consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Heap Used</span>
                      <span className="text-white font-medium">{systemHealth.system.memory.heapUsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Heap Total</span>
                      <span className="text-white font-medium">{systemHealth.system.memory.heapTotal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">RSS</span>
                      <span className="text-white font-medium">{systemHealth.system.memory.rss}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">External</span>
                      <span className="text-white font-medium">{systemHealth.system.memory.external}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Rates</CardTitle>
                  <CardDescription>Recent error statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-400">AI Failures (24h)</span>
                        <span className="text-white font-medium">{systemHealth.errors.last24Hours.failedAIRequests}</span>
                      </div>
                      <Badge className={getHealthStatusColor(systemHealth.errors.errorRate.ai)}>
                        {systemHealth.errors.errorRate.ai} rate
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-400">Payment Failures (24h)</span>
                        <span className="text-white font-medium">{systemHealth.errors.last24Hours.failedPayments}</span>
                      </div>
                      <Badge className={getHealthStatusColor(systemHealth.errors.errorRate.payments)}>
                        {systemHealth.errors.errorRate.payments} rate
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration Status</CardTitle>
                <CardDescription>Essential service configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(systemHealth.configuration).map(([service, configured]) => (
                    <div key={service} className="text-center">
                      <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                        configured ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {configured ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <p className="text-sm text-white capitalize">{service}</p>
                      <p className="text-xs text-zinc-400">{configured ? 'Configured' : 'Missing'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Configuration Tab */}
        {activeTab === 'ai-config' && aiConfig && (
          <div className="space-y-8">
            {/* Provider Status */}
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(aiConfig.providers).map(([provider, config]) => (
                <Card key={provider} className={`border ${config.configured ? 'border-green-800' : 'border-red-800'}`}>
                  <CardHeader>
                    <CardTitle className="capitalize">{provider}</CardTitle>
                    <CardDescription>
                      {config.configured ? 'Configured and ready' : 'Not configured'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Status</span>
                        <Badge className={config.configured ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}>
                          {config.configured ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-zinc-400 text-sm">Available Models</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {config.models.slice(0, 2).map((model) => (
                            <Badge key={model} variant="outline" className="text-xs">
                              {model}
                            </Badge>
                          ))}
                          {config.models.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{config.models.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Current Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Current AI Settings</CardTitle>
                <CardDescription>Active configuration parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm font-medium text-zinc-400">Default Provider</label>
                    <p className="text-lg font-semibold text-white capitalize">{aiConfig.settings.defaultProvider}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-400">Default Model</label>
                    <p className="text-lg font-semibold text-white">{aiConfig.settings.defaultModel}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-400">Temperature</label>
                    <p className="text-lg font-semibold text-white">{aiConfig.settings.temperature}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-400">Max Tokens</label>
                    <p className="text-lg font-semibold text-white">{aiConfig.settings.maxTokens}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>24-Hour Usage</CardTitle>
                  <CardDescription>Recent AI model usage statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiConfig.usage.last24Hours.map((usage, index) => (
                      <div key={usage.model} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            'bg-zinc-500'
                          }`} />
                          <div>
                            <p className="text-white font-medium">{usage.model}</p>
                            <p className="text-zinc-400 text-sm">{usage.avgResponseTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{usage.requests}</p>
                          <p className="text-zinc-400 text-sm">{usage.totalTokens} tokens</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Estimation</CardTitle>
                  <CardDescription>Projected AI usage costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{aiConfig.costs.estimated.last24Hours}</p>
                      <p className="text-zinc-400">Last 24 Hours</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{aiConfig.costs.estimated.projected30Days}</p>
                      <p className="text-zinc-400">Projected 30 Days</p>
                    </div>

                    <div className="border-t border-zinc-800 pt-4">
                      <h4 className="text-sm font-medium text-zinc-400 mb-3">Breakdown by Model</h4>
                      <div className="space-y-2">
                        {Object.entries(aiConfig.costs.estimated.breakdown).map(([model, data]: [string, any]) => (
                          <div key={model} className="flex justify-between items-center text-sm">
                            <span className="text-zinc-300">{model}</span>
                            <span className="text-white">{data.estimatedCost}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure Models
              </Button>
              <Button variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Usage Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}