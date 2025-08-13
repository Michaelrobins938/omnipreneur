'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import { 
  Brain, 
  Package, 
  Zap, 
  Sparkles,
  FileText,
  Target,
  Palette,
  Receipt,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Play,
  Download,
  Copy,
  RefreshCw,
  Settings,
  CheckCircle,
  Loader2,
  Wand2,
  Lightbulb,
  TrendingUp,
  Search,
  Filter,
  Star,
  Crown,
  Clock,
  Bookmark
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  gradient: string;
  features: string[];
  isPremium: boolean;
  comingSoon?: boolean;
}

interface GenerationHistory {
  id: string;
  toolId: string;
  toolName: string;
  prompt: string;
  result: any;
  createdAt: string;
  isFavorite: boolean;
}

const aiTools: AITool[] = [
  {
    id: 'aesthetic-generator',
    name: 'Aesthetic Generator',
    description: 'Generate beautiful design systems with AI-powered color palettes, typography, and layouts',
    icon: <Palette className="w-6 h-6" />,
    category: 'Design',
    difficulty: 'Intermediate',
    estimatedTime: '2-3 minutes',
    gradient: 'from-pink-500 to-purple-500',
    features: ['Color Palette Generation', 'Typography Systems', 'Layout Templates', 'Component Designs'],
    isPremium: false
  },
  {
    id: 'prompt-packs',
    name: 'Prompt Pack Generator',
    description: 'Create comprehensive prompt collections for specific industries and use cases',
    icon: <Brain className="w-6 h-6" />,
    category: 'Content',
    difficulty: 'Beginner',
    estimatedTime: '1-2 minutes',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Industry-Specific Prompts', 'Use Case Templates', 'Variable Integration', 'Quality Scoring'],
    isPremium: false
  },
  {
    id: 'niche-engine',
    name: 'Auto Niche Engine',
    description: 'Discover profitable niches with AI-powered market analysis and opportunity identification',
    icon: <Target className="w-6 h-6" />,
    category: 'Business',
    difficulty: 'Advanced',
    estimatedTime: '3-5 minutes',
    gradient: 'from-green-500 to-emerald-500',
    features: ['Market Analysis', 'Competition Research', 'Opportunity Mapping', 'Revenue Projections'],
    isPremium: true
  },
  {
    id: 'invoice-generator',
    name: 'Smart Invoice Generator',
    description: 'Generate professional invoices with AI-powered layout optimization and smart calculations',
    icon: <Receipt className="w-6 h-6" />,
    category: 'Business',
    difficulty: 'Beginner',
    estimatedTime: '1 minute',
    gradient: 'from-orange-500 to-red-500',
    features: ['Professional Templates', 'Smart Calculations', 'Multi-Currency Support', 'PDF Export'],
    isPremium: false
  },
  {
    id: 'content-spawner',
    name: 'Content Spawner',
    description: 'Generate viral content across multiple platforms with trend analysis and optimization',
    icon: <Zap className="w-6 h-6" />,
    category: 'Content',
    difficulty: 'Intermediate',
    estimatedTime: '2-4 minutes',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Multi-Platform Content', 'Trend Analysis', 'Engagement Optimization', 'Hashtag Generation'],
    isPremium: true
  },
  {
    id: 'bundle-builder',
    name: 'Bundle Builder',
    description: 'Create compelling product bundles with AI-optimized pricing and marketing strategies',
    icon: <Package className="w-6 h-6" />,
    category: 'Business',
    difficulty: 'Advanced',
    estimatedTime: '5-7 minutes',
    gradient: 'from-indigo-500 to-purple-500',
    features: ['Pricing Optimization', 'Marketing Copy', 'Bundle Strategy', 'Sales Projections'],
    isPremium: true
  },
  {
    id: 'seo-optimizer',
    name: 'SEO Optimizer Pro',
    description: 'Analyze and optimize content for search engines with advanced AI recommendations',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'Marketing',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 minutes',
    gradient: 'from-yellow-500 to-orange-500',
    features: ['Keyword Analysis', 'Content Optimization', 'Technical SEO', 'Competitor Analysis'],
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    description: 'Plan and generate social media content with AI-powered scheduling and optimization',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'Marketing',
    difficulty: 'Intermediate',
    estimatedTime: '2-3 minutes',
    gradient: 'from-cyan-500 to-blue-500',
    features: ['Content Calendar', 'Platform Optimization', 'Engagement Analytics', 'Hashtag Research'],
    isPremium: true,
    comingSoon: true
  }
];

