'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  Book,
  Zap,
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  ThumbsUp,
  MessageCircle,
  Filter,
  Tag,
  ExternalLink,
  FileText,
  Video,
  Image as ImageIcon,
  Bookmark,
  TrendingUp
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  views: number;
  helpfulVotes: number;
  lastUpdated: string;
  author: string;
  type: 'article' | 'video' | 'tutorial' | 'faq';
  featured: boolean;
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  articleCount: number;
}

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using Omnipreneur AI',
    icon: Zap,
    color: 'bg-blue-500',
    articleCount: 12
  },
  {
    id: 'content-generation',
    name: 'Content Generation',
    description: 'Master AI-powered content creation',
    icon: FileText,
    color: 'bg-green-500',
    articleCount: 18
  },
  {
    id: 'account-billing',
    name: 'Account & Billing',
    description: 'Manage your account and subscriptions',
    icon: CreditCard,
    color: 'bg-purple-500',
    articleCount: 8
  },
  {
    id: 'templates-library',
    name: 'Templates & Library',
    description: 'Work with templates and content library',
    icon: Book,
    color: 'bg-orange-500',
    articleCount: 15
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Connect with third-party tools',
    icon: Settings,
    color: 'bg-cyan-500',
    articleCount: 10
  },
  {
    id: 'privacy-security',
    name: 'Privacy & Security',
    description: 'Data protection and security features',
    icon: Shield,
    color: 'bg-red-500',
    articleCount: 6
  }
];

// Sample articles - in a real app, these would come from a CMS or database
const sampleArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Getting Started with Omnipreneur AI',
    content: 'Complete guide to getting started...',
    excerpt: 'Learn how to set up your account and create your first AI-generated content in minutes.',
    category: 'getting-started',
    tags: ['beginner', 'setup', 'account'],
    difficulty: 'beginner',
    estimatedReadTime: 5,
    views: 2543,
    helpfulVotes: 189,
    lastUpdated: '2025-01-10',
    author: 'Support Team',
    type: 'tutorial',
    featured: true
  },
  {
    id: '2',
    title: 'Creating High-Quality Marketing Copy with AI',
    content: 'Advanced techniques for marketing copy...',
    excerpt: 'Discover proven strategies for generating compelling marketing copy that converts.',
    category: 'content-generation',
    tags: ['marketing', 'copywriting', 'advanced'],
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    views: 1876,
    helpfulVotes: 145,
    lastUpdated: '2025-01-08',
    author: 'Marketing Team',
    type: 'article',
    featured: true
  },
  {
    id: '3',
    title: 'Managing Your Subscription and Billing',
    content: 'Everything about billing...',
    excerpt: 'Learn how to upgrade, downgrade, and manage your subscription settings.',
    category: 'account-billing',
    tags: ['billing', 'subscription', 'account'],
    difficulty: 'beginner',
    estimatedReadTime: 4,
    views: 1432,
    helpfulVotes: 98,
    lastUpdated: '2025-01-05',
    author: 'Support Team',
    type: 'faq',
    featured: false
  },
  {
    id: '4',
    title: 'Building Your Template Library',
    content: 'Template management guide...',
    excerpt: 'Organize and optimize your content templates for maximum efficiency.',
    category: 'templates-library',
    tags: ['templates', 'organization', 'productivity'],
    difficulty: 'intermediate',
    estimatedReadTime: 6,
    views: 1234,
    helpfulVotes: 87,
    lastUpdated: '2025-01-03',
    author: 'Product Team',
    type: 'tutorial',
    featured: false
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState<HelpArticle[]>(sampleArticles);
  const [filteredArticles, setFilteredArticles] = useState<HelpArticle[]>(sampleArticles);
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedType, articles]);

  const filterArticles = () => {
    let filtered = articles;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(article => article.difficulty === selectedDifficulty);
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(article => article.type === selectedType);
    }

    setFilteredArticles(filtered);
  };

  const featuredArticles = articles.filter(article => article.featured);
  const popularArticles = articles.sort((a, b) => b.views - a.views).slice(0, 5);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'tutorial': return Book;
      case 'faq': return HelpCircle;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-blue-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
            <p className="text-xl text-zinc-400">
              Find answers, learn best practices, and get the most out of Omnipreneur AI
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, tutorials, and guides..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-400">Quick filters:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {helpCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="article">Articles</option>
              <option value="tutorial">Tutorials</option>
              <option value="video">Videos</option>
              <option value="faq">FAQs</option>
            </select>
          </div>
        </motion.div>

        {/* Categories Grid */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-zinc-400 text-sm mb-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">{category.articleCount} articles</span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Articles */}
            {!searchQuery && featuredArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all cursor-pointer group"
                    >
                      <Link href={`/support/help/article/${article.id}`}>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            {React.createElement(getTypeIcon(article.type), { className: "w-5 h-5 text-blue-400" })}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-zinc-400 text-sm mb-4">{article.excerpt}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-zinc-500">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.estimatedReadTime} min read
                              </span>
                              <span className={`px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                {article.difficulty}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {article.helpfulVotes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search Results / All Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {searchQuery ? `Search Results (${filteredArticles.length})` : 'All Articles'}
                </h2>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-zinc-400">Sort by:</span>
                  <select className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:ring-2 focus:ring-blue-500">
                    <option value="relevance">Relevance</option>
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all cursor-pointer group"
                    >
                      <Link href={`/support/help/article/${article.id}`}>
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            {React.createElement(getTypeIcon(article.type), { className: "w-5 h-5 text-zinc-400" })}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-zinc-400 text-sm mb-4">{article.excerpt}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-zinc-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {article.estimatedReadTime} min
                                </span>
                                <span className={`px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                  {article.difficulty}
                                </span>
                                <span className="flex items-center">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {article.helpfulVotes}
                                </span>
                                <span className="flex items-center">
                                  <Star className="w-3 h-3 mr-1" />
                                  {article.views} views
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {article.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No articles found</h3>
                  <p className="text-zinc-400 mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                      setSelectedDifficulty('');
                      setSelectedType('');
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Popular Articles */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Popular Articles
                </h3>
                <div className="space-y-3">
                  {popularArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/support/help/article/${article.id}`}
                      className="block p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-zinc-500">
                        <span>{article.views} views</span>
                        <span>•</span>
                        <span>{article.estimatedReadTime} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Contact Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Need More Help?</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/support/tickets"
                    className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 inline" />
                    Create Support Ticket
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}