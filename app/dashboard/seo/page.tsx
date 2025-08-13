'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp,
  TrendingDown,
  Target,
  Eye,
  BarChart3,
  Globe,
  Link as LinkIcon,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Brain,
  Plus,
  Download,
  Settings,
  Loader2,
  ExternalLink,
  Copy,
  RefreshCw,
  Star,
  Award,
  Activity,
  MousePointer,
  Users,
  Calendar,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface SEOAnalysis {
  url: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    category: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    howToFix: string;
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    potentialImpact: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  technicalAudit: {
    pageSpeed: number;
    mobileOptimization: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    accessibility: number;
    seo: number;
  };
  contentAnalysis: {
    wordCount: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    headingStructure: Array<{
      level: number;
      text: string;
      issues?: string[];
    }>;
  };
  backlinks: {
    total: number;
    domainAuthority: number;
    newLinks: number;
    lostLinks: number;
    topReferrers: Array<{
      domain: string;
      authority: number;
      links: number;
    }>;
  };
  rankings: Array<{
    keyword: string;
    position: number;
    previousPosition?: number;
    searchVolume: number;
    difficulty: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  createdAt: string;
}

interface KeywordResearch {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: 'low' | 'medium' | 'high';
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  relatedKeywords: string[];
  seasonality?: Array<{
    month: string;
    volume: number;
  }>;
}

interface CompetitorAnalysis {
  competitor: string;
  domain: string;
  domainAuthority: number;
  organicKeywords: number;
  organicTraffic: number;
  commonKeywords: string[];
  keywordGaps: string[];
  contentGaps: Array<{
    topic: string;
    theirRanking: number;
    yourRanking?: number;
    opportunity: string;
  }>;
}

export default function SEOOptimizerDashboard() {
  const [analyses, setAnalyses] = useState<SEOAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SEOAnalysis | null>(null);
  const [keywords, setKeywords] = useState<KeywordResearch[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'keywords' | 'competitors' | 'content'>('analysis');
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [showKeywordResearch, setShowKeywordResearch] = useState(false);

  // New analysis form
  const [newAnalysis, setNewAnalysis] = useState({
    url: '',
    includeKeywords: false,
    includeCompetitors: false,
    includeTechnical: true
  });

  // Keyword research form
  const [keywordSearch, setKeywordSearch] = useState({
    keyword: '',
    location: 'US',
    language: 'en'
  });

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      
      // Mock data since we'd normally fetch from /api/seo/*
      const mockAnalyses: SEOAnalysis[] = [
        {
          url: 'https://omnipreneur.com',
          score: 78,
          grade: 'B',
          issues: [
            {
              type: 'warning',
              category: 'Performance',
              title: 'Image optimization needed',
              description: '15 images are not optimized and are slowing down page load',
              impact: 'medium',
              howToFix: 'Compress and resize images, use WebP format, implement lazy loading'
            },
            {
              type: 'error',
              category: 'Content',
              title: 'Missing meta descriptions',
              description: '8 pages are missing meta descriptions',
              impact: 'high',
              howToFix: 'Write unique, compelling meta descriptions for each page (150-160 characters)'
            },
            {
              type: 'warning',
              category: 'Technical',
              title: 'H1 tag duplication',
              description: 'Multiple H1 tags found on homepage',
              impact: 'medium',
              howToFix: 'Use only one H1 tag per page for better semantic structure'
            },
            {
              type: 'info',
              category: 'Content',
              title: 'Internal linking opportunities',
              description: 'Several pages could benefit from more internal links',
              impact: 'low',
              howToFix: 'Add relevant internal links to improve site architecture and user experience'
            }
          ],
          opportunities: [
            {
              title: 'Featured Snippets Optimization',
              description: 'Target featured snippets for high-volume keywords',
              potentialImpact: '+25% organic traffic',
              difficulty: 'medium'
            },
            {
              title: 'Long-tail Keyword Expansion',
              description: 'Create content for 50+ long-tail keywords with low competition',
              potentialImpact: '+40% qualified leads',
              difficulty: 'easy'
            },
            {
              title: 'Local SEO Enhancement',
              description: 'Optimize for local business searches',
              potentialImpact: '+30% local visibility',
              difficulty: 'medium'
            }
          ],
          technicalAudit: {
            pageSpeed: 85,
            mobileOptimization: 92,
            coreWebVitals: {
              lcp: 2.1,
              fid: 85,
              cls: 0.08
            },
            accessibility: 88,
            seo: 78
          },
          contentAnalysis: {
            wordCount: 1250,
            readabilityScore: 82,
            keywordDensity: {
              'AI tools': 2.4,
              'business automation': 1.8,
              'productivity': 3.1,
              'omnipreneur': 1.2
            },
            headingStructure: [
              { level: 1, text: 'Welcome to Omnipreneur' },
              { level: 2, text: 'AI-Powered Business Tools' },
              { level: 3, text: 'Analytics Dashboard' },
              { level: 3, text: 'Project Management' },
              { level: 2, text: 'Pricing Plans', issues: ['Consider using H3 for subsections'] }
            ]
          },
          backlinks: {
            total: 1247,
            domainAuthority: 45,
            newLinks: 23,
            lostLinks: 8,
            topReferrers: [
              { domain: 'techcrunch.com', authority: 92, links: 3 },
              { domain: 'producthunt.com', authority: 78, links: 12 },
              { domain: 'entrepreneur.com', authority: 85, links: 5 }
            ]
          },
          rankings: [
            { keyword: 'AI business tools', position: 12, previousPosition: 18, searchVolume: 8900, difficulty: 65, trend: 'up' },
            { keyword: 'productivity software', position: 25, previousPosition: 23, searchVolume: 12500, difficulty: 78, trend: 'down' },
            { keyword: 'business automation', position: 8, previousPosition: 8, searchVolume: 5400, difficulty: 52, trend: 'stable' },
            { keyword: 'project management AI', position: 34, previousPosition: 45, searchVolume: 3200, difficulty: 45, trend: 'up' }
          ],
          createdAt: '2024-02-10T14:00:00Z'
        }
      ];

      const mockKeywords: KeywordResearch[] = [
        {
          keyword: 'AI productivity tools',
          searchVolume: 18500,
          difficulty: 72,
          cpc: 4.25,
          competition: 'high',
          intent: 'commercial',
          relatedKeywords: ['AI workflow automation', 'productivity AI software', 'business AI tools'],
          seasonality: [
            { month: 'Jan', volume: 16800 },
            { month: 'Feb', volume: 18200 },
            { month: 'Mar', volume: 19600 }
          ]
        },
        {
          keyword: 'small business automation',
          searchVolume: 9200,
          difficulty: 45,
          cpc: 3.80,
          competition: 'medium',
          intent: 'commercial',
          relatedKeywords: ['SMB automation tools', 'business process automation', 'workflow automation']
        },
        {
          keyword: 'project management software',
          searchVolume: 45600,
          difficulty: 85,
          cpc: 12.50,
          competition: 'high',
          intent: 'commercial',
          relatedKeywords: ['team collaboration tools', 'task management app', 'project tracking']
        }
      ];

      const mockCompetitors: CompetitorAnalysis[] = [
        {
          competitor: 'Monday.com',
          domain: 'monday.com',
          domainAuthority: 78,
          organicKeywords: 125000,
          organicTraffic: 2500000,
          commonKeywords: ['project management', 'team collaboration', 'workflow automation'],
          keywordGaps: ['AI project insights', 'automated reporting', 'smart scheduling'],
          contentGaps: [
            { topic: 'AI in project management', theirRanking: 3, yourRanking: 25, opportunity: 'Create comprehensive AI PM guide' },
            { topic: 'Remote team productivity', theirRanking: 5, opportunity: 'Target remote work keywords' }
          ]
        },
        {
          competitor: 'Asana',
          domain: 'asana.com',
          domainAuthority: 82,
          organicKeywords: 98000,
          organicTraffic: 1800000,
          commonKeywords: ['task management', 'team productivity', 'project tracking'],
          keywordGaps: ['AI task automation', 'smart project templates', 'predictive analytics'],
          contentGaps: [
            { topic: 'Task automation', theirRanking: 2, yourRanking: 15, opportunity: 'Focus on AI-powered automation' }
          ]
        }
      ];

      setAnalyses(mockAnalyses);
      setKeywords(mockKeywords);
      setCompetitors(mockCompetitors);
      if (mockAnalyses.length > 0) {
        setSelectedAnalysis(mockAnalyses[0]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SEO data');
    } finally {
      setLoading(false);
    }
  };

  const runSEOAudit = async () => {
    try {
      if (!newAnalysis.url) {
        setError('URL is required');
        return;
      }

      setActionLoading('audit');

      // In real implementation, would call:
      // const response = await fetch('/api/seo/audit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify({ url: newAnalysis.url })
      // });

      // Mock audit process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Add new analysis to list
      const newAudit: SEOAnalysis = {
        url: newAnalysis.url,
        score: Math.floor(Math.random() * 40) + 60,
        grade: 'B',
        issues: [],
        opportunities: [],
        technicalAudit: {
          pageSpeed: Math.floor(Math.random() * 30) + 70,
          mobileOptimization: Math.floor(Math.random() * 20) + 80,
          coreWebVitals: { lcp: 2.1, fid: 85, cls: 0.08 },
          accessibility: Math.floor(Math.random() * 20) + 80,
          seo: Math.floor(Math.random() * 30) + 70
        },
        contentAnalysis: {
          wordCount: 0,
          readabilityScore: 0,
          keywordDensity: {},
          headingStructure: []
        },
        backlinks: {
          total: 0,
          domainAuthority: 0,
          newLinks: 0,
          lostLinks: 0,
          topReferrers: []
        },
        rankings: [],
        createdAt: new Date().toISOString()
      };

      setAnalyses(prev => [newAudit, ...prev]);
      setSelectedAnalysis(newAudit);
      setNewAnalysis({ url: '', includeKeywords: false, includeCompetitors: false, includeTechnical: true });
      setShowNewAnalysis(false);
      setError(null);
    } catch (err) {
      setError('Failed to run SEO audit');
    } finally {
      setActionLoading(null);
    }
  };

  const researchKeywords = async () => {
    try {
      if (!keywordSearch.keyword) {
        setError('Keyword is required');
        return;
      }

      setActionLoading('keywords');

      // Mock keyword research
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newKeyword: KeywordResearch = {
        keyword: keywordSearch.keyword,
        searchVolume: Math.floor(Math.random() * 50000) + 1000,
        difficulty: Math.floor(Math.random() * 80) + 20,
        cpc: Math.round((Math.random() * 10 + 1) * 100) / 100,
        competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        intent: ['informational', 'commercial', 'transactional'][Math.floor(Math.random() * 3)] as any,
        relatedKeywords: []
      };

      setKeywords(prev => [newKeyword, ...prev]);
      setKeywordSearch({ keyword: '', location: 'US', language: 'en' });
      setShowKeywordResearch(false);
      setError(null);
    } catch (err) {
      setError('Failed to research keywords');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchSEOData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'B': return 'bg-yellow-900/20 text-yellow-400 border-yellow-800';
      case 'C': return 'bg-orange-900/20 text-orange-400 border-orange-800';
      case 'D': return 'bg-red-900/20 text-red-400 border-red-800';
      case 'F': return 'bg-red-900/20 text-red-400 border-red-800';
      default: return 'bg-zinc-900/20 text-zinc-400 border-zinc-800';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default: return <CheckCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-zinc-400" />;
      default: return <Minus className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 80) return 'text-red-400';
    if (difficulty >= 60) return 'text-orange-400';
    if (difficulty >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading SEO data...</p>
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
                <Search className="w-8 h-8 mr-3 text-blue-500" />
                SEO Optimizer
              </h1>
              <p className="text-zinc-400 mt-2">Analyze, optimize, and track your search engine performance</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowKeywordResearch(true)}
                className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center space-x-2"
              >
                <Target className="w-4 h-4" />
                <span>Keyword Research</span>
              </button>
              <button 
                onClick={() => setShowNewAnalysis(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Audit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-zinc-800">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'analysis', label: 'Site Analysis', icon: BarChart3 },
                { id: 'keywords', label: 'Keywords', icon: Target },
                { id: 'competitors', label: 'Competitors', icon: Users },
                { id: 'content', label: 'Content', icon: FileText }
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

        {/* Site Analysis Tab */}
        {activeTab === 'analysis' && selectedAnalysis && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getGradeColor(selectedAnalysis.grade)}`}>
                    {selectedAnalysis.grade}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">SEO Score</h3>
                <p className={`text-3xl font-bold mt-2 ${getScoreColor(selectedAnalysis.score)}`}>
                  {selectedAnalysis.score}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Overall performance</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Page Speed</h3>
                <p className={`text-3xl font-bold mt-2 ${getScoreColor(selectedAnalysis.technicalAudit.pageSpeed)}`}>
                  {selectedAnalysis.technicalAudit.pageSpeed}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Performance score</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-green-400 text-sm">+{selectedAnalysis.backlinks.newLinks}</div>
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Backlinks</h3>
                <p className="text-3xl font-bold text-white mt-2">{selectedAnalysis.backlinks.total}</p>
                <p className="text-sm text-zinc-400 mt-1">DA: {selectedAnalysis.backlinks.domainAuthority}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Keywords Ranking</h3>
                <p className="text-3xl font-bold text-white mt-2">{selectedAnalysis.rankings.length}</p>
                <p className="text-sm text-zinc-400 mt-1">Tracked keywords</p>
              </motion.div>
            </div>

            {/* Technical Audit */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Technical Audit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(selectedAnalysis.technicalAudit.pageSpeed)}`}>
                    {selectedAnalysis.technicalAudit.pageSpeed}
                  </div>
                  <div className="text-sm text-zinc-400">Page Speed</div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedAnalysis.technicalAudit.pageSpeed >= 80 ? 'bg-green-500' :
                        selectedAnalysis.technicalAudit.pageSpeed >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${selectedAnalysis.technicalAudit.pageSpeed}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(selectedAnalysis.technicalAudit.mobileOptimization)}`}>
                    {selectedAnalysis.technicalAudit.mobileOptimization}
                  </div>
                  <div className="text-sm text-zinc-400">Mobile</div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedAnalysis.technicalAudit.mobileOptimization >= 80 ? 'bg-green-500' :
                        selectedAnalysis.technicalAudit.mobileOptimization >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${selectedAnalysis.technicalAudit.mobileOptimization}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(selectedAnalysis.technicalAudit.accessibility)}`}>
                    {selectedAnalysis.technicalAudit.accessibility}
                  </div>
                  <div className="text-sm text-zinc-400">Accessibility</div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedAnalysis.technicalAudit.accessibility >= 80 ? 'bg-green-500' :
                        selectedAnalysis.technicalAudit.accessibility >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${selectedAnalysis.technicalAudit.accessibility}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(selectedAnalysis.technicalAudit.seo)}`}>
                    {selectedAnalysis.technicalAudit.seo}
                  </div>
                  <div className="text-sm text-zinc-400">SEO</div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedAnalysis.technicalAudit.seo >= 80 ? 'bg-green-500' :
                        selectedAnalysis.technicalAudit.seo >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${selectedAnalysis.technicalAudit.seo}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues and Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Issues */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Issues to Fix</h2>
                <div className="space-y-4">
                  {selectedAnalysis.issues.map((issue, index) => (
                    <div key={index} className="border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white">{issue.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              issue.impact === 'high' ? 'bg-red-900/20 text-red-400' :
                              issue.impact === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                              'bg-blue-900/20 text-blue-400'
                            }`}>
                              {issue.impact} impact
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{issue.description}</p>
                          <details className="mt-2">
                            <summary className="text-xs text-blue-400 cursor-pointer">How to fix</summary>
                            <p className="text-xs text-zinc-500 mt-1">{issue.howToFix}</p>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Growth Opportunities</h2>
                <div className="space-y-4">
                  {selectedAnalysis.opportunities.map((opportunity, index) => (
                    <div key={index} className="border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{opportunity.title}</h3>
                          <p className="text-sm text-zinc-400 mt-1">{opportunity.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className="text-green-400">{opportunity.potentialImpact}</span>
                            <span className={`px-2 py-1 rounded ${
                              opportunity.difficulty === 'easy' ? 'bg-green-900/20 text-green-400' :
                              opportunity.difficulty === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                              'bg-red-900/20 text-red-400'
                            }`}>
                              {opportunity.difficulty}
                            </span>
                          </div>
                        </div>
                        <button className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">
                          Implement
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keyword Rankings */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Keyword Rankings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-300">Keyword</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-300">Position</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-300">Change</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-300">Volume</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-300">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAnalysis.rankings.map((ranking, index) => (
                      <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">{ranking.keyword}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-white font-medium">#{ranking.position}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(ranking.trend)}
                            {ranking.previousPosition && (
                              <span className={`text-sm ${
                                ranking.position < ranking.previousPosition ? 'text-green-400' :
                                ranking.position > ranking.previousPosition ? 'text-red-400' :
                                'text-zinc-400'
                              }`}>
                                {ranking.position < ranking.previousPosition 
                                  ? `+${ranking.previousPosition - ranking.position}`
                                  : ranking.position > ranking.previousPosition
                                  ? `-${ranking.position - ranking.previousPosition}`
                                  : '0'
                                }
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-zinc-300">{ranking.searchVolume.toLocaleString()}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`font-medium ${getDifficultyColor(ranking.difficulty)}`}>
                            {ranking.difficulty}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Keyword Research</h2>
              <button 
                onClick={() => setShowKeywordResearch(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Research Keywords</span>
              </button>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">Keyword</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">Volume</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">Difficulty</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">CPC</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">Competition</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">Intent</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword, index) => (
                      <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-4 px-6">
                          <div className="font-medium text-white">{keyword.keyword}</div>
                          {keyword.relatedKeywords.length > 0 && (
                            <div className="text-xs text-zinc-500 mt-1">
                              +{keyword.relatedKeywords.length} related
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white">{keyword.searchVolume.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                            {keyword.difficulty}%
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white">${keyword.cpc}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            keyword.competition === 'low' ? 'bg-green-900/20 text-green-400' :
                            keyword.competition === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                            'bg-red-900/20 text-red-400'
                          }`}>
                            {keyword.competition}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            keyword.intent === 'commercial' || keyword.intent === 'transactional' 
                              ? 'bg-green-900/20 text-green-400' 
                              : 'bg-blue-900/20 text-blue-400'
                          }`}>
                            {keyword.intent}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-400 hover:text-blue-300" title="Track keyword">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-green-400 hover:text-green-300" title="Create content">
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white">Competitor Analysis</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {competitors.map((competitor, index) => (
                <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{competitor.competitor}</h3>
                      <div className="text-sm text-zinc-400">{competitor.domain}</div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{competitor.domainAuthority}</div>
                      <div className="text-sm text-zinc-400">Domain Authority</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{competitor.organicKeywords.toLocaleString()}</div>
                      <div className="text-sm text-zinc-400">Keywords</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Keyword Gaps</h4>
                      <div className="flex flex-wrap gap-2">
                        {competitor.keywordGaps.slice(0, 3).map((gap, gapIndex) => (
                          <span key={gapIndex} className="px-2 py-1 bg-yellow-900/20 text-yellow-400 text-xs rounded">
                            {gap}
                          </span>
                        ))}
                        {competitor.keywordGaps.length > 3 && (
                          <span className="text-xs text-zinc-500">+{competitor.keywordGaps.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-white mb-2">Content Opportunities</h4>
                      <div className="space-y-2">
                        {competitor.contentGaps.slice(0, 2).map((gap, gapIndex) => (
                          <div key={gapIndex} className="text-sm">
                            <div className="text-white">{gap.topic}</div>
                            <div className="text-zinc-400 text-xs">
                              Their rank: #{gap.theirRanking} 
                              {gap.yourRanking && ` | Your rank: #${gap.yourRanking}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && selectedAnalysis && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white">Content Analysis</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content Metrics */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Content Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Word Count</span>
                    <span className="text-white font-medium">{selectedAnalysis.contentAnalysis.wordCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Readability Score</span>
                    <span className={`font-medium ${getScoreColor(selectedAnalysis.contentAnalysis.readabilityScore)}`}>
                      {selectedAnalysis.contentAnalysis.readabilityScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Heading Structure</span>
                    <span className="text-white font-medium">{selectedAnalysis.contentAnalysis.headingStructure.length} headings</span>
                  </div>
                </div>
              </div>

              {/* Keyword Density */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Keyword Density</h3>
                <div className="space-y-3">
                  {Object.entries(selectedAnalysis.contentAnalysis.keywordDensity).map(([keyword, density]) => (
                    <div key={keyword} className="flex items-center justify-between">
                      <span className="text-zinc-300">{keyword}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          density > 3 ? 'text-red-400' : 
                          density > 1.5 ? 'text-green-400' : 
                          'text-yellow-400'
                        }`}>
                          {density}%
                        </span>
                        <div className="w-16 bg-zinc-800 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              density > 3 ? 'bg-red-500' : 
                              density > 1.5 ? 'bg-green-500' : 
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(density * 20, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Heading Structure */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Heading Structure</h3>
              <div className="space-y-3">
                {selectedAnalysis.contentAnalysis.headingStructure.map((heading, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      heading.level === 1 ? 'bg-blue-900/20 text-blue-400' :
                      heading.level === 2 ? 'bg-green-900/20 text-green-400' :
                      heading.level === 3 ? 'bg-yellow-900/20 text-yellow-400' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      H{heading.level}
                    </span>
                    <span className="text-white flex-1">{heading.text}</span>
                    {heading.issues && heading.issues.length > 0 && (
                      <span className="text-xs text-orange-400">
                        {heading.issues.length} issue{heading.issues.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* New Analysis Modal */}
        {showNewAnalysis && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">New SEO Audit</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">URL to Audit *</label>
                  <input
                    type="url"
                    value={newAnalysis.url}
                    onChange={(e) => setNewAnalysis({ ...newAnalysis, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeTechnical"
                      checked={newAnalysis.includeTechnical}
                      onChange={(e) => setNewAnalysis({ ...newAnalysis, includeTechnical: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="includeTechnical" className="text-sm text-zinc-300">
                      Include technical audit
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeKeywords"
                      checked={newAnalysis.includeKeywords}
                      onChange={(e) => setNewAnalysis({ ...newAnalysis, includeKeywords: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="includeKeywords" className="text-sm text-zinc-300">
                      Include keyword analysis
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeCompetitors"
                      checked={newAnalysis.includeCompetitors}
                      onChange={(e) => setNewAnalysis({ ...newAnalysis, includeCompetitors: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="includeCompetitors" className="text-sm text-zinc-300">
                      Include competitor analysis
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewAnalysis(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={runSEOAudit}
                    disabled={actionLoading === 'audit'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {actionLoading === 'audit' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>Run Audit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keyword Research Modal */}
        {showKeywordResearch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">Keyword Research</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Keyword *</label>
                  <input
                    type="text"
                    value={keywordSearch.keyword}
                    onChange={(e) => setKeywordSearch({ ...keywordSearch, keyword: e.target.value })}
                    placeholder="Enter keyword or phrase"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
                    <select
                      value={keywordSearch.location}
                      onChange={(e) => setKeywordSearch({ ...keywordSearch, location: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Language</label>
                    <select
                      value={keywordSearch.language}
                      onChange={(e) => setKeywordSearch({ ...keywordSearch, language: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowKeywordResearch(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={researchKeywords}
                    disabled={actionLoading === 'keywords'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {actionLoading === 'keywords' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                    <span>Research</span>
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