'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Copy,
  ExternalLink,
  Eye,
  MousePointer,
  CreditCard,
  Gift,
  Share2,
  BarChart3,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';

interface AffiliateStats {
  totalEarnings: number;
  pendingEarnings: number;
  totalReferrals: number;
  activeReferrals: number;
  clicksThisMonth: number;
  conversionsThisMonth: number;
  conversionRate: number;
  avgOrderValue: number;
  commissionRate: number;
  nextPayoutDate: string;
  currentTier: string;
}

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
  isActive: boolean;
}

interface Referral {
  id: string;
  customerName: string;
  customerEmail: string;
  signupDate: string;
  status: 'pending' | 'active' | 'cancelled';
  subscriptionPlan: string;
  monthlyValue: number;
  totalEarnings: number;
  lastActivity: string;
}

interface Commission {
  id: string;
  referralId: string;
  customerName: string;
  amount: number;
  type: 'signup' | 'monthly' | 'upgrade' | 'bonus';
  status: 'pending' | 'approved' | 'paid';
  date: string;
  payoutDate?: string;
}

const sampleStats: AffiliateStats = {
  totalEarnings: 12450.75,
  pendingEarnings: 850.25,
  totalReferrals: 67,
  activeReferrals: 54,
  clicksThisMonth: 1247,
  conversionsThisMonth: 23,
  conversionRate: 1.85,
  avgOrderValue: 89.50,
  commissionRate: 30,
  nextPayoutDate: '2025-02-01',
  currentTier: 'Gold'
};

const sampleLinks: AffiliateLink[] = [
  {
    id: '1',
    name: 'Homepage Link',
    url: 'https://omnipreneur.ai?ref=ABC123',
    shortUrl: 'omni.ai/r/ABC123',
    clicks: 456,
    conversions: 12,
    earnings: 720.00,
    createdAt: '2025-01-01',
    isActive: true
  },
  {
    id: '2',
    name: 'Pricing Page Link',
    url: 'https://omnipreneur.ai/pricing?ref=ABC123',
    shortUrl: 'omni.ai/r/pricing-ABC123',
    clicks: 234,
    conversions: 8,
    earnings: 480.00,
    createdAt: '2025-01-10',
    isActive: true
  }
];

