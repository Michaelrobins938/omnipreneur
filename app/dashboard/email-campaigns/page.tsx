'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send,
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  BarChart3,
  Plus,
  Search,
  Filter,
  Calendar,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Archive,
  Settings,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  FileText,
  Image,
  Link,
  Palette,
  Code,
  MoreHorizontal,
  Download
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  type: 'welcome' | 'newsletter' | 'promotional' | 'abandoned-cart' | 're-engagement' | 'product-launch';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  content: string;
  recipientSegment: string;
  recipientCount: number;
  scheduledAt?: string;
  sentAt?: string;
  fromName: string;
  fromEmail: string;
  analytics: {
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface EmailAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalSubscribers: number;
  recentPerformance: Array<{
    date: string;
    sent: number;
    opened: number;
    clicked: number;
  }>;
  topPerformers: Array<{
    campaignName: string;
    openRate: number;
    clickRate: number;
  }>;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isCustom: boolean;
}

export default function EmailMarketingDashboard() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics' | 'templates' | 'segments'>('campaigns');

  // New campaign form
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    type: 'newsletter' as const,
    content: '',
    recipientSegment: 'all',
    scheduledAt: '',
    fromName: 'Omnipreneur',
    fromEmail: 'noreply@omnipreneur.com'
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // Mock data since we'd normally fetch from /api/email-campaigns
      const mockCampaigns: EmailCampaign[] = [
        {
          id: '1',
          name: 'Welcome Series - Part 1',
          subject: 'Welcome to Omnipreneur! Get started with these 3 steps',
          type: 'welcome',
          status: 'sent',
          content: 'Welcome to our platform! Here are the first steps to get you started...',
          recipientSegment: 'new-users',
          recipientCount: 1250,
          sentAt: '2024-02-09T10:00:00Z',
          fromName: 'Omnipreneur Team',
          fromEmail: 'welcome@omnipreneur.com',
          analytics: {
            delivered: 1245,
            opened: 698,
            clicked: 156,
            bounced: 5,
            unsubscribed: 3,
            openRate: 56.1,
            clickRate: 12.5,
            bounceRate: 0.4
          },
          createdAt: '2024-02-08T14:00:00Z',
          updatedAt: '2024-02-09T10:00:00Z'
        },
        {
          id: '2',
          name: 'Weekly Newsletter - AI Tools Update',
          subject: '5 New AI Tools That Will Transform Your Business',
          type: 'newsletter',
          status: 'sent',
          content: 'This week we\'re excited to share 5 powerful AI tools...',
          recipientSegment: 'subscribers',
          recipientCount: 8500,
          sentAt: '2024-02-07T09:00:00Z',
          fromName: 'AI Insights Team',
          fromEmail: 'newsletter@omnipreneur.com',
          analytics: {
            delivered: 8456,
            opened: 3892,
            clicked: 547,
            bounced: 44,
            unsubscribed: 12,
            openRate: 46.0,
            clickRate: 6.5,
            bounceRate: 0.5
          },
          createdAt: '2024-02-05T16:00:00Z',
          updatedAt: '2024-02-07T09:00:00Z'
        },
        {
          id: '3',
          name: 'Product Launch - Advanced Analytics',
          subject: 'Introducing Advanced Analytics: Your Data, Supercharged',
          type: 'product-launch',
          status: 'scheduled',
          content: 'We\'re thrilled to announce our new Advanced Analytics features...',
          recipientSegment: 'pro-users',
          recipientCount: 2340,
          scheduledAt: '2024-02-12T14:00:00Z',
          fromName: 'Product Team',
          fromEmail: 'product@omnipreneur.com',
          analytics: {
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            unsubscribed: 0,
            openRate: 0,
            clickRate: 0,
            bounceRate: 0
          },
          createdAt: '2024-02-10T11:00:00Z',
          updatedAt: '2024-02-10T11:00:00Z'
        },
        {
          id: '4',
          name: 'Re-engagement Campaign',
          subject: 'We miss you! Here\'s 50% off to welcome you back',
          type: 're-engagement',
          status: 'draft',
          content: 'It\'s been a while since we\'ve seen you...',
          recipientSegment: 'inactive-users',
          recipientCount: 1890,
          fromName: 'Customer Success',
          fromEmail: 'success@omnipreneur.com',
          analytics: {
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            unsubscribed: 0,
            openRate: 0,
            clickRate: 0,
            bounceRate: 0
          },
          createdAt: '2024-02-09T13:00:00Z',
          updatedAt: '2024-02-10T09:00:00Z'
        },
        {
          id: '5',
          name: 'Abandoned Cart Recovery',
          subject: 'Don\'t forget your items - Complete your purchase now',
          type: 'abandoned-cart',
          status: 'sending',
          content: 'You left some great items in your cart...',
          recipientSegment: 'cart-abandoners',
          recipientCount: 456,
          fromName: 'Sales Team',
          fromEmail: 'sales@omnipreneur.com',
          analytics: {
            delivered: 234,
            opened: 89,
            clicked: 23,
            bounced: 2,
            unsubscribed: 0,
            openRate: 38.0,
            clickRate: 9.8,
            bounceRate: 0.9
          },
          createdAt: '2024-02-10T08:00:00Z',
          updatedAt: '2024-02-10T12:00:00Z'
        }
      ];

      const mockAnalytics: EmailAnalytics = {
        totalCampaigns: mockCampaigns.length,
        activeCampaigns: mockCampaigns.filter(c => ['scheduled', 'sending'].includes(c.status)).length,
        totalSent: mockCampaigns.reduce((sum, c) => sum + c.analytics.delivered, 0),
        avgOpenRate: 45.2,
        avgClickRate: 8.7,
        totalSubscribers: 12500,
        recentPerformance: [
          { date: '2024-02-05', sent: 1200, opened: 480, clicked: 96 },
          { date: '2024-02-06', sent: 2100, opened: 945, clicked: 189 },
          { date: '2024-02-07', sent: 8500, opened: 3825, clicked: 765 },
          { date: '2024-02-08', sent: 1800, opened: 810, clicked: 162 },
          { date: '2024-02-09', sent: 1300, opened: 715, clicked: 143 },
          { date: '2024-02-10', sent: 500, opened: 190, clicked: 38 },
        ],
        topPerformers: [
          { campaignName: 'Welcome Series - Part 1', openRate: 56.1, clickRate: 12.5 },
          { campaignName: 'Product Announcement', openRate: 52.3, clickRate: 11.8 },
          { campaignName: 'Weekly Newsletter', openRate: 46.0, clickRate: 6.5 }
        ]
      };

      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Modern Newsletter',
          description: 'Clean, professional newsletter template',
          category: 'newsletter',
          thumbnail: '/templates/modern-newsletter.png',
          isCustom: false
        },
        {
          id: '2',
          name: 'Product Launch',
          description: 'Eye-catching template for product announcements',
          category: 'promotional',
          thumbnail: '/templates/product-launch.png',
          isCustom: false
        },
        {
          id: '3',
          name: 'Welcome Series',
          description: 'Warm welcome template for new subscribers',
          category: 'welcome',
          thumbnail: '/templates/welcome-series.png',
          isCustom: false
        }
      ];

      setCampaigns(mockCampaigns);
      setAnalytics(mockAnalytics);
      setTemplates(mockTemplates);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      if (!newCampaign.name || !newCampaign.subject) {
        setError('Campaign name and subject are required');
        return;
      }

      setActionLoading('create-campaign');

      // In real implementation, would call:
      // const response = await fetch('/api/email-campaigns', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(newCampaign)
      // });

      // Mock successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const campaign: EmailCampaign = {
        id: Date.now().toString(),
        name: newCampaign.name,
        subject: newCampaign.subject,
        type: newCampaign.type,
        status: 'draft',
        content: newCampaign.content || 'Campaign content...',
        recipientSegment: newCampaign.recipientSegment,
        recipientCount: Math.floor(Math.random() * 5000) + 1000,
        scheduledAt: newCampaign.scheduledAt || undefined,
        fromName: newCampaign.fromName,
        fromEmail: newCampaign.fromEmail,
        analytics: {
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0,
          openRate: 0,
          clickRate: 0,
          bounceRate: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCampaigns(prev => [campaign, ...prev]);
      setNewCampaign({
        name: '',
        subject: '',
        type: 'newsletter',
        content: '',
        recipientSegment: 'all',
        scheduledAt: '',
        fromName: 'Omnipreneur',
        fromEmail: 'noreply@omnipreneur.com'
      });
      setShowNewCampaign(false);
      setError(null);
    } catch (err) {
      setError('Failed to create campaign');
    } finally {
      setActionLoading(null);
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: EmailCampaign['status']) => {
    try {
      setActionLoading(campaignId);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status, updatedAt: new Date().toISOString() }
          : campaign
      ));
    } catch (err) {
      setError('Failed to update campaign status');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-zinc-400 bg-zinc-900/20 border-zinc-800';
      case 'scheduled': return 'text-blue-400 bg-blue-900/20 border-blue-800';
      case 'sending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'sent': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'paused': return 'text-orange-400 bg-orange-900/20 border-orange-800';
      default: return 'text-zinc-400 bg-zinc-900/20 border-zinc-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'text-green-400 bg-green-900/20';
      case 'newsletter': return 'text-blue-400 bg-blue-900/20';
      case 'promotional': return 'text-purple-400 bg-purple-900/20';
      case 'abandoned-cart': return 'text-orange-400 bg-orange-900/20';
      case 're-engagement': return 'text-pink-400 bg-pink-900/20';
      case 'product-launch': return 'text-cyan-400 bg-cyan-900/20';
      default: return 'text-zinc-400 bg-zinc-900/20';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = search === '' || 
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading email campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Mail className="w-8 h-8 mr-3 text-blue-500" />
                Email Marketing Suite
              </h1>
              <p className="text-zinc-400 mt-2">Create, send, and optimize email campaigns with advanced analytics</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center space-x-2"
              >
                <Palette className="w-4 h-4" />
                <span>Templates</span>
              </button>
              <button 
                onClick={() => setShowNewCampaign(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-zinc-800">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'campaigns', label: 'Campaigns', icon: Mail },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'templates', label: 'Templates', icon: FileText },
                { id: 'segments', label: 'Segments', icon: Users }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Total Campaigns</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.totalCampaigns}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-blue-400">{analytics.activeCampaigns} active</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Emails Sent</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.totalSent.toLocaleString()}</p>
              <p className="text-sm text-zinc-400 mt-1">This month</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Avg Open Rate</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.avgOpenRate}%</p>
              <p className="text-sm text-zinc-400 mt-1">Above industry avg</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
                <Target className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Avg Click Rate</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.avgClickRate}%</p>
              <p className="text-sm text-zinc-400 mt-1">Strong engagement</p>
            </motion.div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <>
            {/* Filters */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search campaigns..."
                      className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sending">Sending</option>
                    <option value="sent">Sent</option>
                    <option value="paused">Paused</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="welcome">Welcome</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="promotional">Promotional</option>
                    <option value="abandoned-cart">Abandoned Cart</option>
                    <option value="re-engagement">Re-engagement</option>
                    <option value="product-launch">Product Launch</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                  <span>Showing {filteredCampaigns.length} of {campaigns.length} campaigns</span>
                  <button className="text-blue-400 hover:text-blue-300">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">Email Campaigns</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Campaign</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Recipients</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Performance</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Scheduled/Sent</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">{campaign.name}</div>
                            <div className="text-sm text-zinc-400">{campaign.subject}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(campaign.type)}`}>
                                {campaign.type.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{campaign.recipientCount.toLocaleString()}</div>
                          <div className="text-sm text-zinc-400 capitalize">{campaign.recipientSegment.replace('-', ' ')}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {campaign.analytics.delivered > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-green-400">{campaign.analytics.openRate}% opens</span>
                                <span className="text-blue-400">{campaign.analytics.clickRate}% clicks</span>
                              </div>
                              <div className="text-xs text-zinc-500">
                                {campaign.analytics.delivered.toLocaleString()} delivered
                              </div>
                            </div>
                          ) : (
                            <span className="text-zinc-500">No data</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          {campaign.sentAt ? (
                            <div className="text-sm">
                              <div className="text-white">Sent</div>
                              <div className="text-zinc-400">{new Date(campaign.sentAt).toLocaleDateString()}</div>
                            </div>
                          ) : campaign.scheduledAt ? (
                            <div className="text-sm">
                              <div className="text-blue-400">Scheduled</div>
                              <div className="text-zinc-400">{new Date(campaign.scheduledAt).toLocaleDateString()}</div>
                            </div>
                          ) : (
                            <span className="text-zinc-500">Not scheduled</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedCampaign(campaign)}
                              className="p-1 text-blue-400 hover:text-blue-300"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-green-400 hover:text-green-300"
                              title="Edit campaign"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {campaign.status === 'draft' && (
                              <button
                                onClick={() => updateCampaignStatus(campaign.id, 'sending')}
                                disabled={actionLoading === campaign.id}
                                className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
                                title="Send now"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            {campaign.status === 'sending' && (
                              <button
                                onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                                disabled={actionLoading === campaign.id}
                                className="p-1 text-orange-400 hover:text-orange-300 disabled:opacity-50"
                                title="Pause campaign"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-1 text-zinc-400 hover:text-white"
                              title="More actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            {/* Performance Chart */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Campaign Performance</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Performance</h3>
                  <div className="space-y-3">
                    {analytics.recentPerformance.map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{new Date(day.date).toLocaleDateString()}</div>
                          <div className="text-sm text-zinc-400">{day.sent.toLocaleString()} sent</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400">{((day.opened / day.sent) * 100).toFixed(1)}% opens</div>
                          <div className="text-blue-400">{((day.clicked / day.sent) * 100).toFixed(1)}% clicks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {analytics.topPerformers.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="text-white font-medium">{campaign.campaignName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400">{campaign.openRate}% opens</div>
                          <div className="text-blue-400">{campaign.clickRate}% clicks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Subscriber Growth</h3>
                <div className="text-3xl font-bold text-green-400 mb-2">+12.5%</div>
                <div className="text-sm text-zinc-400">This month vs last month</div>
                <div className="text-white mt-2">{analytics.totalSubscribers.toLocaleString()} total subscribers</div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Delivery Rate</h3>
                <div className="text-3xl font-bold text-green-400 mb-2">98.7%</div>
                <div className="text-sm text-zinc-400">Excellent deliverability</div>
                <div className="text-white mt-2">1.3% bounce rate</div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Unsubscribe Rate</h3>
                <div className="text-3xl font-bold text-orange-400 mb-2">0.2%</div>
                <div className="text-sm text-zinc-400">Well below industry average</div>
                <div className="text-white mt-2">Healthy engagement</div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Email Templates</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500 transition-colors">
                  <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                    <Image className="w-12 h-12 text-zinc-600" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      {template.isCustom && (
                        <span className="px-2 py-1 bg-purple-900/20 text-purple-400 text-xs rounded">Custom</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 mb-4">{template.description}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                        Use Template
                      </button>
                      <button className="px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Segments Tab */}
        {activeTab === 'segments' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Audience Segments</h2>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Segment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'All Subscribers', count: 12500, description: 'All active subscribers' },
                { name: 'New Users', count: 1250, description: 'Users who joined in the last 30 days' },
                { name: 'Pro Users', count: 2340, description: 'Users with Pro or higher subscription' },
                { name: 'Inactive Users', count: 1890, description: 'No activity in the last 90 days' },
                { name: 'Cart Abandoners', count: 456, description: 'Users who abandoned their cart' },
                { name: 'High Engagement', count: 3200, description: 'Users with high open/click rates' }
              ].map((segment, index) => (
                <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <button className="text-zinc-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{segment.name}</h3>
                  <p className="text-sm text-zinc-400 mb-4">{segment.description}</p>
                  <div className="text-2xl font-bold text-blue-400">{segment.count.toLocaleString()}</div>
                  <div className="text-sm text-zinc-500">subscribers</div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                      Send Campaign
                    </button>
                    <button className="px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Campaign Modal */}
        {showNewCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">Create Email Campaign</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Campaign Name *</label>
                    <input
                      type="text"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter campaign name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Type</label>
                    <select
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="newsletter">Newsletter</option>
                      <option value="welcome">Welcome</option>
                      <option value="promotional">Promotional</option>
                      <option value="abandoned-cart">Abandoned Cart</option>
                      <option value="re-engagement">Re-engagement</option>
                      <option value="product-launch">Product Launch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Subject Line *</label>
                  <input
                    type="text"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter subject line"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">From Name</label>
                    <input
                      type="text"
                      value={newCampaign.fromName}
                      onChange={(e) => setNewCampaign({ ...newCampaign, fromName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">From Email</label>
                    <input
                      type="email"
                      value={newCampaign.fromEmail}
                      onChange={(e) => setNewCampaign({ ...newCampaign, fromEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Recipient Segment</label>
                    <select
                      value={newCampaign.recipientSegment}
                      onChange={(e) => setNewCampaign({ ...newCampaign, recipientSegment: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Subscribers</option>
                      <option value="new-users">New Users</option>
                      <option value="pro-users">Pro Users</option>
                      <option value="inactive-users">Inactive Users</option>
                      <option value="cart-abandoners">Cart Abandoners</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Schedule (optional)</label>
                    <input
                      type="datetime-local"
                      value={newCampaign.scheduledAt}
                      onChange={(e) => setNewCampaign({ ...newCampaign, scheduledAt: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Content</label>
                  <textarea
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter email content or select a template..."
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewCampaign(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCampaign}
                    disabled={actionLoading === 'create-campaign'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {actionLoading === 'create-campaign' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>Create Campaign</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Details Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{selectedCampaign.name}</h2>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Campaign Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-zinc-400">Subject:</span>
                        <div className="text-white">{selectedCampaign.subject}</div>
                      </div>
                      <div>
                        <span className="text-sm text-zinc-400">Type:</span>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedCampaign.type)}`}>
                            {selectedCampaign.type.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-zinc-400">Status:</span>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedCampaign.status)}`}>
                            {selectedCampaign.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-zinc-400">Recipients:</span>
                        <div className="text-white">{selectedCampaign.recipientCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-zinc-400">From:</span>
                        <div className="text-white">{selectedCampaign.fromName} &lt;{selectedCampaign.fromEmail}&gt;</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Performance Analytics</h3>
                    {selectedCampaign.analytics.delivered > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">{selectedCampaign.analytics.openRate}%</div>
                            <div className="text-sm text-zinc-400">Open Rate</div>
                            <div className="text-xs text-zinc-500">{selectedCampaign.analytics.opened.toLocaleString()} opens</div>
                          </div>
                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{selectedCampaign.analytics.clickRate}%</div>
                            <div className="text-sm text-zinc-400">Click Rate</div>
                            <div className="text-xs text-zinc-500">{selectedCampaign.analytics.clicked.toLocaleString()} clicks</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-white">{selectedCampaign.analytics.delivered.toLocaleString()}</div>
                            <div className="text-sm text-zinc-400">Delivered</div>
                            <div className="text-xs text-zinc-500">{selectedCampaign.analytics.bounceRate}% bounce rate</div>
                          </div>
                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-orange-400">{selectedCampaign.analytics.unsubscribed}</div>
                            <div className="text-sm text-zinc-400">Unsubscribed</div>
                            <div className="text-xs text-zinc-500">Low churn rate</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">No analytics data available</p>
                        <p className="text-zinc-500 text-sm">Campaign hasn't been sent yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Email Content</h3>
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    <div className="text-zinc-300 whitespace-pre-wrap">{selectedCampaign.content}</div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit Campaign</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}