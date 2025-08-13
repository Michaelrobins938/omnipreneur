'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Folder,
  Star,
  Copy,
  Share2,
  Eye,
  Calendar,
  Tag,
  BarChart3,
  Grid,
  List,
  Plus,
  ChevronDown,
  Bookmark,
  Trash2,
  Edit,
  Download,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  contentType: string;
  productSource: string;
  tags: string[];
  keywords: string[];
  targetAudience?: string;
  niche?: string;
  qualityScore?: number;
  userRating?: number;
  viewCount: number;
  copyCount: number;
  shareCount: number;
  isFavorited: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  folder?: {
    id: string;
    name: string;
    color?: string;
  };
}

interface ContentLibraryStats {
  totalItems: number;
  totalByType: Record<string, number>;
  averageQualityScore: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  recentActivity: Array<{
    id: string;
    title: string;
    action: string;
    timestamp: string;
  }>;
}

interface Folder {
  id: string;
  name: string;
  color?: string;
  parentId?: string;
  children?: Folder[];
  _count: { content: number };
}

const ContentLibraryDashboard: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ContentLibraryStats | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const contentTypes = [
    { value: 'PROMPT', label: 'Prompts', color: 'bg-purple-500' },
    { value: 'SOCIAL_POST', label: 'Social Posts', color: 'bg-blue-500' },
    { value: 'BLOG_POST', label: 'Blog Posts', color: 'bg-green-500' },
    { value: 'EMAIL', label: 'Emails', color: 'bg-orange-500' },
    { value: 'BUNDLE', label: 'Bundles', color: 'bg-pink-500' },
    { value: 'AFFILIATE_LINK', label: 'Affiliate Links', color: 'bg-indigo-500' },
    { value: 'REWRITE', label: 'Rewrites', color: 'bg-cyan-500' },
    { value: 'CAMPAIGN', label: 'Campaigns', color: 'bg-red-500' },
    { value: 'TEMPLATE', label: 'Templates', color: 'bg-yellow-500' },
    { value: 'IDEA', label: 'Ideas', color: 'bg-emerald-500' }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    searchContent();
  }, [debouncedQuery, selectedType, selectedFolder, selectedTags, sortBy, sortOrder]);

  const fetchInitialData = async () => {
    try {
      const [statsRes, foldersRes] = await Promise.all([
        fetch('/api/content-library/stats'),
        fetch('/api/content-library/folders')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        setFolders(foldersData.data);
      }

      await searchContent();
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load content library.');
    } finally {
      setLoading(false);
    }
  };

  const searchContent = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedType) params.append('type', selectedType);
      if (selectedFolder) params.append('folder', selectedFolder);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('limit', '50');

      const response = await fetch(`/api/content-library?${params}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.data.items);
      }
    } catch (error) {
      console.error('Error searching content:', error);
    }
  };

  const handleContentInteraction = async (contentId: string, action: 'copy' | 'share' | 'view') => {
    try {
      await fetch('/api/content-library/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, action })
      });

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              [`${action}Count`]: item[`${action}Count` as keyof ContentItem] as number + 1 
            }
          : item
      ));

      if (action === 'copy') {
        // Copy content to clipboard
        const item = content.find(c => c.id === contentId);
        if (item) {
          await navigator.clipboard.writeText(item.content);
        }
      }
    } catch (error) {
      console.error(`Error tracking ${action}:`, error);
    }
  };

  const updateContentRating = async (contentId: string, rating: number) => {
    try {
      await fetch(`/api/content-library/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRating: rating })
      });

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, userRating: rating } : item
      ));
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const toggleFavorite = async (contentId: string) => {
    try {
      const item = content.find(c => c.id === contentId);
      if (!item) return;

      await fetch(`/api/content-library/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorited: !item.isFavorited })
      });

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, isFavorited: !item.isFavorited } : item
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderStatsCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => (
    <motion.div
      className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-zinc-400">{title}</p>
        </div>
      </div>
    </motion.div>
  );

  const renderContentCard = (item: ContentItem) => (
    <motion.div
      key={item.id}
      className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedContent(item)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            contentTypes.find(t => t.value === item.contentType)?.color || 'bg-gray-500'
          }`} />
          <span className="text-xs text-zinc-400 uppercase tracking-wide">
            {contentTypes.find(t => t.value === item.contentType)?.label || item.contentType}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className={`p-1 rounded ${item.isFavorited ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Star className={`w-4 h-4 ${item.isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
      <p className="text-zinc-400 text-sm mb-4 line-clamp-3">{item.content}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {item.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">
            +{item.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-zinc-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{item.viewCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Copy className="w-3 h-3" />
            <span>{item.copyCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share2 className="w-3 h-3" />
            <span>{item.shareCount}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {item.qualityScore && (
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400">
                {Math.round(item.qualityScore * 100)}%
              </span>
            </div>
          )}
          <span className="text-xs text-zinc-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading your content library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Library</h1>
          <p className="text-zinc-400">Manage and discover your AI-generated content</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {renderStatsCard(
              'Total Items',
              stats.totalItems,
              <Bookmark className="w-6 h-6 text-white" />,
              'bg-gradient-to-r from-blue-500 to-cyan-500'
            )}
            {renderStatsCard(
              'Avg Quality',
              `${Math.round(stats.averageQualityScore * 100)}%`,
              <BarChart3 className="w-6 h-6 text-white" />,
              'bg-gradient-to-r from-green-500 to-emerald-500'
            )}
            {renderStatsCard(
              'Content Types',
              Object.keys(stats.totalByType).length,
              <Grid className="w-6 h-6 text-white" />,
              'bg-gradient-to-r from-purple-500 to-pink-500'
            )}
            {renderStatsCard(
              'Top Tags',
              stats.mostUsedTags.length,
              <Tag className="w-6 h-6 text-white" />,
              'bg-gradient-to-r from-orange-500 to-red-500'
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center bg-zinc-800 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="qualityScore-desc">Highest Quality</option>
                <option value="userRating-desc">Highest Rated</option>
                <option value="viewCount-desc">Most Viewed</option>
                <option value="title-asc">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-zinc-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Content Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Content Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Folder Filter */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Folder</label>
                    <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Folders</option>
                      {folders.map(folder => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name} ({folder._count.content})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {stats?.mostUsedTags.slice(0, 5).map(tag => (
                        <button
                          key={tag.tag}
                          onClick={() => {
                            setSelectedTags(prev => 
                              prev.includes(tag.tag)
                                ? prev.filter(t => t !== tag.tag)
                                : [...prev, tag.tag]
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            selectedTags.includes(tag.tag)
                              ? 'bg-blue-600 text-white'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          {tag.tag} ({tag.count})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Grid */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}>
          {content.map(item => renderContentCard(item))}
        </div>

        {content.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">No content found</h3>
            <p className="text-zinc-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Content Detail Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedContent.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-zinc-400">
                    <span className={`px-2 py-1 rounded-full ${
                      contentTypes.find(t => t.value === selectedContent.contentType)?.color || 'bg-gray-500'
                    } text-white`}>
                      {contentTypes.find(t => t.value === selectedContent.contentType)?.label}
                    </span>
                    <span>From {selectedContent.productSource}</span>
                    <span>{new Date(selectedContent.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Content</h3>
                <div className="bg-zinc-800 rounded-lg p-4 whitespace-pre-wrap text-zinc-300">
                  {selectedContent.content}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Views:</span>
                      <span className="text-white">{selectedContent.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Copies:</span>
                      <span className="text-white">{selectedContent.copyCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Shares:</span>
                      <span className="text-white">{selectedContent.shareCount}</span>
                    </div>
                    {selectedContent.qualityScore && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Quality Score:</span>
                        <span className="text-white">{Math.round(selectedContent.qualityScore * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleContentInteraction(selectedContent.id, 'copy')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleContentInteraction(selectedContent.id, 'share')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedContent.id)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedContent.isFavorited 
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${selectedContent.isFavorited ? 'fill-current' : ''}`} />
                    <span>{selectedContent.isFavorited ? 'Unfavorite' : 'Favorite'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-zinc-400">Rate:</span>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateContentRating(selectedContent.id, rating)}
                      className={`p-1 ${
                        selectedContent.userRating && rating <= selectedContent.userRating
                          ? 'text-yellow-400'
                          : 'text-zinc-600 hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${
                        selectedContent.userRating && rating <= selectedContent.userRating ? 'fill-current' : ''
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentLibraryDashboard;