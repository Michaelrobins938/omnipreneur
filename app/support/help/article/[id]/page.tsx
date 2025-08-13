'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';

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
  unhelpfulVotes: number;
  lastUpdated: string;
  author: string;
  type: 'article' | 'video' | 'tutorial' | 'faq';
  relatedArticles?: string[];
}

// Sample article data - in real app, this would come from an API
const sampleArticle: HelpArticle = {
  id: '1',
  title: 'Getting Started with Omnipreneur AI',
  content: `
# Getting Started with Omnipreneur AI

Welcome to Omnipreneur AI! This comprehensive guide will help you get up and running with our platform in just a few minutes.

## What is Omnipreneur AI?

Omnipreneur AI is a powerful platform that uses artificial intelligence to help entrepreneurs and businesses create high-quality content, automate marketing tasks, and scale their operations efficiently.

## Setting Up Your Account

### Step 1: Create Your Account
1. Visit our registration page
2. Enter your email address and create a secure password
3. Verify your email address
4. Complete your profile information

### Step 2: Choose Your Plan
We offer several subscription plans to meet your needs:
- **Starter**: Perfect for individuals and small projects
- **Professional**: Ideal for growing businesses
- **Enterprise**: For large organizations with advanced needs

### Step 3: Complete Your Profile
Add the following information to personalize your experience:
- Company information
- Industry and niche
- Content preferences
- Integration requirements

## Your First Content Generation

### Using the AI Content Generator
1. Navigate to the Content Generator from your dashboard
2. Select the type of content you want to create
3. Provide context and requirements
4. Review and refine the generated content
5. Save to your content library

### Best Practices for AI Content
- **Be specific**: Provide clear, detailed prompts
- **Set context**: Include background information about your business
- **Review and edit**: AI-generated content should be reviewed before use
- **Iterate**: Don't be afraid to regenerate and refine

## Managing Your Content Library

Your content library is where all your generated content is stored and organized.

### Organizing Content
- Use folders to categorize content by type or project
- Add tags for easy searching
- Rate content to track what works best
- Create templates from your best-performing content

### Sharing and Collaboration
- Share content with team members
- Set permissions for different user roles
- Export content in various formats
- Integrate with your existing tools

## Getting Help

If you need assistance:
- Check our Help Center for detailed guides
- Contact our support team via chat or email
- Join our community forum for tips and discussions
- Schedule a demo for personalized assistance

## Next Steps

Now that you're set up, here are some recommended next steps:
1. Explore our template library
2. Set up integrations with your existing tools
3. Create your first content campaign
4. Invite team members to collaborate

Remember, our support team is here to help you succeed. Don't hesitate to reach out if you have questions!
  `,
  excerpt: 'Learn how to set up your account and create your first AI-generated content in minutes.',
  category: 'getting-started',
  tags: ['beginner', 'setup', 'account', 'tutorial'],
  difficulty: 'beginner',
  estimatedReadTime: 8,
  views: 2543,
  helpfulVotes: 189,
  unhelpfulVotes: 12,
  lastUpdated: '2025-01-10',
  author: 'Support Team',
  type: 'tutorial',
  relatedArticles: ['2', '3', '4']
};

