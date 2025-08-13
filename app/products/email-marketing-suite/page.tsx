"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Zap,
  BarChart3,
  Target,
  Calendar,
  Brain,
  Eye,
  Clock,
  Filter,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Activity
} from 'lucide-react';
import ProductPageTemplate from '../../components/ProductPageTemplate';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  openRate: number;
  clickRate: number;
  subscribers: number;
}

export default function EmailMarketingSuite() {
  const [selectedCampaign, setSelectedCampaign] = useState("welcome");
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: 'Welcome Series', type: 'Automated', status: 'active', openRate: 45.2, clickRate: 12.8, subscribers: 1250 },
    { id: '2', name: 'Product Launch', type: 'Broadcast', status: 'sent', openRate: 38.7, clickRate: 9.3, subscribers: 3400 },
    { id: '3', name: 'Newsletter #42', type: 'Newsletter', status: 'scheduled', openRate: 0, clickRate: 0, subscribers: 5200 },
    { id: '4', name: 'Cart Abandonment', type: 'Automated', status: 'active', openRate: 42.1, clickRate: 15.7, subscribers: 890 }
  ]);

  const campaignTypes = [
    { id: "welcome", name: "Welcome Series", description: "New subscriber onboarding", icon: Users },
    { id: "newsletter", name: "Newsletter", description: "Regular content updates", icon: Mail },
    { id: "promotional", name: "Promotional", description: "Sales and offers", icon: TrendingUp },
    { id: "abandoned-cart", name: "Abandoned Cart", description: "Recovery campaigns", icon: Target },
    { id: "re-engagement", name: "Re-engagement", description: "Win-back campaigns", icon: Zap },
    { id: "product-launch", name: "Product Launch", description: "New product announcements", icon: Send }
  ];

  const features = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Smart Email Campaigns",
      description: "AI-powered email creation with intelligent content optimization and personalization"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Advanced Segmentation",
      description: "Intelligent audience segmentation based on behavior, preferences, and engagement"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Comprehensive analytics with predictive insights and optimization recommendations"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Automation Workflows",
      description: "Sophisticated automation sequences with trigger-based intelligent responses"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "A/B Testing",
      description: "Advanced split testing with statistical significance and automated winner selection"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Optimization",
      description: "Machine learning algorithms for send time, subject line, and content optimization"
    }
  ];

  const stats = [
    { label: "Email Deliverability", value: "99.3%", icon: <Send className="w-5 h-5" /> },
    { label: "Average Open Rate", value: "47.8%", icon: <Eye className="w-5 h-5" /> },
    { label: "Campaign ROI", value: "4,200%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Active Users", value: "180K+", icon: <Users className="w-5 h-5" /> }
  ];

  const pricingPlans = [
    {
      name: "Email Starter",
      price: "$29",
      features: [
        "Up to 10,000 subscribers",
        "Unlimited emails",
        "Basic automation",
        "Email templates",
        "Analytics dashboard",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Email Professional",
      price: "$99",
      features: [
        "Up to 50,000 subscribers",
        "Advanced automation",
        "A/B testing",
        "Advanced segmentation",
        "Priority support",
        "Custom integrations",
        "AI optimization"
      ],
      popular: true,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Email Enterprise",
      price: "$299",
      features: [
        "Unlimited subscribers",
        "Custom AI models",
        "Advanced analytics",
        "Dedicated support",
        "White-label solution",
        "API access",
        "Enterprise security"
      ],
      popular: false
    }
  ];

  const handleGenerateEmail = async () => {
    if (!emailSubject.trim()) {
      alert('Please enter an email subject');
      return;
    }

    setIsGenerating(true);
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        setEmailContent('🔒 Please log in to generate email campaigns.');
        setIsGenerating(false);
        return;
      }

      const response = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          name: `Campaign - ${emailSubject}`,
          type: selectedCampaign,
          subject: emailSubject,
          content: emailContent || 'AI-generated email content will appear here...',
          recipientSegment: 'all',
          sendImmediately: false,
          fromName: 'Your Business',
          fromEmail: 'hello@yourbusiness.com'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setEmailContent('🔒 Email Marketing Suite subscription required. Please upgrade to create email campaigns.');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          setEmailContent('📊 Monthly campaign limit reached. Please upgrade your plan for more campaigns.');
        } else {
          setEmailContent('❌ Error creating email campaign. Please try again.');
        }
        return;
      }

      if (data.success && data.data) {
        const campaign = data.data.campaign;
        const emailCampaign = {
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          campaign_type: campaign.type,
          subject_line: campaign.subject,
          ai_optimized_content: campaign.content,
          recipient_count: campaign.recipientCount || 0,
          ai_optimizations: campaign.aiOptimizations || ['Subject line optimization', 'Content personalization', 'Send time optimization'],
          status: campaign.status,
          created_at: campaign.createdAt,
          processing_message: data.data.message
        };

        setEmailContent(JSON.stringify(emailCampaign, null, 2));
        
        // Refresh campaigns list
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error creating email campaign:', error);
      setEmailContent('❌ Error creating email campaign. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) return;

      const response = await fetch('/api/email-campaigns', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.campaigns) {
          setCampaigns(data.data.campaigns.map((campaign: any) => ({
            id: campaign.id,
            name: campaign.name,
            type: campaign.type,
            status: campaign.status || 'draft',
            openRate: campaign.openRate || 0,
            clickRate: campaign.clickRate || 0,
            subscribers: campaign.recipientCount || 0
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'sent': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'draft': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const demoComponent = (
    <motion.div
      className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Email Campaign Studio</h3>
        <p className="text-zinc-400">Create, manage, and optimize email campaigns with AI-powered insights</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Email Creation */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Campaign Type</label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
            >
              {campaignTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Email Subject *</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              placeholder="Enter compelling subject line"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleGenerateEmail}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <motion.div 
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Email Preview */}
          <div className="bg-zinc-800/40 rounded-2xl p-6 border border-zinc-700/50">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span>Email Preview</span>
            </h4>
            
            {emailContent ? (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl text-black text-sm">
                  <div className="border-b border-gray-200 pb-2 mb-3">
                    <div className="font-semibold">Subject: {emailSubject}</div>
                    <div className="text-gray-600 text-xs">From: your-company@example.com</div>
                  </div>
                  <div className="whitespace-pre-wrap">{emailContent}</div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 py-2 px-4 rounded-xl text-sm hover:bg-purple-500/30 transition-colors">
                    <Send className="w-4 h-4 inline mr-2" />
                    Send Test
                  </button>
                  <button className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 py-2 px-4 rounded-xl text-sm hover:bg-blue-500/30 transition-colors">
                    <Edit className="w-4 h-4 inline mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">Enter a subject to generate email content</p>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Dashboard */}
        <div className="space-y-6">
          <div className="bg-zinc-800/40 rounded-2xl p-6 border border-zinc-700/50">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>Active Campaigns</span>
            </h4>
            
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-zinc-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-white">{campaign.name}</h5>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{campaign.openRate}%</div>
                      <div className="text-xs text-zinc-400">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{campaign.clickRate}%</div>
                      <div className="text-xs text-zinc-400">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{campaign.subscribers.toLocaleString()}</div>
                      <div className="text-xs text-zinc-400">Subscribers</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-2 text-purple-400 mb-3">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">AI Email Insights</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="text-zinc-300">
                <div className="font-medium text-white mb-1">Best Send Time</div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span>Tuesday 10:30 AM (+23% open rate)</span>
                </div>
              </div>
              <div className="text-zinc-300">
                <div className="font-medium text-white mb-1">Subject Line Optimization</div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span>Add urgency words for +15% improvement</span>
                </div>
              </div>
              <div className="text-zinc-300">
                <div className="font-medium text-white mb-1">Segment Performance</div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>VIP segment shows 3x higher engagement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleGetStarted = () => {
    window.location.href = '/auth/register';
  };

  const handleWatchDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ProductPageTemplate
      title="Email Marketing Suite"
      subtitle="AI-Powered Email Excellence"
      description="Revolutionary email marketing platform with AI-driven personalization, intelligent automation, and predictive analytics for maximum engagement and ROI."
      heroIcon={<Mail className="w-12 h-12" />}
      heroGradient="from-purple-500 to-pink-500"
      features={features}
      stats={stats}
      pricingPlans={pricingPlans}
      demoComponent={demoComponent}
      onGetStarted={handleGetStarted}
      onWatchDemo={handleWatchDemo}
      primaryColor="purple"
      accentColor="pink"
    />
  );
}