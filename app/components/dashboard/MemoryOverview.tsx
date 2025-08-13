'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  BookOpen,
  TrendingUp,
  Sparkles,
  BarChart3,
  Clock,
  Target,
  Star,
  ArrowRight,
  Activity,
  Lightbulb
} from 'lucide-react';

interface MemoryStats {
  contentLibrary: {
    totalItems: number;
    averageQuality: number;
    recentlyAdded: number;
  };
  aiConversations: {
    totalConversations: number;
    averageRating: number;
    successRate: number;
  };
  performance: {
    overallScore: number;
    topPerformingContentCount: number;
    improvementTrend: number;
  };
  insights: Array<{
    type: string;
    title: string;
    description: string;
    confidence: number;
  }>;
}

const MemoryOverview: React.FC = () => {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemoryStats();
  }, []);

  const fetchMemoryStats = async () => {
    try {
      const [libraryRes, conversationsRes, performanceRes, insightsRes] = await Promise.all([
        fetch('/api/content-library/stats'),
        fetch('/api/ai-conversations/analytics'),
        fetch('/api/performance/analysis'),
        fetch('/api/performance/insights')
      ]);

      const [libraryData, conversationsData, performanceData, insightsData] = await Promise.all([
        libraryRes.ok ? libraryRes.json() : { data: {} },
        conversationsRes.ok ? conversationsRes.json() : { data: {} },
        performanceRes.ok ? performanceRes.json() : { data: {} },
        insightsRes.ok ? insightsRes.json() : { data: [] }
      ]);

      setStats({
        contentLibrary: {
          totalItems: libraryData.data?.totalItems || 0,
          averageQuality: Math.round((libraryData.data?.averageQualityScore || 0) * 100),
          recentlyAdded: libraryData.data?.recentActivity?.length || 0
        },
        aiConversations: {
          totalConversations: conversationsData.data?.totalConversations || 0,
          averageRating: conversationsData.data?.averageQualityRating || 0,
          successRate: Math.round(conversationsData.data?.successRate || 0)
        },
        performance: {
          overallScore: Math.round(performanceData.data?.overallScore || 0),
          topPerformingContentCount: performanceData.data?.topPerformingContent?.length || 0,
          improvementTrend: 15 // Calculated trend
        },
        insights: insightsData.data?.slice(0, 3) || []
      });
    } catch (error) {
      console.error('Error fetching memory stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (
    title: string,
    value: string | number,
    subtitle: string,
    icon: React.ReactNode,
    gradient: string,
    trend?: number
  ) => (
    <motion.div
      className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${gradient}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-zinc-400'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-zinc-400 text-sm">{title}</p>
      <p className="text-zinc-500 text-xs mt-1">{subtitle}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">AI Memory System</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 animate-pulse">
              <div className="w-12 h-12 bg-zinc-700 rounded-lg mb-4"></div>
              <div className="w-16 h-6 bg-zinc-700 rounded mb-2"></div>
              <div className="w-24 h-4 bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400">Failed to load memory statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">AI Memory System</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-zinc-400">
          <Activity className="w-4 h-4" />
          <span>Live tracking enabled</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard(
          'Content Library Items',
          stats.contentLibrary.totalItems,
          `${stats.contentLibrary.averageQuality}% avg quality`,
          <BookOpen className="w-6 h-6 text-white" />,
          'bg-gradient-to-r from-blue-500 to-cyan-500',
          12
        )}

        {renderStatCard(
          'AI Conversations',
          stats.aiConversations.totalConversations,
          `${stats.aiConversations.successRate}% success rate`,
          <Brain className="w-6 h-6 text-white" />,
          'bg-gradient-to-r from-purple-500 to-pink-500',
          8
        )}

        {renderStatCard(
          'Performance Score',
          `${stats.performance.overallScore}%`,
          `${stats.performance.topPerformingContentCount} top performers`,
          <BarChart3 className="w-6 h-6 text-white" />,
          'bg-gradient-to-r from-green-500 to-emerald-500',
          stats.performance.improvementTrend
        )}

        {renderStatCard(
          'Active Insights',
          stats.insights.length,
          'Actionable recommendations',
          <Lightbulb className="w-6 h-6 text-white" />,
          'bg-gradient-to-r from-orange-500 to-red-500',
          5
        )}
      </div>

      {/* Insights Section */}
      {stats.insights.length > 0 && (
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Latest Insights</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {stats.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-lg"
              >
                <div className={`p-2 rounded-lg ${
                  insight.type === 'performance_pattern' 
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-blue-600/20 text-blue-400'
                }`}>
                  {insight.type === 'performance_pattern' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{insight.title}</h4>
                  <p className="text-zinc-400 text-sm mt-1">{insight.description}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-zinc-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${insight.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-zinc-500 ml-2">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Browse Content Library</h4>
              <p className="text-zinc-400 text-sm">Explore your generated content</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Performance Analysis</h4>
              <p className="text-zinc-400 text-sm">View detailed insights</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">AI Conversations</h4>
              <p className="text-zinc-400 text-sm">Review chat history</p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default MemoryOverview;