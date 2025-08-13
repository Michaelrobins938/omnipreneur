'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  X,
  ExternalLink,
  Lightbulb,
  Users,
  Zap
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  rating: number;
  views: number;
  helpful: number;
  notHelpful: number;
  videoUrl?: string;
  lastUpdated: string;
}

interface HelpCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  articleCount: number;
}

interface HelpSystemProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery?: string;
}

export default function HelpSystem({ isOpen, onClose, defaultQuery = '' }: HelpSystemProps) {
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [popularArticles, setPopularArticles] = useState<HelpArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: <Lightbulb className="w-5 h-5" />,
      description: 'Learn the basics of using Omnipreneur AI Suite',
      articleCount: 3
    },
    {
      id: 'ai-products',
      name: 'AI Products',
      icon: <Zap className="w-5 h-5" />,
      description: 'Detailed guides for each of our 26 AI products',
      articleCount: 3
    },
    {
      id: 'account-billing',
      name: 'Account & Billing',
      icon: <Users className="w-5 h-5" />,
      description: 'Manage your account, subscription, and payments',
      articleCount: 2
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Solutions to common issues and problems',
      articleCount: 2
    }
  ];

  const mockArticles: HelpArticle[] = [
    // Getting Started Articles
    {
      id: '1',
      title: 'Getting Started with NOVUS Protocol',
      content: 'NOVUS Protocol is our flagship AI optimization tool that enhances prompts for better results across all AI platforms. Here\'s how to get started:\n\n1. Navigate to NOVUS Protocol from your dashboard\n2. Enter your original prompt in the input field\n3. Select your target AI platform (ChatGPT, Claude, etc.)\n4. Choose optimization settings based on your use case\n5. Click "Optimize" to generate enhanced prompts\n\nThe AI will analyze your prompt and suggest improvements for clarity, specificity, and effectiveness.',
      category: 'getting-started',
      tags: ['novus', 'optimization', 'prompts', 'beginner'],
      rating: 4.8,
      views: 1247,
      helpful: 89,
      notHelpful: 3,
      videoUrl: 'https://example.com/video/novus-tutorial',
      lastUpdated: '2024-01-15'
    },
    {
      id: '5',
      title: 'Complete Onboarding Guide',
      content: 'Welcome to Omnipreneur! This comprehensive guide will help you set up your account and get the most out of our AI suite:\n\n**Step 1: Account Setup**\n- Complete your profile information\n- Verify your email address\n- Choose your subscription plan\n\n**Step 2: Dashboard Familiarization**\n- Explore the main dashboard\n- Understand the navigation menu\n- Customize your workspace\n\n**Step 3: First AI Project**\n- Select your first AI tool\n- Create your first project\n- Review and refine results\n\n**Step 4: Advanced Features**\n- Set up integrations\n- Configure automation\n- Join our community\n\nTake your time with each step and don\'t hesitate to reach out if you need help!',
      category: 'getting-started',
      tags: ['onboarding', 'setup', 'account', 'beginner'],
      rating: 4.9,
      views: 2341,
      helpful: 156,
      notHelpful: 4,
      lastUpdated: '2024-01-22'
    },
    {
      id: '6',
      title: 'Understanding the Dashboard Layout',
      content: 'The Omnipreneur dashboard is designed for maximum productivity and ease of use:\n\n**Main Navigation:**\n- Left sidebar: Access all 26 AI products\n- Top bar: Account settings, notifications, help\n- Quick actions: Recently used tools and shortcuts\n\n**Dashboard Sections:**\n- Analytics: Track your usage and performance\n- Recent Projects: Quick access to your work\n- Recommendations: AI-suggested tools for your needs\n- Usage Metrics: Monitor your plan limits\n\n**Customization Options:**\n- Rearrange dashboard widgets\n- Set default tools and preferences\n- Create custom workflows\n- Save favorite configurations\n\n**Pro Tips:**\n- Use keyboard shortcuts for faster navigation\n- Pin frequently used tools to your favorites\n- Set up project templates for recurring work\n- Enable desktop notifications for important updates',
      category: 'getting-started',
      tags: ['dashboard', 'navigation', 'layout', 'customization'],
      rating: 4.7,
      views: 1834,
      helpful: 127,
      notHelpful: 8,
      lastUpdated: '2024-01-20'
    },

    // AI Products Articles
    {
      id: '2',
      title: 'How to Generate Viral Content with Content Spawner',
      content: 'Content Spawner uses advanced AI algorithms to create engaging content for social media, blogs, and marketing campaigns. Follow these steps:\n\n1. Select your content type (social post, blog article, email, etc.)\n2. Choose your target platform and audience\n3. Enter your topic or keywords\n4. Set the tone and style preferences\n5. Generate multiple variations\n6. Customize and refine the output\n\nThe AI considers trending topics, platform algorithms, and engagement patterns to maximize your content\'s viral potential.',
      category: 'ai-products',
      tags: ['content', 'social media', 'viral', 'marketing'],
      rating: 4.9,
      views: 2156,
      helpful: 142,
      notHelpful: 8,
      lastUpdated: '2024-01-18'
    },
    {
      id: '7',
      title: 'Mastering the Auto-Rewrite Engine',
      content: 'The Auto-Rewrite Engine transforms your existing content into fresh, engaging variations while maintaining your original message:\n\n**How It Works:**\n1. Upload or paste your original content\n2. Select rewrite style (professional, casual, persuasive, etc.)\n3. Choose complexity level (simple, moderate, advanced)\n4. Set tone and voice preferences\n5. Generate multiple variations\n\n**Best Practices:**\n- Start with clear, well-structured original content\n- Experiment with different style combinations\n- Review and fact-check all generated content\n- Use A/B testing to find what works best\n\n**Advanced Features:**\n- Bulk rewriting for multiple documents\n- Custom style templates\n- Integration with popular writing tools\n- Version history and comparison\n\n**Use Cases:**\n- Refreshing old blog posts\n- Creating email campaign variations\n- Adapting content for different audiences\n- Avoiding content duplication penalties',
      category: 'ai-products',
      tags: ['rewrite', 'content', 'seo', 'automation'],
      rating: 4.8,
      views: 1923,
      helpful: 134,
      notHelpful: 6,
      lastUpdated: '2024-01-19'
    },
    {
      id: '8',
      title: 'Bundle Builder: Create Profitable Product Packages',
      content: 'Bundle Builder uses AI to analyze market trends and create high-converting product bundles:\n\n**Getting Started:**\n1. Input your individual products or services\n2. Set your target profit margins\n3. Define your ideal customer profile\n4. Let AI analyze optimal combinations\n5. Review and customize suggestions\n\n**AI Analysis Includes:**\n- Market demand research\n- Competitive pricing analysis\n- Customer behavior patterns\n- Seasonal trends and opportunities\n- Cross-sell potential scoring\n\n**Bundle Optimization:**\n- Price testing recommendations\n- Product mix suggestions\n- Marketing angle proposals\n- Sales copy generation\n- Landing page templates\n\n**Success Metrics:**\n- Conversion rate predictions\n- Revenue forecasting\n- Customer lifetime value estimates\n- Profit margin optimization\n\nBundles created with our AI typically see 35% higher conversion rates compared to individual product sales.',
      category: 'ai-products',
      tags: ['bundles', 'products', 'pricing', 'sales'],
      rating: 4.6,
      views: 1456,
      helpful: 98,
      notHelpful: 12,
      lastUpdated: '2024-01-17'
    },

    // Account & Billing Articles
    {
      id: '3',
      title: 'Understanding Your Subscription Plans',
      content: 'Omnipreneur offers three subscription tiers to meet different needs:\n\n**Free Plan:**\n- Access to 5 AI products\n- 50 AI requests per month\n- Basic support\n\n**Pro Plan ($29/month):**\n- Access to all 26 AI products\n- 1,000 AI requests per month\n- Priority support\n- Advanced features\n\n**Enterprise Plan ($99/month):**\n- Unlimited AI requests\n- Custom integrations\n- Dedicated support\n- Team collaboration features\n\nYou can upgrade or downgrade at any time from your account settings.',
      category: 'account-billing',
      tags: ['subscription', 'pricing', 'plans', 'billing'],
      rating: 4.6,
      views: 987,
      helpful: 67,
      notHelpful: 5,
      lastUpdated: '2024-01-10'
    },
    {
      id: '9',
      title: 'Managing Your Payment Methods',
      content: 'Keep your payment information up to date for uninterrupted service:\n\n**Adding Payment Methods:**\n1. Go to Account Settings > Billing\n2. Click "Add Payment Method"\n3. Enter your card or PayPal details\n4. Set as default if desired\n5. Save changes\n\n**Supported Payment Options:**\n- Credit/Debit Cards (Visa, Mastercard, Amex)\n- PayPal\n- Bank transfers (Enterprise only)\n- Cryptocurrency (Bitcoin, Ethereum)\n\n**Automatic Billing:**\n- Payments process on your billing date\n- Failed payments trigger email notifications\n- Grace period of 3 days before service suspension\n- Multiple retry attempts for temporary failures\n\n**Managing Subscriptions:**\n- View upcoming charges\n- Download invoices and receipts\n- Update billing address\n- Change billing cycle (monthly/yearly)\n- Cancel or pause subscriptions\n\n**Security Features:**\n- PCI DSS compliant payment processing\n- Encrypted data transmission\n- Two-factor authentication for billing changes\n- Fraud detection and prevention',
      category: 'account-billing',
      tags: ['payment', 'billing', 'security', 'invoices'],
      rating: 4.5,
      views: 743,
      helpful: 52,
      notHelpful: 3,
      lastUpdated: '2024-01-12'
    },

    // Troubleshooting Articles
    {
      id: '4',
      title: 'Troubleshooting AI Response Errors',
      content: 'If you\'re experiencing issues with AI responses, try these solutions:\n\n**Common Issues:**\n\n1. **Timeout Errors:**\n   - Check your internet connection\n   - Try refreshing the page\n   - Contact support if persistent\n\n2. **Poor Quality Responses:**\n   - Be more specific in your prompts\n   - Use NOVUS Protocol to optimize your input\n   - Try different AI models\n\n3. **Rate Limit Exceeded:**\n   - Check your usage in account settings\n   - Upgrade your plan for higher limits\n   - Wait for your quota to reset\n\n4. **Authentication Issues:**\n   - Clear browser cache and cookies\n   - Log out and log back in\n   - Check if your session has expired',
      category: 'troubleshooting',
      tags: ['errors', 'timeout', 'quality', 'authentication'],
      rating: 4.4,
      views: 1543,
      helpful: 94,
      notHelpful: 12,
      lastUpdated: '2024-01-20'
    },
    {
      id: '10',
      title: 'Fixing Slow Performance Issues',
      content: 'If Omnipreneur is running slowly, try these optimization steps:\n\n**Browser Optimization:**\n1. Clear browser cache and cookies\n2. Disable unnecessary browser extensions\n3. Close unused tabs and windows\n4. Update to the latest browser version\n5. Try incognito/private browsing mode\n\n**Connection Issues:**\n- Test your internet speed (minimum 5 Mbps recommended)\n- Switch to a wired connection if using WiFi\n- Disable VPN temporarily to test\n- Try a different network or hotspot\n\n**Account-Specific Solutions:**\n- Check if you\'re near your plan limits\n- Review active projects for large files\n- Clear your project history if needed\n- Sign out and back in to refresh session\n\n**System Requirements:**\n- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)\n- Minimum 4GB RAM available\n- JavaScript enabled\n- Cookies enabled for omnipreneur.com\n\n**Still Having Issues?**\nContact our support team with your browser details, error messages, and steps to reproduce the problem.',
      category: 'troubleshooting',
      tags: ['performance', 'speed', 'browser', 'optimization'],
      rating: 4.3,
      views: 891,
      helpful: 67,
      notHelpful: 8,
      lastUpdated: '2024-01-21'
    }
  ];

  useEffect(() => {
    setPopularArticles(mockArticles.sort((a, b) => b.views - a.views).slice(0, 3));
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = mockArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleFeedback = (articleId: string, isHelpful: boolean) => {
    // In a real app, this would update the backend
    alert(`Thank you for your feedback! This helps us improve our documentation.`);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-zinc-400'
        }`}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-6xl h-[90vh] max-h-[800px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Help Center</h2>
                <p className="text-sm text-zinc-400">Find answers and learn how to use Omnipreneur</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 border-r border-zinc-800 bg-zinc-950/50 flex flex-col">
              {/* Search */}
              <div className="p-6 border-b border-zinc-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wide">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedArticle(null);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className={selectedCategory === category.id ? 'text-purple-400' : 'text-zinc-500'}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-zinc-500">{category.articleCount} articles</div>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedArticle ? (
                /* Article View */
                <div className="p-6">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center space-x-2 text-zinc-400 hover:text-white mb-4 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 transform rotate-180" />
                    <span>Back to articles</span>
                  </button>

                  <div className="max-w-3xl">
                    <h1 className="text-2xl font-bold text-white mb-4">{selectedArticle.title}</h1>
                    
                    <div className="flex items-center space-x-6 mb-6 text-sm">
                      <div className="flex items-center space-x-1">
                        {renderStars(selectedArticle.rating)}
                        <span className="text-zinc-400 ml-2">{selectedArticle.rating}</span>
                      </div>
                      <span className="text-zinc-400">{selectedArticle.views} views</span>
                      <span className="text-zinc-400">Updated {selectedArticle.lastUpdated}</span>
                    </div>

                    {selectedArticle.videoUrl && (
                      <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                        <div className="flex items-center space-x-3">
                          <Video className="w-5 h-5 text-purple-400" />
                          <div>
                            <h3 className="font-medium text-white">Video Tutorial Available</h3>
                            <p className="text-sm text-zinc-400">Watch a step-by-step guide for this topic</p>
                          </div>
                          <button className="ml-auto px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                            Watch Video
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                      <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                        {selectedArticle.content}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-8 pt-6 border-t border-zinc-800">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedArticle.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Feedback */}
                      <div className="bg-zinc-800/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Was this article helpful?</h4>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleFeedback(selectedArticle.id, true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Yes ({selectedArticle.helpful})</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(selectedArticle.id, false)}
                            className="flex items-center space-x-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>No ({selectedArticle.notHelpful})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Article List */
                <div className="p-6">
                  {searchQuery ? (
                    /* Search Results */
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">
                        Search Results for "{searchQuery}"
                      </h2>
                      {isSearching ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                          <p className="mt-4 text-zinc-400">Searching...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-4">
                          {searchResults.map((article) => (
                            <div
                              key={article.id}
                              onClick={() => setSelectedArticle(article)}
                              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 cursor-pointer transition-colors"
                            >
                              <h3 className="font-semibold text-white mb-2">{article.title}</h3>
                              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                                {article.content.substring(0, 120)}...
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  {renderStars(article.rating)}
                                  <span className="text-zinc-400">{article.views} views</span>
                                </div>
                                <span className="text-purple-400">{article.category}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <HelpCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                          <p className="text-zinc-400">No articles found for your search.</p>
                          <p className="text-zinc-500 text-sm mt-2">Try different keywords or browse categories.</p>
                        </div>
                      )}
                    </div>
                  ) : selectedCategory ? (
                    /* Category Articles */
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">
                        {categories.find(c => c.id === selectedCategory)?.name} Articles
                      </h2>
                      <div className="space-y-4">
                        {mockArticles
                          .filter(article => article.category === selectedCategory)
                          .map((article) => (
                            <div
                              key={article.id}
                              onClick={() => setSelectedArticle(article)}
                              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 cursor-pointer transition-colors"
                            >
                              <h3 className="font-semibold text-white mb-2">{article.title}</h3>
                              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                                {article.content.substring(0, 120)}...
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  {renderStars(article.rating)}
                                  <span className="text-zinc-400">{article.views} views</span>
                                </div>
                                {article.videoUrl && (
                                  <Video className="w-4 h-4 text-purple-400" />
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    /* Home View */
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Welcome to Help Center</h2>
                      <p className="text-zinc-400 mb-8">Find answers, tutorials, and guides for Omnipreneur AI Suite</p>

                      {/* Popular Articles */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Popular Articles</h3>
                        <div className="space-y-4">
                          {popularArticles.map((article) => (
                            <div
                              key={article.id}
                              onClick={() => setSelectedArticle(article)}
                              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 cursor-pointer transition-colors"
                            >
                              <h4 className="font-semibold text-white mb-2">{article.title}</h4>
                              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                                {article.content.substring(0, 120)}...
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  {renderStars(article.rating)}
                                  <span className="text-zinc-400">{article.views} views</span>
                                </div>
                                <span className="text-purple-400">{article.category}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 text-left transition-colors">
                            <MessageCircle className="w-6 h-6 text-blue-400 mb-2" />
                            <h4 className="font-medium text-white">Contact Support</h4>
                            <p className="text-zinc-400 text-sm">Get help from our team</p>
                          </button>
                          <button className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 text-left transition-colors">
                            <ExternalLink className="w-6 h-6 text-purple-400 mb-2" />
                            <h4 className="font-medium text-white">API Documentation</h4>
                            <p className="text-zinc-400 text-sm">Developer resources</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}