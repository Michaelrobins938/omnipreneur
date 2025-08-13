'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Star,
  Copy,
  Download,
  RefreshCw,
  Lightbulb,
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Award,
  CheckCircle,
  ArrowRight,
  Globe,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
const Progress = (props: { value: number; className?: string }) => (
  <div className={props.className}>
    <div className="w-full bg-zinc-800 rounded h-2">
      <div className="bg-blue-500 h-2 rounded" style={{ width: `${props.value}%` }} />
    </div>
  </div>
);
const Tabs = ({ children, className }: { children: React.ReactNode; defaultValue?: string; className?: string }) => <div className={className}>{children}</div> as any;
const TabsContent = ({ children, className }: { children: React.ReactNode; value?: string; className?: string }) => <div className={className}>{children}</div> as any;
const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className || 'flex space-x-2'}>{children}</div> as any;
const TabsTrigger = ({ children }: { children: React.ReactNode; value?: string }) => <button className="px-2 py-1 bg-zinc-800 rounded">{children}</button> as any;

interface BundleAnalysis {
  complementarity: number;
  priceSpread: number;
  targetAlignmentScore: number;
  competitiveAdvantage: number;
  synergyScore: number;
}

interface PricingStrategy {
  individualTotal: number;
  recommendedPrice: number;
  discountPercentage: number;
  priceAnchoring: {
    highValue: number;
    perceivedSavings: number;
  };
  tieringOptions: Array<{
    tier: string;
    products: string[];
    price: number;
    positioning: string;
  }>;
}

interface MarketingMaterials {
  bundleDescription: string;
  valueProposition: string;
  headlines: string[];
  bulletPoints: string[];
  socialProof: string[];
  guarantees: string[];
  urgencyTriggers: string[];
  ctaButtons: string[];
}

interface BundleBuilderResultsProps {
  bundleName: string;
  analysis: BundleAnalysis;
  pricing: PricingStrategy;
  positioning: string;
  marketing: MarketingMaterials;
  launchStrategy: {
    timeline: string[];
    channels: string[];
    messaging: Record<string, string>;
    kpis: string[];
  };
  recommendations: string[];
  onExport?: () => void;
  onRegenerate?: () => void;
}

export default function BundleBuilderResults({
  bundleName,
  analysis,
  pricing,
  positioning,
  marketing,
  launchStrategy,
  recommendations,
  onExport,
  onRegenerate
}: BundleBuilderResultsProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-900/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-orange-400 bg-orange-900/20';
  };

  const exportResults = () => {
    const exportData = {
      bundleName,
      analysis,
      pricing,
      positioning,
      marketing,
      launchStrategy,
      recommendations,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bundle-strategy-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{bundleName}</h2>
        <p className="text-zinc-400">{positioning}</p>
      </div>

      {/* Analysis Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Synergy Score</p>
              <p className="text-xl font-bold text-white">{analysis.synergyScore}%</p>
              <Badge className={getScoreColor(analysis.synergyScore)} size="sm">
                {analysis.synergyScore >= 80 ? 'Excellent' : analysis.synergyScore >= 60 ? 'Good' : 'Fair'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Target className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Complementarity</p>
              <p className="text-xl font-bold text-white">{analysis.complementarity}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Price Spread</p>
              <p className="text-xl font-bold text-white">{analysis.priceSpread}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Target Alignment</p>
              <p className="text-xl font-bold text-white">{analysis.targetAlignmentScore}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Competitive Edge</p>
              <p className="text-xl font-bold text-white">{analysis.competitiveAdvantage}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing">Pricing Strategy</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Materials</TabsTrigger>
          <TabsTrigger value="launch">Launch Strategy</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Pricing Strategy</h3>
            <Button onClick={exportResults} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Strategy
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pricing Overview */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span>Pricing Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-sm text-zinc-400">Individual Total</p>
                    <p className="text-2xl font-bold text-white">${pricing.individualTotal}</p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm text-zinc-400">Bundle Price</p>
                    <p className="text-2xl font-bold text-white">${pricing.recommendedPrice}</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-zinc-400">Discount</span>
                    <span className="text-lg font-bold text-purple-400">{pricing.discountPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Customer Saves</span>
                    <span className="text-lg font-bold text-green-400">${pricing.individualTotal - pricing.recommendedPrice}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-medium text-white mb-2">Price Anchoring</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-400">High Anchor</span>
                      <span className="text-white">${pricing.priceAnchoring.highValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-400">Perceived Savings</span>
                      <span className="text-green-400">${pricing.priceAnchoring.perceivedSavings}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tiered Options */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  <span>Tiered Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricing.tieringOptions.map((tier, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">{tier.tier}</h4>
                          <p className="text-sm text-zinc-400">{tier.positioning}</p>
                        </div>
                        <Badge variant="secondary">${tier.price}</Badge>
                      </div>
                      <div className="text-xs text-zinc-500">
                        Includes: {tier.products.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span>Marketing Materials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Value Proposition */}
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">Value Proposition</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(marketing.valueProposition, 'valueProposition')}
                  >
                    {copiedItem === 'valueProposition' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-zinc-200">{marketing.valueProposition}</p>
              </div>

              {/* Headlines */}
              <div>
                <h4 className="font-medium text-white mb-3">Headlines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {marketing.headlines.map((headline, index) => (
                    <div key={index} className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 flex justify-between items-center">
                      <p className="text-sm text-zinc-200">{headline}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(headline, `headline-${index}`)}
                      >
                        {copiedItem === `headline-${index}` ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet Points */}
              <div>
                <h4 className="font-medium text-white mb-3">Key Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {marketing.bulletPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-zinc-200">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div>
                <h4 className="font-medium text-white mb-3">Call-to-Action Buttons</h4>
                <div className="flex flex-wrap gap-3">
                  {marketing.ctaButtons.map((cta, index) => (
                    <Button key={index} variant="outline" size="sm" className="cursor-default">
                      {cta}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Social Proof & Guarantees */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Social Proof</h4>
                  <div className="space-y-2">
                    {marketing.socialProof.map((proof, index) => (
                      <div key={index} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <p className="text-sm text-zinc-200 italic">"{proof}"</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3">Guarantees</h4>
                  <div className="space-y-2">
                    {marketing.guarantees.map((guarantee, index) => (
                      <div key={index} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-sm text-zinc-200">{guarantee}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="launch" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                <span>Launch Strategy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeline */}
              <div>
                <h4 className="font-medium text-white mb-3">Launch Timeline</h4>
                <div className="space-y-3">
                  {launchStrategy.timeline.map((phase, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <span className="text-orange-400 font-medium text-sm">{index + 1}</span>
                      </div>
                      <p className="text-zinc-200">{phase}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channels & Messaging */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Marketing Channels</h4>
                  <div className="space-y-2">
                    {launchStrategy.channels.map((channel, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <p className="text-sm text-zinc-200">{channel}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3">Channel Messaging</h4>
                  <div className="space-y-2">
                    {Object.entries(launchStrategy.messaging).map(([channel, message], index) => (
                      <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-xs text-purple-400 font-medium uppercase mb-1">{channel}</p>
                        <p className="text-sm text-zinc-200">{message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div>
                <h4 className="font-medium text-white mb-3">Key Performance Indicators</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {launchStrategy.kpis.map((kpi, index) => (
                    <div key={index} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-center">
                      <BarChart3 className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <p className="text-xs text-zinc-200">{kpi}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span>AI Recommendations</span>
              </CardTitle>
              <CardDescription>
                Strategic suggestions to optimize your bundle performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                  >
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-200">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}