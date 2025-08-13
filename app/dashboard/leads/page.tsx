'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  Star,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  UserPlus,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'OPPORTUNITY' | 'CUSTOMER' | 'LOST';
  score: number;
  value?: number;
  tags: string[];
  notes?: string;
  lastContact?: string;
  nextFollowUp?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadAnalytics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageScore: number;
  totalValue: number;
  sourceBreakdown: Array<{
    source: string;
    count: number;
    conversionRate: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

interface AILeadInsights {
  recommendations: Array<{
    leadId: string;
    leadName: string;
    action: 'contact' | 'nurture' | 'qualify' | 'close';
    priority: 'high' | 'medium' | 'low';
    reason: string;
    suggestedMessage?: string;
  }>;
  patterns: {
    bestContactTime: string;
    mostEffectiveSource: string;
    averageTimeToConvert: string;
    topConversionFactors: string[];
  };
  forecasting: {
    expectedConversions: number;
    projectedRevenue: number;
    riskFactors: string[];
  };
}

export default function LeadManagementDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [aiInsights, setAiInsights] = useState<AILeadInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [showNewLead, setShowNewLead] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New lead form
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    source: 'website',
    tags: ''
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Fetch real leads data from API
      const response = await fetch('/api/leads', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view leads');
        }
        if (response.status === 403) {
          throw new Error('Access denied. Lead management requires pro subscription.');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch leads`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setLeads(result.data.leads || []);
        setAnalytics(result.data.analytics || null);
        setError(null);
      } else {
        // Fallback to mock data if API not fully implemented
        console.warn('Using fallback mock data for leads');
        const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.j@techcorp.com',
          phone: '+1-555-0123',
          company: 'TechCorp Inc',
          title: 'Marketing Director',
          source: 'website',
          status: 'QUALIFIED',
          score: 85,
          value: 15000,
          tags: ['enterprise', 'marketing'],
          notes: 'Interested in enterprise package, has budget approved',
          lastContact: '2024-02-09T10:00:00Z',
          nextFollowUp: '2024-02-12T14:00:00Z',
          createdAt: '2024-02-05T08:00:00Z',
          updatedAt: '2024-02-09T10:00:00Z'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'm.chen@startup.io',
          phone: '+1-555-0456',
          company: 'StartupIO',
          title: 'CEO',
          source: 'linkedin',
          status: 'NEW',
          score: 72,
          value: 8500,
          tags: ['startup', 'saas'],
          notes: 'Reached out via LinkedIn, looking for growth tools',
          createdAt: '2024-02-10T12:00:00Z',
          updatedAt: '2024-02-10T12:00:00Z'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily@digitalagency.com',
          company: 'Digital Agency Co',
          title: 'Operations Manager',
          source: 'referral',
          status: 'CONTACTED',
          score: 68,
          value: 12000,
          tags: ['agency', 'operations'],
          notes: 'Referred by existing customer, scheduled demo for next week',
          lastContact: '2024-02-08T16:00:00Z',
          nextFollowUp: '2024-02-15T10:00:00Z',
          createdAt: '2024-02-07T14:00:00Z',
          updatedAt: '2024-02-08T16:00:00Z'
        },
        {
          id: '4',
          name: 'David Kim',
          email: 'david.kim@enterprise.com',
          phone: '+1-555-0789',
          company: 'Enterprise Solutions',
          title: 'VP of Sales',
          source: 'webinar',
          status: 'OPPORTUNITY',
          score: 91,
          value: 25000,
          tags: ['enterprise', 'sales'],
          notes: 'Very interested, in final decision phase',
          lastContact: '2024-02-09T15:00:00Z',
          nextFollowUp: '2024-02-11T11:00:00Z',
          createdAt: '2024-01-28T09:00:00Z',
          updatedAt: '2024-02-09T15:00:00Z'
        },
        {
          id: '5',
          name: 'Lisa Thompson',
          email: 'lisa@smallbiz.com',
          company: 'Small Business Solutions',
          title: 'Owner',
          source: 'google-ads',
          status: 'LOST',
          score: 45,
          tags: ['small-business'],
          notes: 'Budget constraints, not ready to purchase',
          lastContact: '2024-02-05T13:00:00Z',
          createdAt: '2024-01-25T11:00:00Z',
          updatedAt: '2024-02-05T13:00:00Z'
        }
      ];

      const mockAnalytics: LeadAnalytics = {
        totalLeads: mockLeads.length,
        newLeads: mockLeads.filter(l => l.status === 'NEW').length,
        qualifiedLeads: mockLeads.filter(l => ['QUALIFIED', 'OPPORTUNITY'].includes(l.status)).length,
        conversionRate: 28.5,
        averageScore: mockLeads.reduce((sum, l) => sum + l.score, 0) / mockLeads.length,
        totalValue: mockLeads.reduce((sum, l) => sum + (l.value || 0), 0),
        sourceBreakdown: [
          { source: 'website', count: 1, conversionRate: 65 },
          { source: 'linkedin', count: 1, conversionRate: 42 },
          { source: 'referral', count: 1, conversionRate: 78 },
          { source: 'webinar', count: 1, conversionRate: 85 },
          { source: 'google-ads', count: 1, conversionRate: 23 }
        ],
        scoreDistribution: [
          { range: '80-100', count: 2, percentage: 40 },
          { range: '60-79', count: 2, percentage: 40 },
          { range: '40-59', count: 1, percentage: 20 },
          { range: '0-39', count: 0, percentage: 0 }
        ]
      };

      setLeads(mockLeads);
      setAnalytics(mockAnalytics);
      setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      setActionLoading('ai-insights');
      
      // Mock AI insights
      const mockInsights: AILeadInsights = {
        recommendations: [
          {
            leadId: '4',
            leadName: 'David Kim',
            action: 'close',
            priority: 'high',
            reason: 'High score (91), in opportunity stage, last contact 2 days ago. Strong buying signals detected.',
            suggestedMessage: 'Hi David, following up on our conversation about Enterprise Solutions. I have the proposal ready and can walk you through the implementation timeline. Are you available for a quick call this afternoon?'
          },
          {
            leadId: '1',
            leadName: 'Sarah Johnson',
            action: 'nurture',
            priority: 'high',
            reason: 'Qualified lead with approved budget, but follow-up is due. Maintain momentum.',
            suggestedMessage: 'Hi Sarah, hope your week is going well! I wanted to share some case studies from similar marketing teams who\'ve seen great results with our platform. Would you like to schedule a technical demo?'
          },
          {
            leadId: '2',
            leadName: 'Michael Chen',
            action: 'contact',
            priority: 'medium',
            reason: 'New lead from LinkedIn with good score (72), no contact attempt yet.',
            suggestedMessage: 'Hi Michael, thanks for your interest in our growth tools. I saw you\'re building something exciting at StartupIO. I\'d love to learn more about your challenges and show you how we can help accelerate your growth.'
          }
        ],
        patterns: {
          bestContactTime: 'Tuesday-Thursday, 2-4 PM',
          mostEffectiveSource: 'Referrals (78% conversion)',
          averageTimeToConvert: '18 days',
          topConversionFactors: ['Enterprise company size', 'Director+ title', 'Previous contact with sales', 'Webinar attendance']
        },
        forecasting: {
          expectedConversions: 2,
          projectedRevenue: 40000,
          riskFactors: ['Long sales cycles', 'Budget approval delays', 'Competitor activity']
        }
      };

      setAiInsights(mockInsights);
    } catch (err) {
      setError('Failed to generate AI insights');
    } finally {
      setActionLoading(null);
    }
  };

  const captureLead = async () => {
    try {
      if (!newLead.name || !newLead.email) {
        setError('Name and email are required');
        return;
      }

      setActionLoading('create-lead');

      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone || undefined,
          company: newLead.company || undefined,
          title: newLead.title || undefined,
          source: newLead.source,
          tags: newLead.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to capture leads');
        }
        if (response.status === 403) {
          throw new Error('Lead capture requires pro subscription');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: Lead capture failed`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Add the new lead to the list
        setLeads(prev => [result.data, ...prev]);
        
        // Reset form
        setNewLead({
          name: '',
          email: '',
          phone: '',
          company: '',
          title: '',
          source: 'website',
          tags: ''
        });
        setShowNewLead(false);
        setError(null);
      } else {
        throw new Error(result.error?.message || 'Failed to capture lead');
      }
    } catch (err) {
      console.error('Lead capture error:', err);
      setError(err instanceof Error ? err.message : 'Failed to capture lead');
    } finally {
      setActionLoading(null);
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    try {
      setActionLoading(leadId);
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to update leads');
        }
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: Update failed`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Update the lead in the list
        setLeads(prev => prev.map(lead => 
          lead.id === leadId ? result.data : lead
        ));
        setError(null);
      } else {
        throw new Error(result.error?.message || 'Failed to update lead status');
      }
    } catch (err) {
      console.error('Lead update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lead status');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'text-blue-400 bg-blue-900/20 border-blue-800';
      case 'CONTACTED': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'QUALIFIED': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'OPPORTUNITY': return 'text-purple-400 bg-purple-900/20 border-purple-800';
      case 'CUSTOMER': return 'text-emerald-400 bg-emerald-900/20 border-emerald-800';
      case 'LOST': return 'text-red-400 bg-red-900/20 border-red-800';
      default: return 'text-zinc-400 bg-zinc-900/20 border-zinc-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <ArrowUpRight className="w-4 h-4" />;
    if (score >= 60) return <Minus className="w-4 h-4" />;
    return <ArrowDownRight className="w-4 h-4" />;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = search === '' || 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesScore = scoreFilter === 'all' || 
      (scoreFilter === 'high' && lead.score >= 80) ||
      (scoreFilter === 'medium' && lead.score >= 60 && lead.score < 80) ||
      (scoreFilter === 'low' && lead.score < 60);

    return matchesSearch && matchesStatus && matchesSource && matchesScore;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading leads...</p>
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
                <Target className="w-8 h-8 mr-3 text-blue-500" />
                Lead Management
              </h1>
              <p className="text-zinc-400 mt-2">Capture, score, and nurture leads with AI-powered insights</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setShowAiInsights(!showAiInsights);
                  if (!showAiInsights && !aiInsights) {
                    generateAIInsights();
                  }
                }}
                disabled={actionLoading === 'ai-insights'}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading === 'ai-insights' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                <span>AI Insights</span>
              </button>
              <button 
                onClick={() => setShowNewLead(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Total Leads</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.totalLeads}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-blue-400">{analytics.newLeads} new</span>
                <span className="text-green-400">{analytics.qualifiedLeads} qualified</span>
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
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Conversion Rate</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.conversionRate}%</p>
              <p className="text-sm text-zinc-400 mt-1">Above industry average</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Avg Lead Score</h3>
              <p className="text-3xl font-bold text-white mt-2">{Math.round(analytics.averageScore)}</p>
              <p className="text-sm text-zinc-400 mt-1">Quality indicator</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Pipeline Value</h3>
              <p className="text-3xl font-bold text-white mt-2">${analytics.totalValue.toLocaleString()}</p>
              <p className="text-sm text-zinc-400 mt-1">Potential revenue</p>
            </motion.div>
          </div>
        )}

        {/* AI Insights Panel */}
        {showAiInsights && aiInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-800/50 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Brain className="w-6 h-6 mr-3 text-purple-400" />
                AI Lead Insights
              </h2>
              <button
                onClick={() => setShowAiInsights(false)}
                className="text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recommendations */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Priority Recommendations</h3>
                <div className="space-y-4">
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={rec.leadId} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-white">{rec.leadName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === 'high' ? 'text-red-400 bg-red-900/20' :
                              rec.priority === 'medium' ? 'text-yellow-400 bg-yellow-900/20' :
                              'text-green-400 bg-green-900/20'
                            }`}>
                              {rec.priority} priority
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              rec.action === 'close' ? 'text-green-400 bg-green-900/20 border-green-800' :
                              rec.action === 'contact' ? 'text-blue-400 bg-blue-900/20 border-blue-800' :
                              rec.action === 'nurture' ? 'text-purple-400 bg-purple-900/20 border-purple-800' :
                              'text-yellow-400 bg-yellow-900/20 border-yellow-800'
                            }`}>
                              {rec.action}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-300 mb-3">{rec.reason}</p>
                          {rec.suggestedMessage && (
                            <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3">
                              <p className="text-xs text-zinc-400 mb-1">Suggested message:</p>
                              <p className="text-sm text-zinc-200">{rec.suggestedMessage}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button className="p-2 text-blue-400 hover:text-blue-300">
                            <Send className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-zinc-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patterns & Forecasting */}
              <div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Lead Patterns</h3>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm text-zinc-400">Best Contact Time</p>
                        <p className="text-white font-medium">{aiInsights.patterns.bestContactTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Most Effective Source</p>
                        <p className="text-white font-medium">{aiInsights.patterns.mostEffectiveSource}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Avg Time to Convert</p>
                        <p className="text-white font-medium">{aiInsights.patterns.averageTimeToConvert}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Forecasting</h3>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm text-zinc-400">Expected Conversions</p>
                        <p className="text-2xl font-bold text-green-400">{aiInsights.forecasting.expectedConversions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Projected Revenue</p>
                        <p className="text-xl font-bold text-white">${aiInsights.forecasting.projectedRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
                  placeholder="Search leads..."
                  className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="OPPORTUNITY">Opportunity</option>
                <option value="CUSTOMER">Customer</option>
                <option value="LOST">Lost</option>
              </select>

              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (&lt;60)</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <span>Showing {filteredLeads.length} of {leads.length} leads</span>
              <button className="text-blue-400 hover:text-blue-300">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">Leads</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Lead</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Value</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Source</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Last Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="text-sm text-zinc-400">{lead.email}</div>
                        {lead.company && (
                          <div className="text-xs text-zinc-500">{lead.company}</div>
                        )}
                        {lead.tags.length > 0 && (
                          <div className="flex space-x-1 mt-1">
                            {lead.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-0.5 bg-blue-900/20 text-blue-400 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                            {lead.tags.length > 2 && (
                              <span className="text-xs text-zinc-500">+{lead.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        disabled={actionLoading === lead.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent focus:outline-none ${getStatusColor(lead.status)}`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="OPPORTUNITY">Opportunity</option>
                        <option value="CUSTOMER">Customer</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className={`flex items-center space-x-1 ${getScoreColor(lead.score)}`}>
                        {getScoreIcon(lead.score)}
                        <span className="font-medium">{lead.score}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {lead.value ? (
                        <span className="font-medium text-white">${lead.value.toLocaleString()}</span>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="capitalize text-zinc-300">{lead.source.replace('-', ' ')}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      {lead.lastContact ? (
                        <div className="text-sm">
                          <div className="text-white">{new Date(lead.lastContact).toLocaleDateString()}</div>
                          {lead.nextFollowUp && (
                            <div className="text-xs text-zinc-400">
                              Next: {new Date(lead.nextFollowUp).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-500">Never</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-green-400 hover:text-green-300"
                          title="Send email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
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

        {/* Add Lead Modal */}
        {showNewLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">Add New Lead</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Name *</label>
                    <input
                      type="text"
                      value={newLead.name}
                      onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Company</label>
                    <input
                      type="text"
                      value={newLead.company}
                      onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={newLead.title}
                      onChange={(e) => setNewLead({ ...newLead, title: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Source</label>
                    <select
                      value={newLead.source}
                      onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="website">Website</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="webinar">Webinar</option>
                      <option value="google-ads">Google Ads</option>
                      <option value="email">Email Campaign</option>
                      <option value="phone">Cold Call</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newLead.tags}
                    onChange={(e) => setNewLead({ ...newLead, tags: e.target.value })}
                    placeholder="enterprise, marketing, urgent"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                    onClick={() => setShowNewLead(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={captureLead}
                    disabled={actionLoading === 'create-lead'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {actionLoading === 'create-lead' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>Add Lead</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{selectedLead.name}</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-zinc-400">Email:</span>
                        <div className="text-white">{selectedLead.email}</div>
                      </div>
                      {selectedLead.phone && (
                        <div>
                          <span className="text-sm text-zinc-400">Phone:</span>
                          <div className="text-white">{selectedLead.phone}</div>
                        </div>
                      )}
                      {selectedLead.company && (
                        <div>
                          <span className="text-sm text-zinc-400">Company:</span>
                          <div className="text-white">{selectedLead.company}</div>
                        </div>
                      )}
                      {selectedLead.title && (
                        <div>
                          <span className="text-sm text-zinc-400">Title:</span>
                          <div className="text-white">{selectedLead.title}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Lead Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-zinc-400">Status:</span>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedLead.status)}`}>
                            {selectedLead.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-zinc-400">Score:</span>
                        <div className={`flex items-center space-x-1 ${getScoreColor(selectedLead.score)}`}>
                          {getScoreIcon(selectedLead.score)}
                          <span className="font-medium">{selectedLead.score}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-zinc-400">Source:</span>
                        <div className="text-white capitalize">{selectedLead.source.replace('-', ' ')}</div>
                      </div>
                      {selectedLead.value && (
                        <div>
                          <span className="text-sm text-zinc-400">Value:</span>
                          <div className="text-white font-medium">${selectedLead.value.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedLead.tags.length > 0 && (
                  <div className="mt-6">
                    <span className="text-sm text-zinc-400">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedLead.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLead.notes && (
                  <div className="mt-6">
                    <span className="text-sm text-zinc-400">Notes:</span>
                    <div className="text-white mt-2 p-3 bg-zinc-800/50 rounded-lg">
                      {selectedLead.notes}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit Lead</span>
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