const tierBenefits = {
  bronze: { rate: 20, threshold: 0, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  silver: { rate: 25, threshold: 5000, color: 'text-gray-400', bg: 'bg-gray-500/20' },
  gold: { rate: 30, threshold: 15000, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  platinum: { rate: 35, threshold: 50000, color: 'text-purple-400', bg: 'bg-purple-500/20' }
};

export default function AffiliatePage() {
  const [stats, setStats] = useState<AffiliateStats>(sampleStats);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(sampleLinks);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'referrals' | 'commissions' | 'resources'>('overview');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      // const response = await fetch('/api/affiliate/stats', { credentials: 'include' });
      // if (response.ok) {
      //   const data = await response.json();
      //   setStats(data.data.stats);
      // }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const createAffiliateLink = async (name: string, targetUrl: string) => {
    try {
      const response = await fetch('/api/affiliate/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, targetUrl })
      });

      if (response.ok) {
        fetchAffiliateData();
      }
    } catch (error) {
      console.error('Failed to create affiliate link:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const currentTier = tierBenefits[stats.currentTier.toLowerCase() as keyof typeof tierBenefits];
  const nextTier = Object.entries(tierBenefits).find(([_, tier]) => tier.threshold > stats.totalEarnings);

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
              <h1 className="text-3xl font-bold text-white">Affiliate Program</h1>
              <p className="text-zinc-400 mt-2">Earn money by referring new customers to Omnipreneur AI</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 ${currentTier.bg} ${currentTier.color} rounded-lg border border-current/30`}>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">{stats.currentTier} Tier</span>
                  <span className="text-sm">({currentTier.rate}%)</span>
                </div>
              </div>
              
              <button
                onClick={fetchAffiliateData}
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
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'links', label: 'Affiliate Links', icon: ExternalLink },
            { id: 'referrals', label: 'Referrals', icon: Users },
            { id: 'commissions', label: 'Commissions', icon: DollarSign },
            { id: 'resources', label: 'Resources', icon: Gift }
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalEarnings)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Pending Earnings</p>
                    <p className="text-2xl font-bold text-yellow-400">{formatCurrency(stats.pendingEarnings)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Total Referrals</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.totalReferrals}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Conversion Rate</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.conversionRate}%</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Performance Chart & Tier Progress */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Performance Overview */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">This Month's Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Clicks</span>
                    <span className="text-white font-medium">{stats.clicksThisMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Conversions</span>
                    <span className="text-white font-medium">{stats.conversionsThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Avg. Order Value</span>
                    <span className="text-white font-medium">{formatCurrency(stats.avgOrderValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Commission Rate</span>
                    <span className="text-white font-medium">{stats.commissionRate}%</span>
                  </div>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Tier Progress</h3>
                <div className="space-y-4">
                  <div className={`p-4 ${currentTier.bg} border border-current/30 rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${currentTier.color}`}>Current: {stats.currentTier}</span>
                      <span className={`text-sm ${currentTier.color}`}>{currentTier.rate}% Commission</span>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Total Earnings: {formatCurrency(stats.totalEarnings)}
                    </p>
                  </div>

                  {nextTier && (
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">Next: {nextTier[0].charAt(0).toUpperCase() + nextTier[0].slice(1)}</span>
                        <span className="text-sm text-zinc-400">{nextTier[1].rate}% Commission</span>
                      </div>
                      <div className="mb-2">
                        <div className="w-full bg-zinc-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((stats.totalEarnings / nextTier[1].threshold) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {formatCurrency(nextTier[1].threshold - stats.totalEarnings)} more to unlock
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('links')}
                  className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left"
                >
                  <ExternalLink className="w-6 h-6 text-blue-400 mb-2" />
                  <h4 className="font-medium text-white mb-1">Create New Link</h4>
                  <p className="text-zinc-400 text-sm">Generate a new affiliate link</p>
                </button>

                <button
                  onClick={() => setActiveTab('referrals')}
                  className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left"
                >
                  <Users className="w-6 h-6 text-green-400 mb-2" />
                  <h4 className="font-medium text-white mb-1">View Referrals</h4>
                  <p className="text-zinc-400 text-sm">Check your referral status</p>
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-left"
                >
                  <Gift className="w-6 h-6 text-purple-400 mb-2" />
                  <h4 className="font-medium text-white mb-1">Marketing Resources</h4>
                  <p className="text-zinc-400 text-sm">Download banners and content</p>
                </button>
              </div>
            </div>

            {/* Next Payout */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Next Payout</h3>
                  <p className="text-zinc-400">
                    Your next payout of {formatCurrency(stats.pendingEarnings)} is scheduled for{' '}
                    <span className="text-blue-400 font-medium">
                      {new Date(stats.nextPayoutDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Affiliate Links Tab */}
        {activeTab === 'links' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Affiliate Links</h2>
              <button
                onClick={() => {
                  const name = prompt('Enter link name:');
                  const url = prompt('Enter target URL (optional):') || '/';
                  if (name) createAffiliateLink(name, url);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Link
              </button>
            </div>

            <div className="space-y-4">
              {affiliateLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">{link.name}</h3>
                        {link.isActive ? (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded-full text-xs">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 border border-gray-500/30 rounded-full text-xs">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-zinc-400 text-sm mb-2">Affiliate URL:</p>
                        <div className="flex items-center space-x-2">
                          <code className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300">
                            {link.url}
                          </code>
                          <button
                            onClick={() => copyToClipboard(link.url, link.id)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          >
                            {copiedLink === link.id ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-zinc-400 text-sm">Clicks</p>
                          <p className="text-white font-semibold">{link.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-sm">Conversions</p>
                          <p className="text-white font-semibold">{link.conversions}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-sm">Conversion Rate</p>
                          <p className="text-white font-semibold">
                            {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : '0'}%
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-400 text-sm">Earnings</p>
                          <p className="text-green-400 font-semibold">{formatCurrency(link.earnings)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-white">Marketing Resources</h2>

            {/* Banners */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Banner Ads</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { size: '728x90', name: 'Leaderboard' },
                  { size: '300x250', name: 'Medium Rectangle' },
                  { size: '160x600', name: 'Skyscraper' }
                ].map(banner => (
                  <div key={banner.size} className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded mb-3 h-20 flex items-center justify-center">
                      <span className="text-white text-sm">Omnipreneur AI</span>
                    </div>
                    <h4 className="font-medium text-white mb-1">{banner.name}</h4>
                    <p className="text-zinc-400 text-sm mb-3">{banner.size}</p>
                    <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Templates */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Email Templates</h3>
              <div className="space-y-4">
                {[
                  { name: 'Introduction Email', description: 'Perfect for introducing Omnipreneur AI to your audience' },
                  { name: 'Feature Spotlight', description: 'Highlight specific features and benefits' },
                  { name: 'Success Story', description: 'Share customer success stories and case studies' }
                ].map(template => (
                  <div key={template.name} className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white mb-1">{template.name}</h4>
                        <p className="text-zinc-400 text-sm">{template.description}</p>
                      </div>
                      <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                        Copy Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Content */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Social Media Content</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Pre-written Posts</h4>
                  <div className="space-y-3">
                    {[
                      "🚀 Just discovered @OmnipreneurAI - it's revolutionizing how I create content! The AI-powered tools are incredible. Check it out: [YOUR_LINK]",
                      "💡 Struggling with content creation? Omnipreneur AI has been a game-changer for my business. Try it here: [YOUR_LINK]",
                      "⚡ From blog posts to marketing copy, Omnipreneur AI does it all. My productivity has skyrocketed! [YOUR_LINK]"
                    ].map((post, index) => (
                      <div key={index} className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                        <p className="text-zinc-300 text-sm mb-2">{post}</p>
                        <button 
                          onClick={() => copyToClipboard(post, `post-${index}`)}
                          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                          {copiedLink === `post-${index}` ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Graphics & Videos</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Instagram Stories', type: 'Image' },
                      { name: 'LinkedIn Post', type: 'Image' },
                      { name: 'Product Demo', type: 'Video' },
                      { name: 'Twitter Header', type: 'Image' }
                    ].map(asset => (
                      <div key={asset.name} className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-white text-sm font-medium">{asset.name}</h5>
                            <p className="text-zinc-400 text-xs">{asset.type}</p>
                          </div>
                          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}