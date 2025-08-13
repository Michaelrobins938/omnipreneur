'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Eye, 
  CheckCircle,
  Copy,
  Download,
  RefreshCw,
  Lightbulb,
  Target,
  Brain,
  Zap,
  BookOpen,
  MessageSquare,
  Award,
  ArrowRight
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

interface RewriteAnalysis {
  originalStats: {
    wordCount: number;
    sentenceCount: number;
    readabilityScore: number;
    toneAnalysis: string;
    keyPhrases: string[];
  };
  rewrittenStats: {
    wordCount: number;
    sentenceCount: number;
    readabilityScore: number;
    toneAnalysis: string;
    keyPhrases: string[];
  };
  improvements: {
    clarity: number;
    engagement: number;
    conciseness: number;
    tone: number;
    overall: number;
  };
}

interface Alternative {
  version: string;
  focus: string;
  content: string;
  score: number;
}

interface AutoRewriteResultsProps {
  original: string;
  rewrittenContent: string;
  changes: string[];
  analysis: RewriteAnalysis;
  alternatives: Alternative[];
  suggestions: string[];
  onExport?: () => void;
  onRewrite?: (text: string) => void;
}

export default function AutoRewriteResults({
  original,
  rewrittenContent,
  changes,
  analysis,
  alternatives,
  suggestions,
  onExport,
  onRewrite
}: AutoRewriteResultsProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>('main');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-900/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-orange-400 bg-orange-900/20';
  };

  const getImprovement = (original: number, improved: number) => {
    const diff = improved - original;
    if (Math.abs(diff) < 1) return { text: 'No change', color: 'text-zinc-400' };
    if (diff > 0) return { text: `+${diff.toFixed(1)}`, color: 'text-green-400' };
    return { text: diff.toFixed(1), color: 'text-red-400' };
  };

  const exportResults = () => {
    const exportData = {
      original,
      rewritten: rewrittenContent,
      changes,
      analysis,
      alternatives,
      suggestions,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rewrite-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Improvement Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Overall</p>
              <p className="text-xl font-bold text-white">{analysis.improvements.overall}%</p>
              <Badge className={getScoreColor(analysis.improvements.overall)} size="sm">
                {analysis.improvements.overall >= 80 ? 'Excellent' : analysis.improvements.overall >= 60 ? 'Good' : 'Fair'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Eye className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Clarity</p>
              <p className="text-xl font-bold text-white">{analysis.improvements.clarity}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Engagement</p>
              <p className="text-xl font-bold text-white">{analysis.improvements.engagement}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Zap className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Conciseness</p>
              <p className="text-xl font-bold text-white">{analysis.improvements.conciseness}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <MessageSquare className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Tone</p>
              <p className="text-xl font-bold text-white">{analysis.improvements.tone}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Comparison */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparison">Before/After</TabsTrigger>
          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Content Comparison</h3>
            <div className="flex space-x-2">
              <Button onClick={exportResults} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              {onRewrite && (
                <Button onClick={() => onRewrite(rewrittenContent)} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Use as Input
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Original */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-red-400 flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Original Text</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(original, 'original')}
                  >
                    {copiedText === 'original' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-white leading-relaxed">{original}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-400">Words: <span className="text-white">{analysis.originalStats.wordCount}</span></p>
                    <p className="text-zinc-400">Sentences: <span className="text-white">{analysis.originalStats.sentenceCount}</span></p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Readability: <span className="text-white">{analysis.originalStats.readabilityScore}%</span></p>
                    <p className="text-zinc-400">Tone: <span className="text-white capitalize">{analysis.originalStats.toneAnalysis}</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewritten */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-green-400 flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Enhanced Text</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(rewrittenContent, 'rewritten')}
                  >
                    {copiedText === 'rewritten' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-white leading-relaxed">{rewrittenContent}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-400">
                      Words: <span className="text-white">{analysis.rewrittenStats.wordCount}</span>
                      <span className={`ml-2 ${getImprovement(analysis.originalStats.wordCount, analysis.rewrittenStats.wordCount).color}`}>
                        ({getImprovement(analysis.originalStats.wordCount, analysis.rewrittenStats.wordCount).text})
                      </span>
                    </p>
                    <p className="text-zinc-400">
                      Sentences: <span className="text-white">{analysis.rewrittenStats.sentenceCount}</span>
                      <span className={`ml-2 ${getImprovement(analysis.originalStats.sentenceCount, analysis.rewrittenStats.sentenceCount).color}`}>
                        ({getImprovement(analysis.originalStats.sentenceCount, analysis.rewrittenStats.sentenceCount).text})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400">
                      Readability: <span className="text-white">{analysis.rewrittenStats.readabilityScore}%</span>
                      <span className={`ml-2 ${getImprovement(analysis.originalStats.readabilityScore, analysis.rewrittenStats.readabilityScore).color}`}>
                        ({getImprovement(analysis.originalStats.readabilityScore, analysis.rewrittenStats.readabilityScore).text})
                      </span>
                    </p>
                    <p className="text-zinc-400">Tone: <span className="text-white capitalize">{analysis.rewrittenStats.toneAnalysis}</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Changes Made */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span>Changes Made</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {changes.map((change, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-zinc-200">{change}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alternatives" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-purple-400" />
                <span>Alternative Versions</span>
              </CardTitle>
              <CardDescription>
                Different approaches to enhance your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alternatives.map((alt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-medium text-white">{alt.version}</CardTitle>
                          <CardDescription className="text-xs text-zinc-400">{alt.focus}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getScoreColor(alt.score)}>
                            Score: {alt.score}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(alt.content, `alt-${index}`)}
                          >
                            {copiedText === `alt-${index}` ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white text-sm leading-relaxed">{alt.content}</p>
                      {onRewrite && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => onRewrite(alt.content)}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Use This Version
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                <span>Detailed Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Phrases Comparison */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Original Key Phrases</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.originalStats.keyPhrases.map((phrase, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {phrase}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-3">Enhanced Key Phrases</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.rewrittenStats.keyPhrases.map((phrase, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {phrase}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Improvement Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Improvement Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(analysis.improvements).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-300 capitalize">{key}</span>
                        <span className="text-sm text-white font-medium">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
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
                Actionable recommendations to further improve your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
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