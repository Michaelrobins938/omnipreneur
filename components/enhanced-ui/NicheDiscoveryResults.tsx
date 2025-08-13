'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Target, 
  DollarSign,
  Users,
  BarChart3,
  Copy,
  Download,
  RefreshCw,
  Lightbulb,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Clock,
  AlertTriangle,
  Globe,
  Zap,
  Crown,
  Hash,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NicheIdea {
  keyword: string;
  demandScore: number;
  competitionScore: number;
  opportunityScore: number;
  searchVolume: number;
  difficulty: number;
  trends: {
    growth: 'rising' | 'stable' | 'declining';
    seasonality: string;
    forecast: number;
  };
  monetization: {
    avgPrice: number;
    revenueScore: number;
    conversionRate: number;
  };
}

interface MarketAnalysis {
  totalMarketSize: number;
  competitorCount: number;
  marketSaturation: 'low' | 'medium' | 'high';
  topCompetitors: Array<{
    name: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  priceAnalysis: {
    averagePrice: number;
    priceRange: { min: number; max: number };
    pricingStrategy: string;
  };
  customerSegments: Array<{
    segment: string;
    size: number;
    characteristics: string[];
    painPoints: string[];
  }>;
}

interface NicheDiscoveryResultsProps {
  niches: NicheIdea[];
  methodology: string;
  marketAnalysis: MarketAnalysis;
  recommendations: Array<{
    type: 'product' | 'pricing' | 'marketing' | 'positioning';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: number;
  }>;
  keywordSuggestions: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    relevance: number;
  }>;
  competitorGaps: Array<{
    gap: string;
    opportunity: string;
    difficulty: number;
  }>;
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  onExport?: () => void;
  onAnalyzeKeyword?: (keyword: string) => void;
}

