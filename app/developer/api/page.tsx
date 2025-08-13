'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Activity,
  BarChart3,
  Code,
  Globe,
  Lock,
  RefreshCw,
  Trash2,
  Edit,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Server,
  Database,
  Shield,
  Download,
  FileText,
  ExternalLink
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  isVisible: boolean;
  scopes: string[];
  rateLimit: number;
  usage: {
    today: number;
    thisMonth: number;
    total: number;
  };
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'revoked';
  environment: 'production' | 'development' | 'testing';
}

interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  errorRate: number;
  avgResponseTime: number;
  bandwidthUsed: number;
  quotaRemaining: number;
  quotaLimit: number;
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
    avgTime: number;
  }>;
}

const sampleAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'DEMO_PROD_KEY_1234567890ABCDEF',
    isVisible: false,
    scopes: ['content.read', 'content.write', 'analytics.read'],
    rateLimit: 1000,
    usage: {
      today: 127,
      thisMonth: 3456,
      total: 28934
    },
    lastUsed: '2025-01-15T14:30:00Z',
    createdAt: '2024-11-01T00:00:00Z',
    status: 'active',
    environment: 'production'
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'DEMO_TEST_KEY_ABCDEF1234567890',
    isVisible: false,
    scopes: ['content.read', 'content.write'],
    rateLimit: 100,
    usage: {
      today: 45,
      thisMonth: 234,
      total: 1567
    },
    lastUsed: '2025-01-15T10:15:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    status: 'active',
    environment: 'development'
  }
];

const sampleMetrics: APIMetrics = {
  totalRequests: 125847,
  successfulRequests: 123456,
  errorRate: 1.9,
  avgResponseTime: 245,
  bandwidthUsed: 15.7,
  quotaRemaining: 8500,
  quotaLimit: 10000,
  topEndpoints: [
    { endpoint: '/api/content/generate', requests: 45678, avgTime: 1250 },
    { endpoint: '/api/templates/list', requests: 23456, avgTime: 120 },
    { endpoint: '/api/content/library', requests: 12345, avgTime: 180 }
  ]
};

const availableScopes = [
  { id: 'content.read', name: 'Content Read', description: 'Read content and templates' },
  { id: 'content.write', name: 'Content Write', description: 'Create and modify content' },
  { id: 'analytics.read', name: 'Analytics Read', description: 'Access usage analytics' },
  { id: 'users.read', name: 'Users Read', description: 'Read user information' },
  { id: 'webhooks.manage', name: 'Webhooks', description: 'Manage webhook endpoints' }
];

