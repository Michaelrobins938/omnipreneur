'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Lightbulb,
  ArrowRight,
  Star,
  Clock,
  Users,
  Zap,
  ChevronRight
} from 'lucide-react';

interface RecommendedProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  reason: string;
  confidence: number;
  icon: string;
  href: string;
  estimatedValue: string;
  timeToValue: string;
  popularityScore: number;
}

interface UserProfile {
  industry?: string;
  role?: string;
  goals?: string[];
  usagePattern?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface ProductRecommendationsProps {
  className?: string;
}

export default function ProductRecommendations({ className = '' }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'new' | 'personalized'>('personalized');

  useEffect(() => {
    generateRecommendations();
  }, [filter]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      // Fetch user profile and analytics data
      const [userRes, analyticsRes] = await Promise.all([
        fetch('/api/users/me', { credentials: 'include' }),
        fetch('/api/analytics/dashboard', { credentials: 'include' })
      ]);

      let userProfile: UserProfile = {
        industry: 'Technology',
        role: 'Entrepreneur', 
        goals: ['growth', 'automation', 'content'],
        usagePattern: 'moderate',
        experienceLevel: 'intermediate'
      };

      let analyticsData = null;

      if (userRes.ok) {
        const userData = await userRes.json();
        // Extract profile info from user data if available
        if (userData.data) {
          userProfile = {
            industry: userData.data.industry || 'Technology',
            role: userData.data.role || 'Entrepreneur',
            goals: userData.data.goals || ['growth', 'automation', 'content'],
            usagePattern: userData.data.subscription?.plan === 'FREE' ? 'light' : 'heavy',
            experienceLevel: userData.data.usage?.totalRequests > 100 ? 'advanced' : 'intermediate'
          };
        }
      }

      if (analyticsRes.ok) {
        const analytics = await analyticsRes.json();
        analyticsData = analytics.data;
      }

      setUserProfile(userProfile);

      // Enhance recommendations based on real data
      const enhancedProducts = getEnhancedRecommendations(userProfile, analyticsData);
      
      // Filter and sort based on current filter
      let filtered = [...enhancedProducts];
      
      switch (filter) {
        case 'trending':
          filtered = filtered.sort((a, b) => b.popularityScore - a.popularityScore);
          break;
        case 'new':
          filtered = filtered.filter(p => ['affiliate-portal', 'quantum-ai-processor'].includes(p.id));
          break;
        case 'personalized':
          filtered = filtered.sort((a, b) => b.confidence - a.confidence);
          break;
      }
      
      setRecommendations(filtered.slice(0, 4));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      // Fallback to static recommendations on error
      const fallbackProducts = getStaticRecommendations();
      setRecommendations(fallbackProducts.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  const getStaticRecommendations = (): RecommendedProduct[] => [
    {
      id: 'content-spawner',
      name: 'Content Spawner',
      description: 'Generate viral content for social media and marketing campaigns',
      category: 'Content Creation',
      reason: 'Perfect for your content marketing goals',
      confidence: 95,
      icon: '✨',
      href: '/products/content-spawner',
      estimatedValue: '$2,000/month saved',
      timeToValue: '2 hours',
      popularityScore: 94
    },
    {
      id: 'bundle-builder',
      name: 'Bundle Builder',
      description: 'Create profitable product bundles with AI optimization',
      category: 'E-commerce',
      reason: 'Entrepreneurs love this for revenue optimization',
      confidence: 88,
      icon: '📦',
      href: '/products/bundle-builder',
      estimatedValue: '$5,000/month increase',
      timeToValue: '1 day',
      popularityScore: 87
    },
    {
      id: 'lead-generation-pro',
      name: 'Lead Generation Pro',
      description: 'Advanced AI-powered lead scoring and qualification',
      category: 'Sales & Marketing',
      reason: 'High growth potential for your business',
      confidence: 92,
      icon: '🎯',
      href: '/products/lead-generation-pro',
      estimatedValue: '$3,500/month growth',
      timeToValue: '3 hours',
      popularityScore: 91
    },
    {
      id: 'seo-optimizer-pro',
      name: 'SEO Optimizer Pro',
      description: 'Comprehensive SEO analysis and optimization tools',
      category: 'Marketing',
      reason: 'Trending among tech entrepreneurs',
      confidence: 85,
      icon: '📈',
      href: '/products/seo-optimizer-pro',
      estimatedValue: '$1,800/month growth',
      timeToValue: '4 hours',
      popularityScore: 89
    },
    {
      id: 'email-marketing-suite',
      name: 'Email Marketing Suite',
      description: 'AI-powered email campaigns with advanced automation',
      category: 'Marketing',
      reason: 'Complements your content creation workflow',
      confidence: 83,
      icon: '📧',
      href: '/products/email-marketing-suite',
      estimatedValue: '$2,500/month ROI',
      timeToValue: '2 hours',
      popularityScore: 86
    },
    {
      id: 'affiliate-portal',
      name: 'Affiliate Portal',
      description: 'Manage and optimize your affiliate marketing programs',
      category: 'Revenue',
      reason: 'New feature trending with entrepreneurs',
      confidence: 79,
      icon: '🤝',
      href: '/products/affiliate-portal',
      estimatedValue: '$4,000/month potential',
      timeToValue: '1 day',
      popularityScore: 82
    }
  ];

  const getEnhancedRecommendations = (profile: UserProfile, analytics: any): RecommendedProduct[] => {
    const baseProducts = getStaticRecommendations();
    
    return baseProducts.map(product => {
      let confidence = product.confidence;
      let reason = product.reason;

      // Enhance based on user profile
      if (profile.usagePattern === 'heavy' && ['content-spawner', 'bundle-builder'].includes(product.id)) {
        confidence += 5;
        reason = `High usage pattern matches your ${product.category.toLowerCase()} needs`;
      }

      if (profile.experienceLevel === 'advanced' && product.id === 'novus-protocol') {
        confidence += 8;
        reason = 'Advanced users get maximum value from AI optimization';
      }

      // Enhance based on analytics data
      if (analytics) {
        if (analytics.totalContentPieces > analytics.totalBundles && product.id === 'content-spawner') {
          confidence += 10;
          reason = 'You\'re already creating content - amplify your results';
        }

        if (analytics.totalBundles > 5 && product.id === 'lead-generation-pro') {
          confidence += 7;
          reason = 'Bundle creators often benefit from lead generation';
        }
      }

      return {
        ...product,
        confidence: Math.min(confidence, 99),
        reason
      };
    });
  };

  const getReasonIcon = (confidence: number) => {
    if (confidence >= 90) return <Star className="w-4 h-4 text-yellow-500" />;
    if (confidence >= 85) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (confidence >= 80) return <Target className="w-4 h-4 text-blue-500" />;
    return <Lightbulb className="w-4 h-4 text-purple-500" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-yellow-500';
    if (confidence >= 85) return 'text-green-500';
    if (confidence >= 80) return 'text-blue-500';
    return 'text-purple-500';
  };

  if (loading) {
    return (
      <div className={`${className} bg-zinc-900/50 border border-zinc-800 rounded-xl p-6`}>
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-700 rounded mb-4 w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
            <p className="text-sm text-zinc-400">AI-powered product suggestions based on your usage</p>
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="personalized">Personalized</option>
          <option value="trending">Trending</option>
          <option value="new">New Products</option>
          <option value="all">All Products</option>
        </select>
      </div>

      {/* Profile Insights */}
      {userProfile && filter === 'personalized' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-5 h-5 text-purple-400" />
            <h4 className="font-medium text-white">Your Profile</h4>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">Industry:</span>
              <span className="text-white ml-1">{userProfile.industry}</span>
            </div>
            <div>
              <span className="text-zinc-400">Role:</span>
              <span className="text-white ml-1">{userProfile.role}</span>
            </div>
            <div>
              <span className="text-zinc-400">Experience:</span>
              <span className="text-white ml-1 capitalize">{userProfile.experienceLevel}</span>
            </div>
            <div>
              <span className="text-zinc-400">Usage:</span>
              <span className="text-white ml-1 capitalize">{userProfile.usagePattern}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <div className="grid gap-4">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex space-x-4 flex-1">
                {/* Product Icon */}
                <div className="w-12 h-12 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg flex items-center justify-center text-2xl">
                  {product.icon}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">{product.name}</h4>
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getReasonIcon(product.confidence)}
                      <span className={`text-sm font-medium ${getConfidenceColor(product.confidence)}`}>
                        {product.confidence}% match
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-400 mb-3">{product.description}</p>

                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-zinc-300">{product.reason}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-zinc-400">Value</p>
                        <p className="text-white font-medium">{product.estimatedValue}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-zinc-400">Setup Time</p>
                        <p className="text-white font-medium">{product.timeToValue}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-zinc-400">Popularity</p>
                        <p className="text-white font-medium">{product.popularityScore}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Link
                href={product.href}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors group-hover:scale-105 transform duration-200"
              >
                <span>Try Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View More */}
      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>View All Products</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}