'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Star,
  Copy,
  Edit,
  Trash2,
  Eye,
  Download,
  Tag,
  Calendar,
  User,
  FileText,
  BarChart3,
  Bookmark,
  Share2,
  Clock,
  TrendingUp,
  ChevronDown,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  content: string;
  description?: string;
  category: string;
  tags: string[];
  variables: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublic: boolean;
  isFavorited: boolean;
  viewCount: number;
  copyCount: number;
  useCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface TemplateStats {
  totalTemplates: number;
  totalByCategory: Record<string, number>;
  totalByDifficulty: Record<string, number>;
  mostUsedTags: Array<{ tag: string; count: number }>;
  popularTemplates: Template[];
}

const templateCategories = [
  { value: 'MARKETING', label: 'Marketing', icon: '📢', color: 'bg-blue-500' },
  { value: 'SALES', label: 'Sales', icon: '💰', color: 'bg-green-500' },
  { value: 'CONTENT', label: 'Content Creation', icon: '✍️', color: 'bg-purple-500' },
  { value: 'EMAIL', label: 'Email Templates', icon: '📧', color: 'bg-orange-500' },
  { value: 'SOCIAL', label: 'Social Media', icon: '📱', color: 'bg-pink-500' },
  { value: 'BUSINESS', label: 'Business Documents', icon: '📋', color: 'bg-indigo-500' },
  { value: 'COPYWRITING', label: 'Copywriting', icon: '📝', color: 'bg-red-500' },
  { value: 'SEO', label: 'SEO Content', icon: '🔍', color: 'bg-cyan-500' },
  { value: 'PROMPTS', label: 'AI Prompts', icon: '🤖', color: 'bg-emerald-500' },
  { value: 'OTHER', label: 'Other', icon: '📄', color: 'bg-gray-500' }
];

const difficultyLevels = [
  { value: 'BEGINNER', label: 'Beginner', color: 'text-green-400' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: 'text-yellow-400' },
  { value: 'ADVANCED', label: 'Advanced', color: 'text-red-400' }
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState<TemplateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<'all' | 'my' | 'public' | 'favorites'>('all');

  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTags, sortBy, sortOrder, filter]);

  const fetchTemplates = async () => {
    try {
      const params = new URLSearchParams({
        ...(searchQuery && { query: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
        ...(filter !== 'all' && { filter }),
        sortBy,
        sortOrder,
        limit: '50'
      });

      const response = await fetch(`/api/templates?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/templates/stats', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (templateId: string, action: string) => {
    try {
      switch (action) {
        case 'favorite':
          const favoriteResponse = await fetch(`/api/templates/${templateId}/favorite`, {
            method: 'POST',
            credentials: 'include'
          });
          
          if (favoriteResponse.ok) {
            setTemplates(prev => prev.map(template => 
              template.id === templateId 
                ? { ...template, isFavorited: !template.isFavorited }
                : template
            ));
          }
          break;

        case 'copy':
          const template = templates.find(t => t.id === templateId);
          if (template) {
            await navigator.clipboard.writeText(template.content);
            
            const copyResponse = await fetch(`/api/templates/${templateId}/action`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ action: 'copy' })
            });
            
            if (copyResponse.ok) {
              setTemplates(prev => prev.map(t => 
                t.id === templateId 
                  ? { ...t, copyCount: t.copyCount + 1 }
                  : t
              ));
            }
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryConfig = templateCategories.find(c => c.value === category);
    return categoryConfig?.icon || '📄';
  };

  const getCategoryColor = (category: string) => {
    const categoryConfig = templateCategories.find(c => c.value === category);
    return categoryConfig?.color || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    const difficultyConfig = difficultyLevels.find(d => d.value === difficulty);
    return difficultyConfig?.color || 'text-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Template Library</h1>
              <p className="text-zinc-400 mt-2">Ready-to-use templates for all your content needs</p>
            </div>
            
            <Link
              href="/dashboard/templates/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total Templates</p>
                  <p className="text-2xl font-bold">{stats.totalTemplates.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Categories</p>
                  <p className="text-2xl font-bold">{Object.keys(stats.totalByCategory).length}</p>
                </div>
                <Tag className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Popular Tags</p>
                  <p className="text-lg font-bold">
                    {stats.mostUsedTags[0]?.tag || 'None'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Most Popular</p>
                  <p className="text-lg font-bold">
                    {stats.popularTemplates[0]?.title.substring(0, 20) + '...' || 'None'}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              {[
                { key: 'all', label: 'All Templates' },
                { key: 'my', label: 'My Templates' },
                { key: 'public', label: 'Public' },
                { key: 'favorites', label: 'Favorites' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    filter === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {templateCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              {difficultyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Created</option>
                <option value="updatedAt">Updated</option>
                <option value="rating">Rating</option>
                <option value="viewCount">Views</option>
                <option value="useCount">Uses</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        {templates.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all cursor-pointer ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : ''
                }`}
              >
                <Link href={`/dashboard/templates/${template.id}`} className="flex-1">
                  <div className={viewMode === 'list' ? 'flex items-center space-x-4' : ''}>
                    {/* Category & Difficulty Badges */}
                    <div className={`flex items-center space-x-2 mb-3 ${viewMode === 'list' ? 'mb-0' : ''}`}>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)} text-white`}>
                        <span className="mr-1">{getCategoryIcon(template.category)}</span>
                        {templateCategories.find(c => c.value === template.category)?.label}
                      </div>
                      
                      <div className={`text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">{template.title}</h3>
                      
                      {template.description && (
                        <p className="text-zinc-400 text-sm mb-4 line-clamp-3">{template.description}</p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {template.author.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(template.createdAt)}
                        </span>
                      </div>

                      {/* Tags */}
                      {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                              +{template.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Actions */}
                <div className={`flex items-center space-x-2 ${viewMode === 'list' ? '' : 'justify-between'}`}>
                  <div className="flex items-center space-x-3 text-zinc-400">
                    <span className="flex items-center text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      {template.viewCount}
                    </span>
                    <span className="flex items-center text-xs">
                      <Copy className="w-3 h-3 mr-1" />
                      {template.copyCount}
                    </span>
                    <span className="flex items-center text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {template.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAction(template.id, 'favorite')}
                      className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                        template.isFavorited ? 'text-yellow-400' : 'text-zinc-400'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleAction(template.id, 'copy')}
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No templates found</h3>
            <p className="text-zinc-400 mb-6">
              {searchQuery || selectedCategory || selectedDifficulty 
                ? 'Try adjusting your filters or search terms'
                : 'Start creating templates to build your library'
              }
            </p>
            <Link
              href="/dashboard/templates/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}