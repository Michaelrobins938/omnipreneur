'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Star,
  Copy,
  Share2,
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  User,
  BarChart3,
  Clock,
  FileText,
  Folder,
  Heart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Bookmark,
  Settings
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
  originalPrompt?: string;
  contextData?: any;
  isFavorited: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  folder?: {
    id: string;
    name: string;
    color?: string;
  };
}

const contentTypes = [
  { value: 'PROMPT', label: 'Prompt', color: 'bg-purple-500', icon: '🎯' },
  { value: 'SOCIAL_POST', label: 'Social Post', color: 'bg-blue-500', icon: '📱' },
  { value: 'BLOG_POST', label: 'Blog Post', color: 'bg-green-500', icon: '📝' },
  { value: 'EMAIL', label: 'Email', color: 'bg-orange-500', icon: '📧' },
  { value: 'BUNDLE', label: 'Bundle', color: 'bg-pink-500', icon: '📦' },
  { value: 'AFFILIATE_LINK', label: 'Affiliate Link', color: 'bg-indigo-500', icon: '🔗' },
  { value: 'REWRITE', label: 'Rewrite', color: 'bg-cyan-500', icon: '✏️' },
  { value: 'CAMPAIGN', label: 'Campaign', color: 'bg-red-500', icon: '🚀' },
  { value: 'TEMPLATE', label: 'Template', color: 'bg-yellow-500', icon: '📋' },
  { value: 'IDEA', label: 'Idea', color: 'bg-emerald-500', icon: '💡' },
  { value: 'OTHER', label: 'Other', color: 'bg-gray-500', icon: '📄' }
];