export default function NicheDiscoveryResults({
  niches,
  methodology,
  marketAnalysis,
  recommendations,
  keywordSuggestions,
  competitorGaps,
  actionPlan,
  onExport,
  onAnalyzeKeyword
}: NicheDiscoveryResultsProps) {
  const [selectedNiche, setSelectedNiche] = useState(0);
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

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'text-green-400 bg-green-900/20';
    if (difficulty <= 60) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-red-400 bg-red-900/20';
  };

  const getGrowthIcon = (growth: string) => {
    switch (growth) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSaturationColor = (saturation: string) => {
    switch (saturation) {
      case 'low': return 'text-green-400 bg-green-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'high': return 'text-red-400 bg-red-900/20';
      default: return 'text-zinc-400 bg-zinc-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-zinc-400 bg-zinc-900/20';
    }
  };

  const exportResults = () => {
    const exportData = {
      niches,
      methodology,
      marketAnalysis,
      recommendations,
      keywordSuggestions,
      competitorGaps,
      actionPlan,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `niche-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const primaryNiche = niches[selectedNiche] || niches[0];

  return (
    <div className="space-y-6">
      {/* Niche Overview */}
      {primaryNiche && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{primaryNiche.keyword}</h2>
                <div className="flex items-center space-x-2">
                  {getGrowthIcon(primaryNiche.trends.growth)}
                  <Badge className={getScoreColor(primaryNiche.opportunityScore)}>
                    Opportunity Score: {primaryNiche.opportunityScore}%
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Search Volume</p>
                <p className="text-2xl font-bold text-white">{primaryNiche.searchVolume.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-zinc-400">Demand</p>
                <p className="text-xl font-bold text-green-400">{primaryNiche.demandScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-zinc-400">Competition</p>
                <p className="text-xl font-bold text-orange-400">{primaryNiche.competitionScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-zinc-400">Avg Price</p>
                <p className="text-xl font-bold text-blue-400">${primaryNiche.monetization.avgPrice}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-zinc-400">Conversion</p>
                <p className="text-xl font-bold text-purple-400">{primaryNiche.monetization.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-zinc-400">Market Size</p>
                <p className="text-xl font-bold text-white">${marketAnalysis.totalMarketSize}M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm text-zinc-400">Competitors</p>
                <p className="text-xl font-bold text-white">{marketAnalysis.competitorCount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-zinc-400">Saturation</p>
                <Badge className={getSaturationColor(marketAnalysis.marketSaturation)} size="sm">
                  {marketAnalysis.marketSaturation}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-zinc-400">Avg Price</p>
                <p className="text-xl font-bold text-white">${marketAnalysis.priceAnalysis.averagePrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="niches" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="niches">Niches</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="actionplan">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="niches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Niche Opportunities</h3>
            <Button onClick={exportResults} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
          </div>

          <div className="grid gap-4">
            {niches.map((niche, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors ${
                  selectedNiche === index ? 'ring-2 ring-purple-500/50' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-white">{niche.keyword}</h4>
                        <div className="flex items-center space-x-1">
                          {getGrowthIcon(niche.trends.growth)}
                          <span className="text-xs text-zinc-400 capitalize">{niche.trends.growth}</span>
                        </div>
                      </div>
                      <Badge className={getScoreColor(niche.opportunityScore)}>
                        {niche.opportunityScore}% Opportunity
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-zinc-400">Search Volume</p>
                        <p className="text-lg font-bold text-white">{niche.searchVolume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Difficulty</p>
                        <Badge className={getDifficultyColor(niche.difficulty)} size="sm">
                          {niche.difficulty}%
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Revenue Score</p>
                        <p className="text-lg font-bold text-green-400">{niche.monetization.revenueScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Seasonality</p>
                        <p className="text-xs text-zinc-300">{niche.trends.seasonality}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNiche(index)}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                      {onAnalyzeKeyword && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAnalyzeKeyword(niche.keyword)}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Deep Dive
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Competitors */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span>Top Competitors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketAnalysis.topCompetitors.map((competitor, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{competitor.name}</h4>
                        <Badge variant="secondary">{competitor.marketShare}% share</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-green-400 font-medium mb-1">Strengths:</p>
                          <ul className="text-zinc-300 space-y-1">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i} className="text-xs">• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-red-400 font-medium mb-1">Weaknesses:</p>
                          <ul className="text-zinc-300 space-y-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-xs">• {weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Customer Segments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketAnalysis.customerSegments.map((segment, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{segment.segment}</h4>
                        <Badge variant="outline">{segment.size}%</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-blue-400 font-medium">Characteristics:</p>
                          <p className="text-zinc-300 text-xs">{segment.characteristics.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-orange-400 font-medium">Pain Points:</p>
                          <p className="text-zinc-300 text-xs">{segment.painPoints.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Analysis */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span>Pricing Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm text-zinc-400">Average Price</p>
                  <p className="text-2xl font-bold text-white">${marketAnalysis.priceAnalysis.averagePrice}</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-zinc-400">Price Range</p>
                  <p className="text-lg font-bold text-white">
                    ${marketAnalysis.priceAnalysis.priceRange.min} - ${marketAnalysis.priceAnalysis.priceRange.max}
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-zinc-400">Strategy</p>
                  <p className="text-sm text-white">{marketAnalysis.priceAnalysis.pricingStrategy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-green-400" />
                <span>Keyword Suggestions</span>
              </CardTitle>
              <CardDescription>
                Related keywords with optimization potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {keywordSuggestions.map((keyword, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex-1">
                      <p className="font-medium text-white">{keyword.keyword}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-zinc-400">
                          Volume: <span className="text-white">{keyword.searchVolume.toLocaleString()}</span>
                        </span>
                        <Badge className={getDifficultyColor(keyword.difficulty)} size="sm">
                          Difficulty: {keyword.difficulty}%
                        </Badge>
                        <Badge className={getScoreColor(keyword.relevance)} size="sm">
                          Relevance: {keyword.relevance}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(keyword.keyword, `keyword-${index}`)}
                      >
                        {copiedItem === `keyword-${index}` ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      {onAnalyzeKeyword && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAnalyzeKeyword(keyword.keyword)}
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recommendations */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span>Strategic Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">{rec.title}</h4>
                          <Badge className={getPriorityColor(rec.priority)} size="sm">
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <Badge variant="outline">Impact: {rec.impact}%</Badge>
                      </div>
                      <p className="text-sm text-zinc-300">{rec.description}</p>
                      <Badge variant="secondary" size="sm" className="mt-2 capitalize">
                        {rec.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitor Gaps */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-red-400" />
                  <span>Competitor Gaps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competitorGaps.map((gap, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{gap.gap}</h4>
                        <Badge className={getDifficultyColor(gap.difficulty)} size="sm">
                          {gap.difficulty}% effort
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-300">{gap.opportunity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actionplan" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Strategic Action Plan</span>
              </CardTitle>
              <CardDescription>
                Step-by-step roadmap to capitalize on this niche opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Immediate Actions */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-red-400" />
                  <span>Immediate Actions (Days 1-7)</span>
                </h4>
                <div className="space-y-2">
                  {actionPlan.immediate.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-red-400 font-medium text-xs">{index + 1}</span>
                      </div>
                      <p className="text-sm text-zinc-200">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short Term Actions */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span>Short Term Actions (Weeks 2-8)</span>
                </h4>
                <div className="space-y-2">
                  {actionPlan.shortTerm.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-yellow-400 font-medium text-xs">{index + 1}</span>
                      </div>
                      <p className="text-sm text-zinc-200">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Term Actions */}
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-green-400" />
                  <span>Long Term Actions (Months 3-12)</span>
                </h4>
                <div className="space-y-2">
                  {actionPlan.longTerm.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-green-400 font-medium text-xs">{index + 1}</span>
                      </div>
                      <p className="text-sm text-zinc-200">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}