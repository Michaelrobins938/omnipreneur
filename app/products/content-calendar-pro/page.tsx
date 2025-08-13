"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Building,
  Globe,
  Lock,
  Eye,
  BarChart3,
  Search,
  Download,
  Upload,
  FileCheck,
  AlertCircle,
  Star,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Target,
  Lightbulb,
  Mail,
  Phone,
  MessageSquare,
  Shield,
  Database,
  Network,
  Gauge,
  FileText,
  UserCheck,
  Monitor,
  Edit,
  Image,
  Video,
  Link,
  Share2,
  Settings,
  Filter,
  Plus,
  Trash2,
  Save
} from "lucide-react";

export default function ContentCalendarPro() {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [calendarData, setCalendarData] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const socialPlatforms = [
    { id: "instagram", name: "Instagram", description: "Visual content and stories" },
    { id: "facebook", name: "Facebook", description: "Community engagement" },
    { id: "twitter", name: "Twitter", description: "Real-time updates" },
    { id: "linkedin", name: "LinkedIn", description: "Professional content" },
    { id: "tiktok", name: "TikTok", description: "Short-form video" },
    { id: "youtube", name: "YouTube", description: "Long-form video content" }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered content scheduling with optimal posting times"
    },
    {
      icon: Clock,
      title: "Content Planning",
      description: "Advanced content planning and workflow management"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user collaboration with role-based permissions"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Real-time analytics and performance tracking"
    },
    {
      icon: CheckCircle,
      title: "Content Approval",
      description: "Streamlined content approval workflows"
    },
    {
      icon: AlertTriangle,
      title: "Content Optimization",
      description: "CAL™ Technology powered content optimization"
    }
  ];

  const pricingPlans = [
    {
      name: "Content Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "Basic content calendar",
        "5 social platforms",
        "Email support",
        "Up to 3 team members",
        "Basic analytics",
        "Content templates"
      ],
      popular: false
    },
    {
      name: "Content Professional",
      price: "$149",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Advanced content calendar",
        "All social platforms",
        "Priority support",
        "Unlimited team members",
        "Advanced analytics",
        "Content optimization",
        "API access",
        "Custom workflows"
      ],
      popular: true
    },
    {
      name: "Content Enterprise",
      price: "$399",
      period: "/month",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Multi-brand support",
        "White-label solutions",
        "Dedicated content strategist",
        "24/7 phone support",
        "On-premise deployment",
        "Advanced AI features",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  const stats = [
    { number: "500%", label: "Content Efficiency" },
    { number: "50+", label: "Content Templates" },
    { number: "24/7", label: "Auto Publishing" },
    { number: "1000+", label: "Active Users" }
  ];

  const generateContentCalendar = async () => {
    setIsGenerating(true);
    setCalendarData("");

    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        setCalendarData('Please log in to generate a content calendar.');
        setIsGenerating(false);
        return;
      }

      const response = await fetch('/api/content-calendar/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        body: JSON.stringify({
          platforms: [selectedPlatform],
          duration: 'month', // Generate a month's worth of content
          businessType: 'general',
          targetAudience: 'content creators',
          brandTone: 'professional',
          contentPillars: ['education', 'engagement', 'promotion', 'behind-the-scenes'],
          postsPerWeek: 7,
          includeHashtags: true,
          includeOptimalTiming: true
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setCalendarData('🔒 Content Calendar Pro subscription required. Please upgrade to generate content calendars.');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          setCalendarData('📊 Monthly calendar generation limit reached. Please upgrade your plan.');
        } else {
          setCalendarData('❌ Error generating content calendar. Please try again.');
        }
        return;
      }

      if (data.success && data.data) {
        const calendar = data.data;
        const generatedCalendar = {
          platform: selectedPlatform,
          total_posts_planned: calendar.posts?.length || 0,
          content_pillars: calendar.contentPillars || ['education', 'engagement', 'promotion'],
          optimal_posting_times: calendar.optimalTimes || ['9:00 AM', '1:00 PM', '7:00 PM'],
          hashtag_strategy: calendar.hashtagStrategy || ['#contentcreator', '#socialmedia'],
          engagement_prediction: calendar.engagementPrediction || '85%',
          ai_insights: calendar.insights || 'AI-powered content calendar optimized for maximum engagement',
          posts_sample: calendar.posts?.slice(0, 3).map(post => ({
            day: post.scheduledDate || 'Day 1',
            content: post.content || 'Engaging content idea',
            platform: post.platform || selectedPlatform
          })) || []
        };

        setCalendarData(JSON.stringify(generatedCalendar, null, 2));
      } else {
        setCalendarData('❌ Error generating content calendar. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setCalendarData('Error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Content Calendar Pro Platform
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Content Calendar
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {" "}Pro
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              AI-powered content calendar platform for social media management. 
              Powered by CAL™ Technology for intelligent content scheduling and optimization.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-600 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center">
                <Eye className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Advanced Content Management
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our content calendar platform provides intelligent scheduling, 
              team collaboration, and performance analytics for social media success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Interactive Content Calendar
            </h2>
            <p className="text-xl text-gray-300">
              Test our AI-powered content calendar with different social platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Platform Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">
                Select Social Platform
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedPlatform === platform.id
                        ? "border-orange-500 bg-orange-500/20 text-orange-400"
                        : "border-gray-600 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="font-semibold">{platform.name}</div>
                    <div className="text-sm opacity-75">{platform.description}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={generateContentCalendar}
                disabled={isGenerating}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Calendar...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Generate Content Calendar
                  </>
                )}
              </button>
            </motion.div>

            {/* Results Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">
                Content Calendar Results
              </h3>
              
              {calendarData ? (
                <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-orange-400 text-sm whitespace-pre-wrap">
                    {calendarData}
                  </pre>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a social platform and generate calendar to see results</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Content Plan
            </h2>
            <p className="text-xl text-gray-300">
              Flexible pricing plans designed for content creators and businesses of all sizes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-8 ${
                  plan.popular 
                    ? "border-orange-500 bg-gradient-to-b from-orange-500/20 to-red-500/20" 
                    : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                      : "border border-gray-600 text-white hover:bg-gray-800"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600/20 to-red-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Master Content Marketing?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join content creators worldwide who trust our AI-powered calendar platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="px-8 py-4 border border-gray-600 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 