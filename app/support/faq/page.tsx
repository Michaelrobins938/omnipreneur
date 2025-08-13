'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Tag,
  Clock,
  Star,
  BookOpen,
  Zap,
  CreditCard,
  Settings,
  Shield,
  Users,
  Filter,
  ExternalLink
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpfulVotes: number;
  unhelpfulVotes: number;
  lastUpdated: string;
  isPopular: boolean;
  relatedArticles?: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  faqCount: number;
}

const faqCategories: FAQCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Basic setup and first steps',
    icon: Zap,
    color: 'bg-blue-500',
    faqCount: 8
  },
  {
    id: 'account-billing',
    name: 'Account & Billing',
    description: 'Account management and payments',
    icon: CreditCard,
    color: 'bg-green-500',
    faqCount: 12
  },
  {
    id: 'features',
    name: 'Features & Usage',
    description: 'How to use platform features',
    icon: Settings,
    color: 'bg-purple-500',
    faqCount: 15
  },
  {
    id: 'privacy-security',
    name: 'Privacy & Security',
    description: 'Data protection and security',
    icon: Shield,
    color: 'bg-red-500',
    faqCount: 6
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Third-party integrations',
    icon: Users,
    color: 'bg-orange-500',
    faqCount: 9
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: HelpCircle,
    color: 'bg-cyan-500',
    faqCount: 11
  }
];

