"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Zap,
  CheckCircle,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Hash,
  Image,
  Video,
  FileText,
  Clock,
  Shield,
  Globe,
  Palette,
  Bot,
  ArrowRight,
  Star,
  Award,
  Rocket
} from "lucide-react";

interface SocialStrategy {
  platform: string;
  content: string;
  hashtags: string[];
  bestTime: string;
  engagement: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export default function SocialMediaManager() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");
  const [businessType, setBusinessType] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [strategy, setStrategy] = useState<SocialStrategy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [schedulingResult, setSchedulingResult] = useState('');

  const generateSocialStrategy = async () => {
    if (!businessType || !targetAudience) {
      alert("Please fill in all fields");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/social/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          topic: `${businessType} content for ${targetAudience}`,
          platforms: [selectedPlatform],
          tone: 'professional',
          targetAudience: targetAudience,
          industry: businessType,
          includeHashtagStrategy: true,
          includeTrendAnalysis: true
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate strategy");
      }

      const data = await response.json();
      const optimization = data.data;
      
      // Transform AI response to match UI expectations
      const post = optimization.posts?.[0];
      setStrategy({
        platform: selectedPlatform,
        content: post?.optimizedCaption || post?.caption || `Engaging ${businessType} content for ${targetAudience}`,
        hashtags: post?.suggestedHashtags || optimization.hashtagStrategy?.trending?.slice(0, 5) || ['#business', '#success', '#growth'],
        bestTime: post?.bestPostTime || optimization.optimization?.bestPostingTimes?.[0]?.times?.[0] || '9:00 AM',
        engagement: `${post?.engagementPrediction || optimization.analytics?.avgEngagementPrediction || 85}% predicted`
      });
    } catch (error) {
      console.error("Error generating strategy:", error);
      // Fallback strategy
      setStrategy({
        platform: selectedPlatform,
        content: `Create engaging ${businessType} content that resonates with ${targetAudience}. Focus on value-driven posts that educate and inspire your audience.`,
        hashtags: [`#${businessType.replace(/\s+/g, '')}`, '#marketing', '#success', '#growth', '#business'],
        bestTime: '9:00 AM',
        engagement: '80% predicted'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContent = async () => {
    if (!businessType || !targetAudience) {
      alert("Please fill in business type and target audience first");
      return;
    }

    setIsGeneratingContent(true);
    try {
      const response = await fetch('/api/social/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          platform: selectedPlatform,
          topic: `${businessType} for ${targetAudience}`,
          count: 5
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setGeneratedContent([{ text: '🔒 Social Media Manager subscription required for content generation.', hashtags: [] }]);
        } else {
          setGeneratedContent([{ text: '❌ Error generating content. Please try again.', hashtags: [] }]);
        }
        return;
      }

      if (data.success && data.data) {
        setGeneratedContent(data.data.items || []);
      }
    } catch (error) {
      console.error('Content generation error:', error);
      setGeneratedContent([{ text: '❌ Error generating content. Please try again.', hashtags: [] }]);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const schedulePost = async (content: any, scheduledTime: string) => {
    try {
      const response = await fetch('/api/social/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          content: content.text,
          platforms: [selectedPlatform],
          scheduledTime: scheduledTime,
          hashtags: content.hashtags || []
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setSchedulingResult('🔒 Social Media Manager subscription required for scheduling.');
        } else {
          setSchedulingResult('❌ Error scheduling post. Please try again.');
        }
        return;
      }

      if (data.success) {
        setSchedulingResult(`✅ Post scheduled successfully for ${new Date(scheduledTime).toLocaleString()}`);
      }
    } catch (error) {
      console.error('Scheduling error:', error);
      setSchedulingResult('❌ Error scheduling post. Please try again.');
    }
  };

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "from-blue-400 to-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "from-blue-600 to-blue-800" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-500 to-blue-700" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-red-700" },
  ];

  const features = [
    {
      icon: Bot,
      title: "AI Content Generation",
      description: "Create engaging posts tailored to each platform's best practices",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Post at optimal times when your audience is most active",
    },
    {
      icon: Hash,
      title: "Hashtag Research",
      description: "Discover trending and relevant hashtags for maximum reach",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track performance metrics and engagement across all platforms",
    },
    {
      icon: Users,
      title: "Audience Insights",
      description: "Understand your followers and optimize content strategy",
    },
    {
      icon: Palette,
      title: "Visual Content Tools",
      description: "Create stunning graphics and videos with AI assistance",
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "3 social media accounts",
        "30 AI-generated posts/month",
        "Basic analytics",
        "Hashtag suggestions",
        "Content calendar",
      ],
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      features: [
        "10 social media accounts",
        "Unlimited AI posts",
        "Advanced analytics",
        "Competitor analysis",
        "Team collaboration",
        "Custom branding",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      features: [
        "Unlimited accounts",
        "White-label solution",
        "API access",
        "Custom AI training",
        "Dedicated account manager",
        "Advanced automation",
        "Custom integrations",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl">
                <Share2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              AI Social Media Manager
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
              Automate your social media presence with AI-powered content creation, scheduling, and analytics.
              Grow your audience across all platforms effortlessly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Free Trial
              </motion.button>
              <button className="text-sm font-semibold leading-6 text-white hover:text-pink-300 transition-colors">
                Watch Demo <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Try It Now</h2>
            <p className="text-gray-300">Generate a custom social media strategy in seconds</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Generate Strategy</h3>
              
              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Platform
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedPlatform === platform.id
                          ? "border-pink-500 bg-gradient-to-r " + platform.color
                          : "border-white/20 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <platform.icon className="h-6 w-6 text-white mx-auto" />
                      <span className="text-xs text-white mt-1 block">{platform.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Business Type Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Type
                </label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g., E-commerce, SaaS, Restaurant"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Target Audience Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Young professionals, Parents, Tech enthusiasts"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateSocialStrategy}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <Sparkles className="animate-spin h-5 w-5 mr-2" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Generate Strategy
                  </span>
                )}
              </motion.button>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Your Strategy</h3>
              
              {strategy ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-pink-400 mb-2">Content Suggestion</h4>
                    <p className="text-gray-300">{strategy.content}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-pink-400 mb-2">Recommended Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {strategy.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-pink-400 mb-2">Best Time to Post</h4>
                    <p className="text-gray-300 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {strategy.bestTime}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-pink-400 mb-2">Expected Engagement</h4>
                    <p className="text-gray-300">{strategy.engagement}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Fill in the details and generate your personalized social media strategy
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-300">Everything you need to dominate social media</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-gray-300">Choose the perfect plan for your social media needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-pink-500/20 to-purple-600/20 border-2 border-pink-500"
                    : "bg-white/5 border border-white/10"
                } backdrop-blur-lg`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pink-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-r from-pink-600 to-purple-600 p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Social Media?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using AI to grow their social media presence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:shadow-lg transition-all"
                >
                  Start Free Trial
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-full hover:bg-white/30 transition-all"
                >
                  Schedule Demo
                </motion.button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">10k+ Users</span>
                </div>
                <div className="flex items-center">
                  <Rocket className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-white font-semibold">500M+ Posts</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}