export default function APIManagementPage() {
  const [apiKeys, setAPIKeys] = useState<APIKey[]>(sampleAPIKeys);
  const [metrics, setMetrics] = useState<APIMetrics>(sampleMetrics);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'keys' | 'metrics' | 'docs' | 'webhooks'>('keys');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAPIData();
  }, [timeRange]);

  const fetchAPIData = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch(`/api/developer/data?timeRange=${timeRange}`, {
      //   credentials: 'include'
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   setAPIKeys(data.data.apiKeys);
      //   setMetrics(data.data.metrics);
      // }
    } catch (error) {
      console.error('Failed to fetch API data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setAPIKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, isVisible: !key.isVisible } : key
    ));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success message
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const createAPIKey = async (data: any) => {
    try {
      const response = await fetch('/api/developer/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchAPIData();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const revokeAPIKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/developer/keys/${keyId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        fetchAPIData();
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const formatKey = (key: string, isVisible: boolean) => {
    if (!isVisible) {
      return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 4);
    }
    return key;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'suspended': return 'text-yellow-400 bg-yellow-400/20';
      case 'revoked': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'text-red-400 bg-red-400/20';
      case 'development': return 'text-blue-400 bg-blue-400/20';
      case 'testing': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
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
              <h1 className="text-3xl font-bold text-white">API Management</h1>
              <p className="text-zinc-400 mt-2">Manage API keys, monitor usage, and access documentation</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              <button
                onClick={fetchAPIData}
                disabled={loading}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1 mb-8">
          {[
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'metrics', label: 'Usage Metrics', icon: BarChart3 },
            { id: 'docs', label: 'Documentation', icon: FileText },
            { id: 'webhooks', label: 'Webhooks', icon: Globe }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Total Keys</p>
                    <p className="text-2xl font-bold text-white">{apiKeys.length}</p>
                  </div>
                  <Key className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Active Keys</p>
                    <p className="text-2xl font-bold text-green-400">
                      {apiKeys.filter(k => k.status === 'active').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Requests Today</p>
                    <p className="text-2xl font-bold text-white">
                      {apiKeys.reduce((sum, key) => sum + key.usage.today, 0).toLocaleString()}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Quota Remaining</p>
                    <p className="text-2xl font-bold text-white">
                      {((metrics.quotaRemaining / metrics.quotaLimit) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Database className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {/* API Keys List */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your API Keys</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Key
              </button>
            </div>

            <div className="space-y-4">
              {apiKeys.map((apiKey, index) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">{apiKey.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(apiKey.status)}`}>
                          {apiKey.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getEnvironmentColor(apiKey.environment)}`}>
                          {apiKey.environment}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <code className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300 font-mono">
                            {formatKey(apiKey.key, apiKey.isVisible)}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded transition-colors"
                          >
                            {apiKey.isVisible ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-zinc-400 text-sm">Usage Today</p>
                          <p className="text-white font-semibold">{apiKey.usage.today.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-sm">This Month</p>
                          <p className="text-white font-semibold">{apiKey.usage.thisMonth.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-sm">Rate Limit</p>
                          <p className="text-white font-semibold">{apiKey.rateLimit}/min</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-sm">Last Used</p>
                          <p className="text-white font-semibold">
                            {new Date(apiKey.lastUsed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {apiKey.scopes.map(scope => (
                          <span key={scope} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      <button className="p-2 text-zinc-400 hover:text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => revokeAPIKey(apiKey.id)}
                        className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Usage Metrics Tab */}
        {activeTab === 'metrics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Total Requests</p>
                    <p className="text-2xl font-bold text-white">{metrics.totalRequests.toLocaleString()}</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5% vs last period
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">
                      {((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)}%
                    </p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {metrics.successfulRequests.toLocaleString()} successful
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Avg Response Time</p>
                    <p className="text-2xl font-bold text-white">{metrics.avgResponseTime}ms</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -5ms vs last period
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Bandwidth Used</p>
                    <p className="text-2xl font-bold text-white">{metrics.bandwidthUsed}GB</p>
                    <p className="text-blue-400 text-sm flex items-center mt-1">
                      <Database className="w-3 h-3 mr-1" />
                      {metrics.quotaRemaining} quota left
                    </p>
                  </div>
                  <Server className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Top Endpoints */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top API Endpoints</h3>
              <div className="space-y-4">
                {metrics.topEndpoints.map((endpoint, index) => (
                  <div key={endpoint.endpoint} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{endpoint.endpoint}</h4>
                      <p className="text-zinc-400 text-sm">{endpoint.requests.toLocaleString()} requests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{endpoint.avgTime}ms</p>
                      <p className="text-zinc-400 text-sm">avg response</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Rate Analysis */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Error Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Error Rate Trend</h4>
                  <div className="h-40 bg-zinc-800/50 rounded-lg flex items-center justify-center">
                    <p className="text-zinc-400">Chart placeholder - Error rate over time</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3">Common Error Types</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                      <span className="text-zinc-300">Rate Limit Exceeded</span>
                      <span className="text-red-400">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                      <span className="text-zinc-300">Invalid API Key</span>
                      <span className="text-red-400">32%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded">
                      <span className="text-zinc-300">Malformed Request</span>
                      <span className="text-red-400">23%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">API Documentation</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  href="/docs/api/getting-started"
                  className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                >
                  <Code className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
                  <p className="text-zinc-400 text-sm">Learn the basics of our API</p>
                </Link>

                <Link
                  href="/docs/api/authentication"
                  className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                >
                  <Lock className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
                  <p className="text-zinc-400 text-sm">API key management & security</p>
                </Link>

                <Link
                  href="/docs/api/endpoints"
                  className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                >
                  <Globe className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                  <p className="text-zinc-400 text-sm">Complete endpoint documentation</p>
                </Link>

                <Link
                  href="/docs/api/examples"
                  className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                >
                  <FileText className="w-8 h-8 text-orange-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
                  <p className="text-zinc-400 text-sm">Sample code in multiple languages</p>
                </Link>

                <Link
                  href="/docs/api/rate-limits"
                  className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                >
                  <Clock className="w-8 h-8 text-yellow-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Rate Limits</h3>
                  <p className="text-zinc-400 text-sm">Understanding usage limits</p>
                </Link>

                <Link
                  href="/docs/api/errors"
                  className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                >
                  <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Error Handling</h3>
                  <p className="text-zinc-400 text-sm">Error codes and troubleshooting</p>
                </Link>
              </div>

              <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Quick Start</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get up and running with our API in minutes. Here's a simple example:
                </p>
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
                  <code className="text-green-400 text-sm">
                    curl -X POST https://api.omnipreneur.ai/v1/content/generate \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-d '&#123;"prompt": "Write a blog post about AI"&#125;'
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}