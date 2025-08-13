"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Play,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Copy,
  Star,
  Globe,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';

export default function AffiliatePortalDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [demoResults, setDemoResults] = useState<any>(null);
  const [affiliateData, setAffiliateData] = useState({
    name: '',
    email: '',
    website: '',
    commissionRate: 25
  });

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(1);

    // Simulate affiliate creation process
    const steps = [
      { 
        step: 1, 
        title: "Creating affiliate profile...", 
        duration: 1500,
        result: {
          affiliateId: "AFF_" + Math.random().toString(36).substr(2, 8).toUpperCase(),
          status: "active",
          uniqueLink: `https://yoursite.com/?ref=${Math.random().toString(36).substr(2, 6)}`
        }
      },
      { 
        step: 2, 
        title: "Setting up tracking system...", 
        duration: 1200,
        result: {
          trackingPixel: "installed",
          cookieDuration: "30 days",
          conversionTracking: "enabled"
        }
      },
      { 
        step: 3, 
        title: "Generating marketing materials...", 
        duration: 1000,
        result: {
          banners: 12,
          emailTemplates: 8,
          socialAssets: 15,
          landingPages: 3
        }
      },
      { 
        step: 4, 
        title: "Configuring commission structure...", 
        duration: 800,
        result: {
          baseCommission: affiliateData.commissionRate + "%",
          bonusTiers: ["30% at $1K", "35% at $5K", "40% at $10K"],
          payoutSchedule: "Monthly",
          minimumPayout: "$50"
        }
      }
    ];

    for (const stepData of steps) {
      setCurrentStep(stepData.step);
      await new Promise(resolve => setTimeout(resolve, stepData.duration));
    }

    // Generate final results
    const finalResults = {
      affiliate: {
        id: "AFF_" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        name: affiliateData.name || "Demo Affiliate",
        email: affiliateData.email || "demo@example.com",
        website: affiliateData.website || "https://demo-site.com",
        commissionRate: affiliateData.commissionRate,
        uniqueLink: `https://yoursite.com/?ref=${Math.random().toString(36).substr(2, 6)}`,
        status: "Active"
      },
      tracking: {
        clicks: Math.floor(Math.random() * 500) + 100,
        conversions: Math.floor(Math.random() * 50) + 10,
        conversionRate: ((Math.floor(Math.random() * 50) + 10) / (Math.floor(Math.random() * 500) + 100) * 100).toFixed(2),
        revenue: (Math.floor(Math.random() * 5000) + 1000).toFixed(2),
        commission: ((Math.floor(Math.random() * 5000) + 1000) * (affiliateData.commissionRate / 100)).toFixed(2)
      },
      performance: {
        rank: Math.floor(Math.random() * 10) + 1,
        totalAffiliates: Math.floor(Math.random() * 100) + 50,
        monthlyGrowth: (Math.random() * 30 + 10).toFixed(1),
        averageOrderValue: (Math.random() * 100 + 50).toFixed(2)
      }
    };

    setDemoResults(finalResults);
    setIsRunning(false);
  };

  const resetDemo = () => {
    setCurrentStep(1);
    setIsRunning(false);
    setDemoResults(null);
    setAffiliateData({
      name: '',
      email: '',
      website: '',
      commissionRate: 25
    });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const exampleAffiliates = [
    { name: "John's Tech Blog", email: "john@techblog.com", website: "techblog.com", rate: 30 },
    { name: "Marketing Guru", email: "sarah@marketing.co", website: "marketing.co", rate: 25 },
    { name: "Startup Weekly", email: "mike@startup.weekly", website: "startup.weekly", rate: 35 }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/products/affiliate-portal"
                className="flex items-center text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Affiliate Portal™
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/products/affiliate-portal/docs"
                className="flex items-center px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Try Affiliate Portal™
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Live Demo
            </span>
          </h1>
          <p className="text-zinc-400 mb-6">
            Experience the complete affiliate management workflow. Test the system, then upgrade for unlimited access.
          </p>
          
          {/* Example Affiliates */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <span className="text-sm text-zinc-500">Try these examples:</span>
            {exampleAffiliates.map((example, index) => (
              <button
                key={index}
                onClick={() => setAffiliateData(example)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-md transition-colors"
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-500" />
                Affiliate Setup
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Affiliate Name
                  </label>
                  <input
                    type="text"
                    value={affiliateData.name}
                    onChange={(e) => setAffiliateData({...affiliateData, name: e.target.value})}
                    placeholder="Enter affiliate name"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={affiliateData.email}
                    onChange={(e) => setAffiliateData({...affiliateData, email: e.target.value})}
                    placeholder="affiliate@example.com"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={affiliateData.website}
                    onChange={(e) => setAffiliateData({...affiliateData, website: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Commission Rate (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={affiliateData.commissionRate}
                      onChange={(e) => setAffiliateData({...affiliateData, commissionRate: parseInt(e.target.value)})}
                      className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-green-400 font-semibold w-12 text-center">
                      {affiliateData.commissionRate}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={runDemo}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Create Affiliate
                    </>
                  )}
                </button>

                <button
                  onClick={resetDemo}
                  className="w-full flex items-center justify-center px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Demo
                </button>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center text-green-400 text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Demo Features</span>
                </div>
                <ul className="mt-2 text-zinc-300 text-xs space-y-1">
                  <li>• Real-time affiliate creation</li>
                  <li>• Automatic tracking setup</li>
                  <li>• Marketing materials generation</li>
                  <li>• Performance analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                Demo Results
              </h3>

              {isRunning && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white mb-4">
                      {currentStep === 1 && "Creating affiliate profile..."}
                      {currentStep === 2 && "Setting up tracking system..."}
                      {currentStep === 3 && "Generating marketing materials..."}
                      {currentStep === 4 && "Configuring commission structure..."}
                    </div>
                    
                    <div className="flex justify-center space-x-2 mb-6">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            step <= currentStep ? 'bg-green-500' : 'bg-zinc-700'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {!isRunning && !demoResults && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-zinc-400" />
                  </div>
                  <p className="text-zinc-400 text-lg">
                    Fill in the affiliate details and click "Create Affiliate" to see the demo
                  </p>
                </div>
              )}

              {demoResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Affiliate Profile */}
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Affiliate Created Successfully
                      </h4>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-400">Affiliate ID:</span>
                        <div className="text-white font-mono">{demoResults.affiliate.id}</div>
                      </div>
                      <div>
                        <span className="text-zinc-400">Commission Rate:</span>
                        <div className="text-white">{demoResults.affiliate.commissionRate}%</div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-zinc-400">Unique Referral Link:</span>
                        <div className="flex items-center mt-1">
                          <code className="text-green-400 bg-zinc-900 px-2 py-1 rounded text-xs flex-1 mr-2">
                            {demoResults.affiliate.uniqueLink}
                          </code>
                          <button
                            onClick={() => copyLink(demoResults.affiliate.uniqueLink)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-500">{demoResults.tracking.clicks}</div>
                      <div className="text-zinc-400 text-sm">Total Clicks</div>
                    </div>
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-500">{demoResults.tracking.conversions}</div>
                      <div className="text-zinc-400 text-sm">Conversions</div>
                    </div>
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-500">{demoResults.tracking.conversionRate}%</div>
                      <div className="text-zinc-400 text-sm">Conversion Rate</div>
                    </div>
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-500">${demoResults.tracking.commission}</div>
                      <div className="text-zinc-400 text-sm">Commission Earned</div>
                    </div>
                  </div>

                  {/* Performance Insights */}
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                      Performance Insights
                    </h4>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">#{demoResults.performance.rank}</div>
                        <div className="text-zinc-400">Ranking out of {demoResults.performance.totalAffiliates}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">+{demoResults.performance.monthlyGrowth}%</div>
                        <div className="text-zinc-400">Monthly Growth</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">${demoResults.performance.averageOrderValue}</div>
                        <div className="text-zinc-400">Avg Order Value</div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                    <h4 className="text-xl font-semibold text-white mb-2">Ready to scale your affiliate program?</h4>
                    <p className="text-zinc-400 mb-4">
                      Upgrade to Affiliate Portal™ Pro for unlimited affiliates, advanced analytics, and automated payouts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link 
                        href="/products/affiliate-portal"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </Link>
                      <Link 
                        href="/products/affiliate-portal/docs"
                        className="inline-flex items-center px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Documentation
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}