// Sample FAQ data
const sampleFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I get started with Omnipreneur AI?',
    answer: 'Getting started is easy! First, sign up for an account and choose your subscription plan. Then complete your profile setup, explore our template library, and start generating your first content. Our onboarding guide will walk you through each step.',
    category: 'getting-started',
    tags: ['onboarding', 'setup', 'beginner'],
    helpfulVotes: 245,
    unhelpfulVotes: 8,
    lastUpdated: '2025-01-10',
    isPopular: true
  },
  {
    id: '2',
    question: 'What subscription plans do you offer?',
    answer: 'We offer three main plans: Starter ($29/month) for individuals, Professional ($79/month) for teams, and Enterprise (custom pricing) for large organizations. Each plan includes different AI credits, features, and support levels. You can upgrade or downgrade at any time.',
    category: 'account-billing',
    tags: ['pricing', 'plans', 'subscription'],
    helpfulVotes: 189,
    unhelpfulVotes: 12,
    lastUpdated: '2025-01-08',
    isPopular: true
  },
  {
    id: '3',
    question: 'How does AI content generation work?',
    answer: 'Our AI uses advanced language models trained on high-quality content. You provide prompts, context, and requirements, and our AI generates relevant content based on your input. The more specific your prompts, the better the output quality.',
    category: 'features',
    tags: ['ai', 'content-generation', 'how-it-works'],
    helpfulVotes: 156,
    unhelpfulVotes: 5,
    lastUpdated: '2025-01-05',
    isPopular: true
  },
  {
    id: '4',
    question: 'Is my data secure and private?',
    answer: 'Yes, we take data security seriously. All data is encrypted in transit and at rest. We never share your content with third parties, and you retain full ownership of all content you create. We are GDPR and CCPA compliant.',
    category: 'privacy-security',
    tags: ['security', 'privacy', 'data-protection'],
    helpfulVotes: 134,
    unhelpfulVotes: 3,
    lastUpdated: '2025-01-03',
    isPopular: false
  },
  {
    id: '5',
    question: 'Can I integrate Omnipreneur AI with other tools?',
    answer: 'Absolutely! We offer integrations with popular tools like Zapier, Slack, WordPress, and more. Our API also allows for custom integrations. Check our integrations page for the full list of supported platforms.',
    category: 'integrations',
    tags: ['integrations', 'api', 'zapier'],
    helpfulVotes: 98,
    unhelpfulVotes: 7,
    lastUpdated: '2025-01-01',
    isPopular: false
  }
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(sampleFAQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, 'helpful' | 'unhelpful'>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const response = await fetch('/api/support/faq', { credentials: 'include' });
      // if (response.ok) {
      //   const data = await response.json();
      //   setFaqs(data.data.faqs);
      // }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (faqId: string, voteType: 'helpful' | 'unhelpful') => {
    if (userVotes[faqId] === voteType) return;

    try {
      const response = await fetch(`/api/support/faq/${faqId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ voteType })
      });

      if (response.ok) {
        setUserVotes(prev => ({ ...prev, [faqId]: voteType }));
        setFaqs(prev => prev.map(faq => 
          faq.id === faqId 
            ? {
                ...faq,
                helpfulVotes: voteType === 'helpful' ? faq.helpfulVotes + 1 : faq.helpfulVotes,
                unhelpfulVotes: voteType === 'unhelpful' ? faq.unhelpfulVotes + 1 : faq.unhelpfulVotes
              }
            : faq
        ));
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    if (selectedCategory && faq.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(query) || 
             faq.answer.toLowerCase().includes(query) ||
             faq.tags.some(tag => tag.toLowerCase().includes(query));
    }
    return true;
  });

  const popularFAQs = faqs.filter(faq => faq.isPopular).slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-purple-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-zinc-400">
              Find quick answers to common questions about Omnipreneur AI
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === '' 
                        ? 'bg-purple-600/20 text-purple-400' 
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    All Categories ({faqs.length})
                  </button>
                  {faqCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-purple-600/20 text-purple-400' 
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <category.icon className="w-4 h-4" />
                        <span>{category.name}</span>
                        <span className="text-xs text-zinc-500">({category.faqCount})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Popular FAQs */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Most Popular
                </h3>
                <div className="space-y-3">
                  {popularFAQs.map((faq, index) => (
                    <button
                      key={faq.id}
                      onClick={() => setExpandedFAQ(faq.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
                    >
                      <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                        {faq.question}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-zinc-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{faq.helpfulVotes}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Need More Help */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Still Need Help?</h3>
                <div className="space-y-3">
                  <Link
                    href="/support/help"
                    className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-center text-sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2 inline" />
                    Browse Help Center
                  </Link>
                  <Link
                    href="/support/tickets/new"
                    className="block w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-center text-sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 inline" />
                    Contact Support
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FAQ List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory 
                    ? faqCategories.find(c => c.id === selectedCategory)?.name + ' FAQs'
                    : searchQuery 
                      ? `Search Results (${filteredFAQs.length})`
                      : 'All FAQs'
                  }
                </h2>
              </div>

              {filteredFAQs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-6 text-left hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {faq.question}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-zinc-500">
                              <span className="flex items-center">
                                <Tag className="w-3 h-3 mr-1" />
                                {faqCategories.find(c => c.id === faq.category)?.name}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {faq.helpfulVotes} helpful
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Updated {new Date(faq.lastUpdated).toLocaleDateString()}
                              </span>
                              {faq.isPopular && (
                                <span className="flex items-center text-yellow-400">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            {expandedFAQ === faq.id ? (
                              <ChevronDown className="w-5 h-5 text-zinc-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-zinc-400" />
                            )}
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-zinc-800">
                              <div className="pt-4">
                                <div className="prose prose-invert max-w-none mb-6">
                                  <p className="text-zinc-300 leading-relaxed">{faq.answer}</p>
                                </div>

                                {/* Tags */}
                                {faq.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {faq.tags.map(tag => (
                                      <span
                                        key={tag}
                                        className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Voting */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <span className="text-sm text-zinc-400">Was this helpful?</span>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleVote(faq.id, 'helpful')}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                                          userVotes[faq.id] === 'helpful'
                                            ? 'bg-green-600/20 text-green-400'
                                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                        }`}
                                      >
                                        <ThumbsUp className="w-4 h-4" />
                                        <span className="text-sm">{faq.helpfulVotes}</span>
                                      </button>
                                      <button
                                        onClick={() => handleVote(faq.id, 'unhelpful')}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                                          userVotes[faq.id] === 'unhelpful'
                                            ? 'bg-red-600/20 text-red-400'
                                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                        }`}
                                      >
                                        <ThumbsDown className="w-4 h-4" />
                                        <span className="text-sm">{faq.unhelpfulVotes}</span>
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <Link
                                    href="/support/tickets/new"
                                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                                  >
                                    Still need help?
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No FAQs found</h3>
                  <p className="text-zinc-400 mb-6">
                    {searchQuery ? 'Try different search terms' : 'No FAQs available in this category'}
                  </p>
                  <Link
                    href="/support/tickets/new"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask a Question
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}