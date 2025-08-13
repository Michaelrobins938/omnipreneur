"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  BarChart3,
  Timer,
  Calendar,
  Sparkles,
  CheckCircle,
  FileText,
  Settings,
  Activity,
  Code,
  Palette,
  Search,
  Play,
  Pause,
  Square,
  BookOpen,
  Brain,
  ArrowRight,
  Star,
  Globe,
  Lightbulb,
  Shield,
  Rocket
} from 'lucide-react';
import { apiPost, ensureCsrfCookie } from '@/lib/client/fetch';
import ProductAccessControl from '@/app/components/ProductAccessControl';

export default function TimeTrackingAI() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('development');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);
  const [taskDescription, setTaskDescription] = useState('');
  const [dailyGoal, setDailyGoal] = useState(8);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Checkout function (copied exactly from Nova Protocol CheckoutButton)
  const handleCheckout = async (tierName: string) => {
    try {
      // No authentication required - direct to checkout
      // Ensure we have a CSRF cookie for the API call
      await ensureCsrfCookie();
      
      const resp = await apiPost<{ checkoutUrl: string }>(
        '/api/payments/anonymous-checkout',
        { 
          productId: `time-tracking-ai-${tierName.toLowerCase()}`, 
          billingCycle: 'monthly' 
        }
      );

      console.log('CheckoutButton - Full API response:', resp);
      
      const data = (resp?.data as any) || resp;
      console.log('CheckoutButton - Extracted data:', data);

      if ((resp?.success !== false) && data?.checkoutUrl) {
        // Redirect to Stripe checkout
        console.log('CheckoutButton - Redirecting to:', data.checkoutUrl);
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Checkout failed:', (resp as any)?.error);
        console.error('Full response:', resp);
        alert('Failed to initiate checkout. Please try again. Check console for details.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const categories = [
    { id: 'development', name: 'Development', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'design', name: 'Design', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { id: 'meetings', name: 'Meetings', icon: Users, color: 'from-orange-500 to-red-500' },
    { id: 'research', name: 'Research', icon: Search, color: 'from-indigo-500 to-purple-500' },
    { id: 'admin', name: 'Administration', icon: Settings, color: 'from-gray-500 to-zinc-500' }
  ];

  const features = [
    {
      icon: <Timer className="w-6 h-6" />,
      title: "AI Time Tracking",
      description: "Automatic time tracking with intelligent activity detection and context switching"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "AI-powered scheduling optimization and productivity pattern analysis"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Activity Analysis",
      description: "Deep insights into work patterns, focus time, and productivity trends"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Setting",
      description: "Intelligent goal setting with automatic progress tracking and adjustments"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Data-driven insights with predictive modeling for productivity improvement"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Recommendations",
      description: "Personalized recommendations for optimizing your time and workflow"
    }
  ];

  const stats = [
    { label: "Productivity Increase", value: "35%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Time Saved Daily", value: "2.5h", icon: <Clock className="w-5 h-5" /> },
    { label: "Accuracy Rate", value: "98.9%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Active Teams", value: "15K+", icon: <Users className="w-5 h-5" /> }
  ];

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTracking = () => {
    if (!taskDescription.trim()) {
      alert('Please enter a task description');
      return;
    }
    setIsTracking(true);
  };

  const handlePauseTracking = () => {
    setIsTracking(false);
  };

  const handleStopTracking = async () => {
    setIsTracking(false);
    
    try {
      // Save time entry
      const response = await fetch('/api/time-tracking/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          category: selectedCategory,
          description: taskDescription,
          duration: trackingTime,
          endTime: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert(`Time entry saved: ${formatTime(trackingTime)}`);
        setTrackingTime(0);
        setTaskDescription('');
        
        // Trigger analytics refresh
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        setAnalyticsData('🔒 Please log in to view analytics');
        return;
      }

      const response = await fetch('/api/time-tracking/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          timeframe: 'week',
          category: selectedCategory || 'development',
          includeProductivityScores: true,
          includeFocusAnalysis: true,
          includeRecommendations: true
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setAnalyticsData('🔒 Time Tracking AI subscription required for analytics');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          setAnalyticsData('📊 Monthly analytics limit reached');
        } else {
          setAnalyticsData('❌ Error loading analytics');
        }
        return;
      }

      if (data.success && data.data) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Analytics error:', error);
      setAnalyticsData('❌ Error loading analytics');
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  return (
    <ProductAccessControl
      productId="time-tracking-ai"
      productName="Time Tracking AI"
      requiredPlans={['TIME_TRACKING_AI', 'PRO', 'ENTERPRISE']}
      demoMode={true}
    >
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"
          style={{ y }}
        />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Time Intelligence
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Time Tracking AI
              <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Intelligent Productivity
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Revolutionary AI-powered time tracking that automatically detects activities, analyzes patterns, and optimizes your productivity with personalized insights and predictive analytics.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/products/time-tracking-ai/demo">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Try Time Tracking AI
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/products/time-tracking-ai/docs">
                <motion.button
                  className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Documentation
                </motion.button>
              </Link>
            </motion.div>

            {/* Quick Navigation */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/products/time-tracking-ai/demo">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-3 h-3" />
                  <span>Interactive Demo</span>
                </motion.button>
              </Link>
              
              <Link href="/products/time-tracking-ai/docs">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>View Documentation</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Advanced AI Time Intelligence
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Transform your productivity with cutting-edge artificial intelligence that learns your patterns and optimizes your workflow automatically.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Demo CTA Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Experience AI Time Tracking in Action
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
              Try our intelligent time tracking system with real-time productivity analytics and automated insights.
            </p>
            
            {/* Demo Preview */}
            <motion.div
              className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20 rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">35%</div>
                  <div className="text-sm text-zinc-400">Productivity Boost</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">98.9%</div>
                  <div className="text-sm text-zinc-400">Tracking Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">2.5h</div>
                  <div className="text-sm text-zinc-400">Time Saved Daily</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-zinc-300 mb-6">
                  ⏱️ Automatic Detection • 📊 Real-time Analytics • 🧠 AI Insights
                </p>
                
                <Link href="/products/time-tracking-ai/demo">
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5" />
                    <span>Launch Interactive Demo</span>
                    <Sparkles className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            {/* Features Preview */}
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <motion.div
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Brain className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Intelligent Activity Detection</h3>
                <p className="text-zinc-400 text-sm">
                  Watch as our AI automatically categorizes your activities and learns your work patterns for precise time allocation.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <BarChart3 className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Predictive Analytics</h3>
                <p className="text-zinc-400 text-sm">
                  Get personalized productivity forecasts and optimization recommendations based on your unique work patterns.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Start optimizing your time today with our flexible pricing plans.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $19<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Up to 5 team members
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Basic time tracking
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Standard reports
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('Starter')}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Start Subscription
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/50 rounded-xl p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $49<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Up to 25 team members
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Advanced AI insights
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Custom integrations
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Priority support
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('Pro')}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              >
                Start Subscription
              </button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $99<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Unlimited team members
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Custom AI models
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  API access
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Dedicated support
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Transform Your Productivity?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 15,000+ teams who have revolutionized their time management with AI-powered insights.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <button
              onClick={() => handleCheckout('Pro')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              <span>Start Subscription</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
    </ProductAccessControl>
  );
}