export default function GenerationHub() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);

  const categories = ['All', 'Design', 'Content', 'Business', 'Marketing'];

  useEffect(() => {
    // Fetch user data and generation history
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data || data.user || data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
    // loadGenerationHistory();
  }, []);

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/20';
      case 'Advanced': return 'text-red-400 bg-red-900/20';
      default: return 'text-blue-400 bg-blue-900/20';
    }
  };

  const handleToolSelect = (tool: AITool) => {
    if (tool.comingSoon) return;
    setSelectedTool(tool);
  };

  const canAccessTool = (tool: AITool) => {
    if (!tool.isPremium) return true;
    return user?.subscription?.plan === 'PRO' || user?.subscription?.plan === 'ENTERPRISE';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Generation Hub</h1>
                <p className="text-zinc-400">Create anything with AI-powered tools</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-zinc-400">
                <Zap className="w-4 h-4" />
                <span>{user?.ai_credits_remaining || 'Unlimited'} credits</span>
              </div>
              <Badge variant="outline" className="text-cyan-400 border-cyan-500">
                {filteredTools.length} Tools Available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTool ? (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <Input
                    placeholder="Search AI tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured Tools */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Tools</h2>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  View Favorites
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.slice(0, 6).map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: tool.comingSoon ? 1 : 1.02 }}
                    whileTap={{ scale: tool.comingSoon ? 1 : 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        tool.comingSoon 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                      }`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.gradient}`}>
                            {tool.icon}
                          </div>
                          <div className="flex flex-col space-y-2">
                            {tool.isPremium && (
                              <Badge variant="outline" className="text-yellow-400 border-yellow-500">
                                <Crown className="w-3 h-3 mr-1" />
                                PRO
                              </Badge>
                            )}
                            {tool.comingSoon && (
                              <Badge variant="outline" className="text-blue-400 border-blue-500">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {tool.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-zinc-400" />
                              <span className="text-zinc-400">{tool.estimatedTime}</span>
                            </div>
                            <Badge className={getDifficultyColor(tool.difficulty)}>
                              {tool.difficulty}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Features</p>
                            <div className="flex flex-wrap gap-1">
                              {tool.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {tool.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tool.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            {tool.comingSoon ? (
                              <Button disabled className="w-full">
                                <Clock className="w-4 h-4 mr-2" />
                                Coming Soon
                              </Button>
                            ) : !canAccessTool(tool) ? (
                              <Button variant="outline" className="w-full">
                                <Crown className="w-4 h-4 mr-2" />
                                Upgrade Required
                              </Button>
                            ) : (
                              <Button className="w-full">
                                <Play className="w-4 h-4 mr-2" />
                                Generate Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All Tools */}
            {filteredTools.length > 6 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">All Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredTools.slice(6).map((tool) => (
                    <Card 
                      key={tool.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        tool.comingSoon 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:border-cyan-500/50'
                      }`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.gradient}`}>
                            {React.cloneElement(tool.icon as React.ReactElement, { className: 'w-4 h-4' })}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-sm">{tool.name}</h3>
                            <p className="text-xs text-zinc-400">{tool.category}</p>
                          </div>
                          {tool.isPremium && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        
                        <p className="text-xs text-zinc-400 mb-3 line-clamp-2">
                          {tool.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={getDifficultyColor(tool.difficulty)} variant="outline">
                            {tool.difficulty}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-500/20 rounded-lg w-fit mx-auto mb-4">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">8</h3>
                  <p className="text-zinc-400">AI Tools Available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-500/20 rounded-lg w-fit mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{history.length}</h3>
                  <p className="text-zinc-400">Generations Created</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-500/20 rounded-lg w-fit mx-auto mb-4">
                    <Star className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">4.9</h3>
                  <p className="text-zinc-400">Average Quality Score</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div>
            {/* Tool Generator Interface will be rendered here */}
            <ToolGenerator 
              tool={selectedTool} 
              onBack={() => setSelectedTool(null)}
              user={user}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Tool Generator Component
function ToolGenerator({ tool, onBack, user }: { tool: AITool; onBack: () => void; user: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/products/universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: tool.id,
          action: 'generate',
          parameters: { ...formData, userId: user?.id }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.data);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.gradient}`}>
            {tool.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
            <p className="text-zinc-400">{tool.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getDifficultyColor(tool.difficulty)}>
            {tool.difficulty}
          </Badge>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {tool.estimatedTime}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Parameters</CardTitle>
            <CardDescription>Configure your AI generation settings</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Dynamic form based on tool type */}
            <ToolForm 
              tool={tool} 
              formData={formData} 
              setFormData={setFormData}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Result</CardTitle>
            <CardDescription>Your AI-generated content will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-white font-semibold">Generating with AI...</p>
                  <p className="text-zinc-400 text-sm">This may take a few moments</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <ToolResult tool={tool} result={result} />
                <div className="flex space-x-2">
                  <Button size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-400">
                <Wand2 className="w-12 h-12 mx-auto mb-4" />
                <p>Configure your settings and click Generate to begin</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dynamic form component
function ToolForm({ tool, formData, setFormData, onGenerate, isGenerating }: any) {
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderFormFields = () => {
    switch (tool.id) {
      case 'aesthetic-generator':
        return (
          <div className="space-y-4">
            <Input
              label="Design Theme"
              placeholder="e.g., Modern, Minimalist, Bold"
              value={formData.theme || ''}
              onChange={(e) => updateField('theme', e.target.value)}
            />
            <Input
              label="Primary Color"
              type="color"
              value={formData.primaryColor || '#000000'}
              onChange={(e) => updateField('primaryColor', e.target.value)}
            />
            <Select value={formData.mood || 'professional'} onValueChange={(value) => updateField('mood', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'prompt-packs':
        return (
          <div className="space-y-4">
            <Input
              label="Industry/Niche"
              placeholder="e.g., E-commerce, Healthcare, Education"
              value={formData.category || ''}
              onChange={(e) => updateField('category', e.target.value)}
            />
            <Input
              label="Use Case"
              placeholder="e.g., Content Creation, Sales Copy, Social Media"
              value={formData.useCase || ''}
              onChange={(e) => updateField('useCase', e.target.value)}
            />
            <Select value={formData.complexity || 'intermediate'} onValueChange={(value) => updateField('complexity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Complexity Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'niche-engine':
        return (
          <div className="space-y-4">
            <Input
              label="Your Interests"
              placeholder="e.g., Technology, Fitness, Cooking"
              value={formData.interests || ''}
              onChange={(e) => updateField('interests', e.target.value.split(','))}
            />
            <Input
              label="Your Skills"
              placeholder="e.g., Writing, Marketing, Design"
              value={formData.skills || ''}
              onChange={(e) => updateField('skills', e.target.value.split(','))}
            />
            <Input
              label="Target Revenue"
              type="number"
              placeholder="10000"
              value={formData.targetRevenue || ''}
              onChange={(e) => updateField('targetRevenue', parseInt(e.target.value))}
            />
          </div>
        );

      case 'invoice-generator':
        return (
          <div className="space-y-4">
            <Input
              label="Client Name"
              placeholder="Client Company Name"
              value={formData.clientName || ''}
              onChange={(e) => updateField('clientName', e.target.value)}
            />
            <Input
              label="Invoice Amount"
              type="number"
              placeholder="1000"
              value={formData.total || ''}
              onChange={(e) => updateField('total', parseFloat(e.target.value))}
            />
            <Input
              label="Description"
              placeholder="Professional Services"
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <Input
              label="Input Prompt"
              placeholder="Describe what you want to generate..."
              value={formData.prompt || ''}
              onChange={(e) => updateField('prompt', e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderFormFields()}
      
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate with AI
          </>
        )}
      </Button>
    </div>
  );
}

// Dynamic result component
function ToolResult({ tool, result }: { tool: AITool; result: any }) {
  const renderResult = () => {
    switch (tool.id) {
      case 'aesthetic-generator':
        return (
          <div className="space-y-4">
            {result.designs?.map((design: any, index: number) => (
              <div key={index} className="p-4 bg-zinc-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Design System {index + 1}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-400 mb-2">Color Palette</p>
                    <div className="flex space-x-2">
                      {design.colorPalette?.map((color: string, i: number) => (
                        <div 
                          key={i} 
                          className="w-8 h-8 rounded border-2 border-zinc-600"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400 mb-2">Typography</p>
                    <p className="text-sm text-white">{design.typography?.headings || 'Inter, system-ui'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'prompt-packs':
        return (
          <div className="space-y-3">
            {result.prompts?.map((prompt: any, index: number) => (
              <div key={index} className="p-4 bg-zinc-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">{prompt.title || `Prompt ${index + 1}`}</h4>
                <p className="text-zinc-300 text-sm mb-2">{prompt.prompt}</p>
                {prompt.variables && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.variables.map((variable: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'niche-engine':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <h4 className="font-semibold text-white mb-2">{result.niche?.name}</h4>
              <p className="text-zinc-300 text-sm mb-3">{result.niche?.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-400">Market Size:</span>
                  <span className="text-white ml-2">${result.niche?.marketSize?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-zinc-400">Competition:</span>
                  <span className="text-white ml-2">{result.niche?.competition}%</span>
                </div>
              </div>
            </div>
            {result.opportunities && (
              <div>
                <h5 className="font-semibold text-white mb-2">Opportunities</h5>
                <div className="space-y-2">
                  {result.opportunities.map((opp: any, index: number) => (
                    <div key={index} className="p-3 bg-zinc-800/30 rounded text-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-white">{opp.type || opp}</span>
                        {opp.difficulty && (
                          <Badge variant="outline" className="text-xs">
                            {opp.difficulty}
                          </Badge>
                        )}
                      </div>
                      {opp.description && (
                        <p className="text-zinc-400 text-xs mt-1">{opp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return renderResult();
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Beginner': return 'text-green-400 bg-green-900/20';
    case 'Intermediate': return 'text-yellow-400 bg-yellow-900/20';
    case 'Advanced': return 'text-red-400 bg-red-900/20';
    default: return 'text-blue-400 bg-blue-900/20';
  }
}