export default function ContentItemPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchContentItem(params.id as string);
    }
  }, [params.id]);

  const fetchContentItem = async (id: string) => {
    try {
      const response = await fetch(`/api/content-library/${id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setItem(data.data);
        
        // Track view
        await fetch(`/api/content-library/${id}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ action: 'view' })
        });
      } else {
        setError('Content item not found');
      }
    } catch (error) {
      console.error('Failed to fetch content item:', error);
      setError('Failed to load content item');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, data?: any) => {
    if (!item) return;
    
    setActionLoading(action);
    
    try {
      switch (action) {
        case 'favorite':
          const favoriteResponse = await fetch(`/api/content-library/${item.id}/favorite`, {
            method: 'POST',
            credentials: 'include'
          });
          
          if (favoriteResponse.ok) {
            setItem(prev => prev ? { ...prev, isFavorited: !prev.isFavorited } : null);
          }
          break;

        case 'copy':
          await navigator.clipboard.writeText(item.content);
          
          const copyResponse = await fetch(`/api/content-library/${item.id}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ action: 'copy' })
          });
          
          if (copyResponse.ok) {
            setItem(prev => prev ? { ...prev, copyCount: prev.copyCount + 1 } : null);
          }
          break;

        case 'rate':
          const rateResponse = await fetch(`/api/content-library/${item.id}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ rating: data.rating })
          });
          
          if (rateResponse.ok) {
            setItem(prev => prev ? { ...prev, userRating: data.rating } : null);
          }
          break;

        case 'delete':
          if (confirm('Are you sure you want to delete this content item?')) {
            const deleteResponse = await fetch(`/api/content-library/${item.id}`, {
              method: 'DELETE',
              credentials: 'include'
            });
            
            if (deleteResponse.ok) {
              router.push('/dashboard/content-library');
            }
          }
          break;

        case 'archive':
          const archiveResponse = await fetch(`/api/content-library/${item.id}/archive`, {
            method: 'POST',
            credentials: 'include'
          });
          
          if (archiveResponse.ok) {
            setItem(prev => prev ? { ...prev, isArchived: !prev.isArchived } : null);
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const getTypeConfig = (type: string) => {
    return contentTypes.find(t => t.value === type) || contentTypes[contentTypes.length - 1];
  };

  const getQualityColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStarRating = (rating?: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={interactive ? () => handleAction('rate', { rating: i }) : undefined}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform ${
            rating && i <= rating ? 'text-yellow-400' : 'text-zinc-600'
          }`}
          disabled={!interactive || actionLoading === 'rate'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Content Not Found</h1>
          <p className="text-zinc-400 mb-6">{error || 'The requested content item could not be found.'}</p>
          <Link
            href="/dashboard/content-library"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = getTypeConfig(item.contentType);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/content-library" 
            className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Content Library
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeConfig.color} text-white`}>
                  <span className="mr-2">{typeConfig.icon}</span>
                  {typeConfig.label}
                </div>
                
                {item.folder && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300">
                    <Folder className="w-3 h-3 mr-1" />
                    {item.folder.name}
                  </div>
                )}
                
                {item.isArchived && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-900 text-red-300">
                    Archived
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">{item.title}</h1>
              
              <div className="flex items-center space-x-6 text-sm text-zinc-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {formatDate(item.createdAt)}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated {formatDate(item.updatedAt)}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {item.viewCount} views
                </span>
                <span className="flex items-center">
                  <Copy className="w-4 h-4 mr-1" />
                  {item.copyCount} copies
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAction('favorite')}
                disabled={actionLoading === 'favorite'}
                className={`p-2 rounded-lg transition-colors ${
                  item.isFavorited 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                <Star className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleAction('copy')}
                disabled={actionLoading === 'copy'}
                className="p-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
              
              <Link
                href={`/dashboard/content-library/item/${item.id}/edit`}
                className="p-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </Link>
              
              <button
                onClick={() => handleAction('archive')}
                disabled={actionLoading === 'archive'}
                className="p-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white rounded-lg transition-colors"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleAction('delete')}
                disabled={actionLoading === 'delete'}
                className="p-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl"
            >
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Content
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-zinc-300 font-mono text-sm bg-zinc-800/50 p-4 rounded-lg">
                    {item.content}
                  </pre>
                </div>
              </div>
            </motion.div>

            {/* Original Prompt */}
            {item.originalPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl"
              >
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-xl font-semibold text-white">Original Prompt</h2>
                </div>
                <div className="p-6">
                  <p className="text-zinc-300 italic">{item.originalPrompt}</p>
                </div>
              </motion.div>
            )}

            {/* Context Data */}
            {item.contextData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl"
              >
                <div className="p-6 border-b border-zinc-800">
                  <h2 className="text-xl font-semibold text-white">Context Data</h2>
                </div>
                <div className="p-6">
                  <pre className="text-zinc-400 text-sm bg-zinc-800/50 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(item.contextData, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Performance
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Views</span>
                  <span className="font-semibold">{item.viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Copies</span>
                  <span className="font-semibold">{item.copyCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Shares</span>
                  <span className="font-semibold">{item.shareCount}</span>
                </div>
                {item.qualityScore && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Quality Score</span>
                    <span className={`font-semibold ${getQualityColor(item.qualityScore)}`}>
                      {(item.qualityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* User Rating */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Your Rating</h3>
              {renderStarRating(item.userRating, true)}
              {item.userRating && (
                <p className="text-sm text-zinc-400 mt-2">
                  You rated this {item.userRating} out of 5 stars
                </p>
              )}
            </motion.div>

            {/* Tags & Keywords */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags & Keywords
              </h3>
              
              {item.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {item.keywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.map(keyword => (
                      <span key={keyword} className="px-2 py-1 bg-blue-900/20 text-blue-300 text-sm rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-zinc-400">Source:</span>
                  <span className="ml-2 font-medium">{item.productSource}</span>
                </div>
                
                {item.targetAudience && (
                  <div>
                    <span className="text-zinc-400">Target Audience:</span>
                    <span className="ml-2 font-medium">{item.targetAudience}</span>
                  </div>
                )}
                
                {item.niche && (
                  <div>
                    <span className="text-zinc-400">Niche:</span>
                    <span className="ml-2 font-medium">{item.niche}</span>
                  </div>
                )}
                
                <div>
                  <span className="text-zinc-400">Last Accessed:</span>
                  <span className="ml-2 font-medium">{formatDate(item.lastAccessedAt)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}