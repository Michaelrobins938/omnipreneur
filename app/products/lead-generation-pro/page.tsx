"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Target, 
  BarChart3,
  Search,
  Eye,
  Clock,
  ArrowUpRight,
  ShoppingCart,
  Mail,
  Brain,
  Activity,
  Filter,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function LeadGenerationPro() {
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
const [selectedBudget, setSelectedBudget] = useState('medium');
const [isGenerating, setIsGenerating] = useState(false);
const [generatedLeads, setGeneratedLeads] = useState('');
  const [aiAnalytics, setAiAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);

  const handleAnalyzeLeads = async () => {
    setIsLoadingAnalytics(true);
    try {
      // Simulate API call to the enhanced lead scoring endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock comprehensive AI analytics response
      const mockAnalytics = {
        leadScores: [
          { leadId: 'lead-1', overallScore: 92, grade: 'A', priority: 'hot', conversionProbability: 0.87 },
          { leadId: 'lead-2', overallScore: 78, grade: 'B', priority: 'warm', conversionProbability: 0.65 },
          { leadId: 'lead-3', overallScore: 45, grade: 'D', priority: 'cold', conversionProbability: 0.23 },
          { leadId: 'lead-4', overallScore: 89, grade: 'A', priority: 'hot', conversionProbability: 0.82 },
          { leadId: 'lead-5', overallScore: 67, grade: 'C', priority: 'warm', conversionProbability: 0.48 }
        ],
        sourceAnalysis: {
          topSources: [
            { source: 'LinkedIn', averageScore: 84, conversionRate: 0.72 },
            { source: 'Website', averageScore: 76, conversionRate: 0.58 },
            { source: 'Email Campaign', averageScore: 69, conversionRate: 0.45 }
          ]
        },
        predictions: {
          expectedConversions: 12,
          timeline: '2-3 weeks',
          revenueProjection: 45000
        },
        metadata: {
          leadCount: 5,
          averageScore: 74.2,
          distribution: { hot: 2, warm: 2, cold: 1 }
        }
      };
      
      setAiAnalytics(mockAnalytics);
      setShowAnalyticsDashboard(true);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const industries = [
    { id: 'technology', name: 'Technology', icon: Zap },
    { id: 'healthcare', name: 'Healthcare', icon: Target },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'education', name: 'Education', icon: Users },
    { id: 'real-estate', name: 'Real Estate', icon: BarChart3 },
    { id: 'retail', name: 'Retail', icon: ShoppingCart }
  ];

  const features = [
    {
      icon: Search,
      title: "AI Lead Discovery",
      description: "Intelligent prospecting with advanced targeting algorithms"
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Hyper-targeted lead generation based on ideal customer profiles"
    },
    {
      icon: Mail,
      title: "Multi-Channel Outreach",
      description: "Email, phone, social media, and LinkedIn automation"
    },
    {
      icon: Eye,
      title: "Lead Scoring",
      description: "AI-powered lead qualification and prioritization"
    },
    {
      icon: TrendingUp,
      title: "Conversion Tracking",
      description: "Real-time analytics and conversion rate optimization"
    },
    {
      icon: Clock,
      title: "Automated Follow-up",
      description: "Smart nurturing sequences and engagement automation"
    }
  ];

  const pricingPlans = [
    {
      name: "Lead Starter",
      price: "$49",
      period: "/month",
      features: [
        "Up to 500 leads per month",
        "Basic targeting tools",
        "Email automation",
        "Standard analytics",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Lead Professional",
      price: "$149",
      period: "/month",
      features: [
        "Up to 2,000 leads per month",
        "Advanced targeting",
        "Multi-channel outreach",
        "Priority support",
        "Custom integrations",
        "Lead scoring"
      ],
      popular: true
    },
    {
      name: "Lead Enterprise",
      price: "$399",
      period: "/month",
      features: [
        "Unlimited leads",
        "Enterprise targeting",
        "Advanced analytics",
        "Dedicated support",
        "API access",
        "White-label options",
        "Custom development"
      ],
      popular: false
    }
  ];

  const handleLeadGeneration = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/leads/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          industry: selectedIndustry || 'general',
          targetAudience: 'businesses',
          geography: 'global',
          budget: selectedBudget || 'medium',
          leadType: 'qualified',
          quantity: 50
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate leads');
      }

      const data = await response.json();
      
      // Generate realistic lead data
      const leadData = {
        leads_generated: Math.floor(Math.random() * 50 + 25),
        ai_insights: data.data?.content || 'AI-generated lead generation strategy',
        conversion_rate: `${Math.floor(Math.random() * 15 + 10)}%`,
        qualified_prospects: Math.floor(Math.random() * 30 + 15),
        estimated_revenue: `$${Math.floor(Math.random() * 10000 + 5000).toLocaleString()}`,
        top_sources: ['LinkedIn', 'Email campaigns', 'Content marketing', 'Social media'],
        status: 'Leads generated successfully'
      };

      setGeneratedLeads(JSON.stringify(leadData, null, 2));
    } catch (error) {
      console.error('Error generating leads:', error);
      setGeneratedLeads('Error generating leads. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
            >
              <Users className="w-4 h-4 mr-2" />
              Powered by CAL™ Technology
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Lead Generation
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Pro</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate high-quality leads with AI-powered prospecting. From discovery to conversion, 
              our intelligent system finds and nurtures your ideal customers.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Start Generating Free
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200">
                View Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "2M+", label: "Leads Generated" },
              { icon: Target, value: "85%", label: "Qualification Rate" },
              { icon: TrendingUp, value: "3.2x", label: "Conversion Boost" },
              { icon: Zap, value: "24/7", label: "AI Prospecting" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Intelligent Lead Generation
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI analyzes market data, identifies prospects, and automates outreach to generate 
              qualified leads that convert. From research to revenue, we handle everything.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Try Our Lead Generation Pro
            </h2>
            <p className="text-xl text-gray-400">
              Experience the power of AI-driven lead generation
            </p>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Industry Selection */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Choose Industry</h3>
                <div className="grid grid-cols-2 gap-4">
                  {industries.map((industry) => {
                    const IconComponent = industry.icon;
                    return (
                      <button
                        key={industry.id}
                        onClick={() => setSelectedIndustry(industry.id)}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          selectedIndustry === industry.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-white mb-2" />
                        <div className="text-white font-medium">{industry.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lead Generation Results */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">AI Lead Generation</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Prospects Found</span>
                      <span className="text-green-400">1,247</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Qualification Rate</span>
                      <span className="text-blue-400">87%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Conversion Potential</span>
                      <span className="text-purple-400">+320%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <button
                    onClick={handleLeadGeneration}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 mb-3"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Leads'}
                  </button>
                  
                  <button
                    onClick={handleAnalyzeLeads}
                    disabled={isLoadingAnalytics}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    {isLoadingAnalytics ? 'Analyzing...' : 'AI Lead Analytics'}
                  </button>
                </div>
              </div>
            </div>

            {generatedLeads && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-center text-green-400 mb-2">
                  <ArrowUpRight className="w-5 h-5 mr-2" />
                  Leads Generated Successfully!
                </div>
                <p className="text-gray-300">
                  We&apos;ve identified 1,247 qualified prospects in the {selectedIndustry} industry. 
                  Your outreach campaign is ready to launch with a projected 87% qualification rate.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* AI Analytics Dashboard */}
      {showAnalyticsDashboard && aiAnalytics && (
        <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 mr-3 text-purple-400" />
                AI Lead Analytics Dashboard
              </h2>
              <p className="text-xl text-gray-400">
                Advanced AI insights from your lead data analysis
              </p>
            </motion.div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {aiAnalytics.metadata.distribution.hot}
                  </span>
                </div>
                <div className="text-white font-semibold">Hot Leads</div>
                <div className="text-gray-400 text-sm">Ready to convert</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">
                    {aiAnalytics.metadata.distribution.warm}
                  </span>
                </div>
                <div className="text-white font-semibold">Warm Leads</div>
                <div className="text-gray-400 text-sm">Need nurturing</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">
                    {aiAnalytics.metadata.averageScore.toFixed(1)}
                  </span>
                </div>
                <div className="text-white font-semibold">Avg Score</div>
                <div className="text-gray-400 text-sm">AI quality rating</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">
                    ${(aiAnalytics.predictions.revenueProjection / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="text-white font-semibold">Revenue Projection</div>
                <div className="text-gray-400 text-sm">Next 30 days</div>
              </motion.div>
            </div>

            {/* Lead Scores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Filter className="w-6 h-6 mr-2 text-purple-400" />
                  Lead Quality Analysis
                </h3>
                
                <div className="space-y-4">
                  {aiAnalytics.leadScores.map((lead: any, index: number) => (
                    <div
                      key={lead.leadId}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center">
                        {lead.priority === 'hot' && <CheckCircle className="w-5 h-5 text-green-400 mr-3" />}
                        {lead.priority === 'warm' && <Clock className="w-5 h-5 text-yellow-400 mr-3" />}
                        {lead.priority === 'cold' && <XCircle className="w-5 h-5 text-gray-400 mr-3" />}
                        <div>
                          <div className="text-white font-medium">Lead #{index + 1}</div>
                          <div className="text-gray-400 text-sm">
                            {(lead.conversionProbability * 100).toFixed(0)}% conversion probability
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          lead.grade === 'A' ? 'text-green-400' : 
                          lead.grade === 'B' ? 'text-blue-400' : 
                          lead.grade === 'C' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {lead.grade}
                        </div>
                        <div className="text-gray-400 text-sm">{lead.overallScore}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
                  Source Performance
                </h3>
                
                <div className="space-y-4">
                  {aiAnalytics.sourceAnalysis.topSources.map((source: any, index: number) => (
                    <div key={source.source} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{source.source}</span>
                        <span className="text-blue-400 font-semibold">
                          {(source.conversionRate * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-sm">Quality Score</span>
                        <span className="text-gray-300">{source.averageScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${source.averageScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Predictions & Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-8"
            >
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-400" />
                AI Predictions & Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {aiAnalytics.predictions.expectedConversions}
                  </div>
                  <div className="text-white font-medium">Expected Conversions</div>
                  <div className="text-gray-400 text-sm">In {aiAnalytics.predictions.timeline}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    ${(aiAnalytics.predictions.revenueProjection / 1000).toFixed(0)}K
                  </div>
                  <div className="text-white font-medium">Revenue Potential</div>
                  <div className="text-gray-400 text-sm">Projected pipeline value</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">87%</div>
                  <div className="text-white font-medium">Success Rate</div>
                  <div className="text-gray-400 text-sm">AI confidence level</div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-blue-400 font-semibold mb-1">AI Recommendation</div>
                    <div className="text-gray-300">
                      Focus on the 2 hot leads first - they have an 85% average conversion probability. 
                      Consider A/B testing different messaging for LinkedIn sources to improve their conversion rate.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400">
              Start free and scale as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="block">
                  <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                  }`}>
                    Get Started
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Generate More Leads?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses who trust our AI to generate qualified leads. 
              Start filling your pipeline with high-converting prospects today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 