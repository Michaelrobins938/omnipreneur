'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  BookOpen,
  BarChart3,
  MessageSquare,
  Settings,
  TrendingUp,
  Lightbulb,
  Clock,
  Star,
  Target,
  Activity,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

interface MemoryData {
  contentLibrary: {
    stats: any;
    recentItems: any[];
  };
  conversations: {
    analytics: any;
    recent: any[];
  };
  performance: {
    analysis: any;
    insights: any[];
  };
  preferences: any;
}

const MemoryDashboard: React.FC = () => {
  const [memoryData, setMemoryData] = useState<MemoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'content', label: 'Content Library', icon: BookOpen },
    { id: 'conversations', label: 'AI Memory', icon: MessageSquare },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Lightbulb }
  ];

  useEffect(() => {
    fetchMemoryData();
  }, []);

  const fetchMemoryData = async () => {
    setLoading(true);
    try {
      const [libraryRes, conversationsRes, performanceRes, preferencesRes] = await Promise.all([
        fetch('/api/content-library/stats'),
        fetch('/api/ai-conversations/analytics'),
        fetch('/api/performance/analysis'),
        fetch('/api/performance/preferences')
      ]);

      const [libraryData, conversationsData, performanceData, preferencesData] = await Promise.all([
        libraryRes.ok ? libraryRes.json() : { data: {} },
        conversationsRes.ok ? conversationsRes.json() : { data: {} },
        performanceRes.ok ? performanceRes.json() : { data: {} },
        preferencesRes.ok ? preferencesRes.json() : { data: {} }
      ]);

      // Fetch recent items
      const [recentContentRes, recentConversationsRes, insightsRes] = await Promise.all([
        fetch('/api/content-library?limit=5'),
        fetch('/api/ai-conversations?limit=5'),
        fetch('/api/performance/insights')
      ]);

      const [recentContentData, recentConversationsData, insightsData] = await Promise.all([
        recentContentRes.ok ? recentContentRes.json() : { data: { items: [] } },
        recentConversationsRes.ok ? recentConversationsRes.json() : { data: [] },
        insightsRes.ok ? insightsRes.json() : { data: [] }
      ]);

      setMemoryData({
        contentLibrary: {
          stats: libraryData.data,
          recentItems: recentContentData.data.items
        },
        conversations: {
          analytics: conversationsData.data,
          recent: recentConversationsData.data
        },
        performance: {
          analysis: performanceData.data,
          insights: insightsData.data
        },
        preferences: preferencesData.data
      });
    } catch (error) {
      console.error('Error fetching memory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMemoryData();
    setRefreshing(false);
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Active</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Memory System</h3>
          <p className="text-zinc-400 text-sm">AI learning and context retention</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
            </div>
            <span className="text-sm text-zinc-400">80%</span>
          </div>
        </motion.div>

        <motion.div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {memoryData?.contentLibrary.stats?.totalItems || 0}
          </h3>
          <p className="text-zinc-400 text-sm">Content items saved</p>
          <p className="text-blue-400 text-xs mt-2">
            +{memoryData?.contentLibrary.stats?.recentActivity?.length || 0} this week
          </p>
        </motion.div>

        <motion.div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {memoryData?.conversations.analytics?.totalConversations || 0}
          </h3>
          <p className="text-zinc-400 text-sm">AI conversations</p>
          <p className="text-yellow-400 text-xs mt-2">
            {Math.round(memoryData?.conversations.analytics?.averageQualityRating || 0)}/5 avg rating
          </p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Content</h3>
          <div className="space-y-3">
            {memoryData?.contentLibrary.recentItems.slice(0, 3).map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{item.title}</p>
                  <p className="text-zinc-400 text-xs">{item.productSource}</p>
                </div>
                <span className="text-zinc-500 text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            )) || (
              <p className="text-zinc-500 text-sm">No recent content</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
          <div className="space-y-3">
            {memoryData?.performance.insights.slice(0, 3).map((insight, index) => (
              <div key={index} className="p-3 bg-zinc-800/50 rounded-lg">
                <h4 className="text-white text-sm font-medium">{insight.title}</h4>
                <p className="text-zinc-400 text-xs mt-1">{insight.description}</p>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-zinc-700 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${insight.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-zinc-500 ml-2">
                    {Math.round(insight.confidence * 100)}%
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-zinc-500 text-sm">No insights available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Content Library Statistics</h3>
        <button
          onClick={() => window.location.href = '/dashboard/content-library'}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Open Full Library
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h4 className="text-zinc-400 text-sm">Total Items</h4>
          <p className="text-2xl font-bold text-white">
            {memoryData?.contentLibrary.stats?.totalItems || 0}
          </p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h4 className="text-zinc-400 text-sm">Average Quality</h4>
          <p className="text-2xl font-bold text-white">
            {Math.round((memoryData?.contentLibrary.stats?.averageQualityScore || 0) * 100)}%
          </p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h4 className="text-zinc-400 text-sm">Content Types</h4>
          <p className="text-2xl font-bold text-white">
            {Object.keys(memoryData?.contentLibrary.stats?.totalByType || {}).length}
          </p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h4 className="text-zinc-400 text-sm">Top Tags</h4>
          <p className="text-2xl font-bold text-white">
            {memoryData?.contentLibrary.stats?.mostUsedTags?.length || 0}
          </p>
        </div>
      </div>

      {/* Most Used Tags */}
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
        <h4 className="text-lg font-semibold text-white mb-4">Most Used Tags</h4>
        <div className="flex flex-wrap gap-2">
          {memoryData?.contentLibrary.stats?.mostUsedTags?.slice(0, 10).map((tag: any) => (
            <span 
              key={tag.tag}
              className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300"
            >
              {tag.tag} ({tag.count})
            </span>
          )) || (
            <p className="text-zinc-500">No tags available</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderConversationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">AI Conversation Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h4 className="text-zinc-400 text-sm">Total Conversations</h4>
          <p className="text-2xl font-bold text-white">
            {memoryData?.conversations.analytics?.totalConversations || 0}
          </p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h4 className="text-zinc-400 text-sm">Success Rate</h4>
          <p className="text-2xl font-bold text-white">
            {Math.round(memoryData?.conversations.analytics?.successRate || 0)}%
          </p>
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <h4 className="text-zinc-400 text-sm">Avg Rating</h4>
          <p className="text-2xl font-bold text-white">
            {(memoryData?.conversations.analytics?.averageQualityRating || 0).toFixed(1)}/5
          </p>
        </div>
      </div>

      {/* Conversations by Product */}
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
        <h4 className="text-lg font-semibold text-white mb-4">Conversations by Product</h4>
        <div className="space-y-3">
          {Object.entries(memoryData?.conversations.analytics?.conversationsByProduct || {}).map(([product, count]) => (
            <div key={product} className="flex items-center justify-between">
              <span className="text-zinc-300">{product}</span>
              <span className="text-white font-medium">{count as number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Performance Analysis</h3>
      
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
        <h4 className="text-lg font-semibold text-white mb-4">Overall Performance Score</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="w-full bg-zinc-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${memoryData?.performance.analysis?.overallScore || 0}%` }}
              ></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-white">
            {Math.round(memoryData?.performance.analysis?.overallScore || 0)}%
          </span>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
        <h4 className="text-lg font-semibold text-white mb-4">Top Performing Content</h4>
        <div className="space-y-3">
          {memoryData?.performance.analysis?.topPerformingContent?.slice(0, 5).map((content: any, index: number) => (
            <div key={content.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{content.title}</p>
                <p className="text-zinc-400 text-sm">Score: {Math.round(content.score)}</p>
              </div>
              <div className="text-right">
                <div className="w-16 bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(content.score / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )) || (
            <p className="text-zinc-500">No performance data available</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">AI-Generated Insights</h3>
      
      <div className="space-y-4">
        {memoryData?.performance.insights.map((insight: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                insight.type === 'performance_pattern' 
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-blue-600/20 text-blue-400'
              }`}>
                {insight.type === 'performance_pattern' ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <Lightbulb className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg mb-2">{insight.title}</h4>
                <p className="text-zinc-300 mb-4">{insight.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-zinc-400">Confidence:</span>
                    <div className="w-24 bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${insight.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-zinc-300">
                      {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    insight.type === 'performance_pattern' 
                      ? 'bg-green-600/20 text-green-400'
                      : 'bg-blue-600/20 text-blue-400'
                  }`}>
                    {insight.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )) || (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No insights available yet</p>
            <p className="text-zinc-500 text-sm">Use the AI tools more to generate insights</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading memory dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Memory Dashboard</h1>
            <p className="text-zinc-400">Comprehensive view of your AI learning and performance data</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-800 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'content' && renderContentTab()}
            {activeTab === 'conversations' && renderConversationsTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'insights' && renderInsightsTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MemoryDashboard;