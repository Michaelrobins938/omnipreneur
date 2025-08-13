'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  Hash, 
  Copy, 
  Download, 
  Star,
  BarChart3,
  Clock,
  Target,
  Lightbulb,
  Zap,
  CheckCircle,
  Globe,
  MessageSquare,
  Calendar
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

interface ContentPiece {
  text: string;
  hashtags: string[];
  engagementScore: number;
  viralScore: number;
  hook?: string;
  callToAction?: string;
  seoKeywords?: string[];
  platformOptimizations?: {
    characterCount: string;
    bestTimeToPost: string;
    algorithmTips: string;
  };
}

interface ContentResults {
  content: ContentPiece[];
  metrics: {
    totalGenerated: number;
    avgViralScore: number;
    avgEngagementScore: number;
    platformOptimization: number;
  };
  suggestions: string[];
  hashtags: string[];
}

interface ContentGenerationResultsProps {
  results: ContentResults;
  platform: string;
  contentType: string;
  onExport?: () => void;
  onRegenerate?: () => void;
}

export default function ContentGenerationResults({ 
  results, 
  platform, 
  contentType, 
  onExport, 
  onRegenerate 
}: ContentGenerationResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState(0);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400 bg-green-900/20';
    if (score >= 0.6) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-orange-400 bg-orange-900/20';
  };

  const exportContent = () => {
    const exportData = {
      platform,
      contentType,
      generatedAt: new Date().toISOString(),
      content: results.content,
      metrics: results.metrics,
      suggestions: results.suggestions
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${platform}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-zinc-400">Avg Viral Score</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(results.metrics.avgViralScore * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-zinc-400">Engagement Score</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(results.metrics.avgEngagementScore * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-zinc-400">Platform Optimized</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(results.metrics.platformOptimization * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm text-zinc-400">Total Generated</p>
                <p className="text-2xl font-bold text-white">
                  {results.metrics.totalGenerated}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Results */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Generated Content</TabsTrigger>
          <TabsTrigger value="optimization">Platform Optimization</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Generated Content Pieces</h3>
            <div className="flex space-x-2">
              <Button onClick={exportContent} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              {onRegenerate && (
                <Button onClick={onRegenerate} variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            {results.content.map((piece, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-2">
                        <Badge className={getScoreColor(piece.viralScore)}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Viral: {Math.round(piece.viralScore * 100)}%
                        </Badge>
                        <Badge className={getScoreColor(piece.engagementScore)}>
                          <Heart className="w-3 h-3 mr-1" />
                          Engagement: {Math.round(piece.engagementScore * 100)}%
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(piece.text, index)}
                        className="h-8"
                      >
                        {copiedIndex === index ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Hook */}
                    {piece.hook && (
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-400">Hook</span>
                        </div>
                        <p className="text-white text-sm">{piece.hook}</p>
                      </div>
                    )}

                    {/* Main Content */}
                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-white leading-relaxed">{piece.text}</p>
                    </div>

                    {/* Call to Action */}
                    {piece.callToAction && (
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">Call to Action</span>
                        </div>
                        <p className="text-white text-sm">{piece.callToAction}</p>
                      </div>
                    )}

                    {/* Hashtags */}
                    {piece.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <Hash className="w-4 h-4 text-zinc-400 mt-1" />
                        {piece.hashtags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* SEO Keywords */}
                    {piece.seoKeywords && piece.seoKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <Globe className="w-4 h-4 text-zinc-400 mt-1" />
                        <span className="text-xs text-zinc-400 mr-2">SEO:</span>
                        {piece.seoKeywords.map((keyword, kwIndex) => (
                          <Badge key={kwIndex} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span>Platform Optimization for {platform}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.content[0]?.platformOptimizations && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-white">Character Count</span>
                      </div>
                      <p className="text-sm text-zinc-300">
                        {results.content[0].platformOptimizations.characterCount}
                      </p>
                    </div>

                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="font-medium text-white">Best Time</span>
                      </div>
                      <p className="text-sm text-zinc-300">
                        {results.content[0].platformOptimizations.bestTimeToPost}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-white">Algorithm Tips</span>
                      </div>
                      <p className="text-sm text-zinc-300">
                        {results.content[0].platformOptimizations.algorithmTips}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span>AI Optimization Suggestions</span>
              </CardTitle>
              <CardDescription>
                Recommendations to improve your content performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-200">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}