export default function HelpArticlePage() {
  const {
    ArrowLeft: ArrowLeftIcon = (() => null) as any,
    Clock: ClockIcon = (() => null) as any,
    User: UserIcon = (() => null) as any,
    Calendar: CalendarIcon = (() => null) as any,
    ThumbsUp: ThumbsUpIcon = (() => null) as any,
    ThumbsDown: ThumbsDownIcon = (() => null) as any,
    Bookmark: BookmarkIcon = (() => null) as any,
    Print: PrintIcon = (() => null) as any,
    Eye: EyeIcon = (() => null) as any,
    Tag: TagIcon = (() => null) as any,
    AlertCircle: AlertCircleIcon = (() => null) as any,
    ExternalLink: ExternalLinkIcon = (() => null) as any,
    Copy: CopyIcon = (() => null) as any,
    MessageCircle: MessageCircleIcon = (() => null) as any
  } = Icons as any;
  const params = useParams();
  const [article, setArticle] = useState<HelpArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'helpful' | 'unhelpful' | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    // In a real app, fetch article by ID from API
    setArticle(sampleArticle);
    setLoading(false);
    
    // Track article view
    trackArticleView(params.id as string);
  }, [params.id]);

  const trackArticleView = async (articleId: string) => {
    try {
      await fetch(`/api/support/help/articles/${articleId}/view`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Failed to track article view:', error);
    }
  };

  const handleVote = async (voteType: 'helpful' | 'unhelpful') => {
    if (userVote === voteType) return;
    
    try {
      const response = await fetch(`/api/support/help/articles/${article?.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ voteType })
      });

      if (response.ok) {
        setUserVote(voteType);
        if (article) {
          setArticle({
            ...article,
            helpfulVotes: voteType === 'helpful' ? article.helpfulVotes + 1 : article.helpfulVotes,
            unhelpfulVotes: voteType === 'unhelpful' ? article.unhelpfulVotes + 1 : article.unhelpfulVotes
          });
        }
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/support/help/articles/${article?.id}/bookmark`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error('Failed to bookmark article:', error);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'advanced': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-zinc-400 mb-6">The requested help article could not be found.</p>
          <Link
            href="/support/help"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Help Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/support/help" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors">
            {/* Icon removed to avoid missing import */}
            Back to Help Center
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Article Meta */}
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 border rounded-full text-sm ${getDifficultyColor(article.difficulty)}`}>
                {article.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-400/30 rounded-full text-sm">
                {article.type}
              </span>
              <div className="flex items-center text-sm text-zinc-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                {article.estimatedReadTime} min read
              </div>
              <div className="flex items-center text-sm text-zinc-500">
                <EyeIcon className="w-4 h-4 mr-1" />
                {article.views.toLocaleString()} views
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
            <p className="text-xl text-zinc-400 mb-6">{article.excerpt}</p>
            
            {/* Author and Date */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-zinc-500">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span>By {article.author}</span>
                </div>
                <div className="flex items-center text-sm text-zinc-500">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked ? 'bg-yellow-600/20 text-yellow-400' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <BookmarkIcon className="w-4 h-4" />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                  >
                    <span className="text-sm">Share</span>
                  </button>
                  
                  {showShareMenu && (
                    <div className="absolute right-0 top-12 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-10 min-w-48">
                      <div className="py-2">
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center"
                        >
                          <CopyIcon className="w-4 h-4 mr-2" />
                          Copy Link
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-2" />
                          Share on Twitter
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-2" />
                          Share on LinkedIn
                        </button>
                        <button
                          onClick={() => handleShare('email')}
                          className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-2" />
                          Send via Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  <PrintIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mb-8"
        >
          <div className="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
          </div>
        </motion.div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/support/help?tag=${tag}`}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-full text-sm transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Was this article helpful?</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleVote('helpful')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  userVote === 'helpful'
                    ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {/* Icon removed */}
                <span>Yes ({article.helpfulVotes})</span>
              </button>
              
              <button
                onClick={() => handleVote('unhelpful')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  userVote === 'unhelpful'
                    ? 'bg-red-600/20 text-red-400 border border-red-400/30'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {/* Icon removed */}
                <span>No ({article.unhelpfulVotes})</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-zinc-500">Still need help?</span>
              <Link
                href="/support/tickets"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <MessageCircleIcon className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {/* In real app, fetch related articles */}
            <Link
              href="/support/help/article/2"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <h4 className="font-medium text-white mb-2">Creating High-Quality Marketing Copy</h4>
              <p className="text-zinc-400 text-sm mb-2">Learn advanced techniques for AI-powered copywriting</p>
              <div className="flex items-center space-x-2 text-xs text-zinc-500">
                <ClockIcon className="w-3 h-3" />
                <span>8 min read</span>
                <span>•</span>
                <span>Intermediate</span>
              </div>
            </Link>
            
            <Link
              href="/support/help/article/3"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <h4 className="font-medium text-white mb-2">Managing Your Subscription</h4>
              <p className="text-zinc-400 text-sm mb-2">Everything you need to know about billing and plans</p>
              <div className="flex items-center space-x-2 text-xs text-zinc-500">
                <ClockIcon className="w-3 h-3" />
                <span>4 min read</span>
                <span>•</span>
                <span>Beginner</span>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}