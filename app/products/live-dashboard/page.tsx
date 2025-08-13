"use client"
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Globe,
  Code,
  Settings,
  Eye,
  Zap,
  Shield,
  Rocket,
  PieChart,
  LineChart,
  Target,
  AlertTriangle
} from 'lucide-react';

import ProductAccessControl from '@/app/components/ProductAccessControl';
import CheckoutButton from '@/app/components/CheckoutButton';
import { apiPost, ensureCsrfCookie } from '@/lib/client/fetch';
import Link from 'next/link';
export default function LiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    revenue: 124750,
    users: 15420,
    conversions: 8.2,
    growth: 23.5
  });
  const [isLoading, setIsLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Live data visualization with instant updates and performance tracking"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Predictive Modeling",
      description: "AI-powered forecasting and trend analysis for strategic decisions"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Custom Dashboards",
      description: "Build personalized dashboards with drag-and-drop interface"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Behavior Analysis",
      description: "Deep insights into user patterns and engagement metrics"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Revenue Tracking",
      description: "Comprehensive financial analytics and profit optimization"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Automated Reporting",
      description: "Scheduled reports and automated insights delivery"
    }
  ];

  const stats = [
    { label: "Real-time Updates", value: "< 100ms", icon: <Zap className="w-5 h-5" /> },
    { label: "Data Accuracy", value: "99.9%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Active Users", value: "200K+", icon: <Users className="w-5 h-5" /> },
    { label: "Uptime", value: "99.9%", icon: <Shield className="w-5 h-5" /> }
  ];

  const chartData = [
    { name: 'Jan', revenue: 45000, users: 1200, conversions: 6.2 },
    { name: 'Feb', revenue: 52000, users: 1350, conversions: 7.1 },
    { name: 'Mar', revenue: 61000, users: 1480, conversions: 7.8 },
    { name: 'Apr', revenue: 58000, users: 1420, conversions: 7.5 },
    { name: 'May', revenue: 72000, users: 1680, conversions: 8.1 },
    { name: 'Jun', revenue: 85000, users: 1920, conversions: 8.9 },
    { name: 'Jul', revenue: 124750, users: 15420, conversions: 8.2 }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        // Use demo data if not authenticated
        setMetrics({
          revenue: Math.floor(Math.random() * 50000) + 100000,
          users: Math.floor(Math.random() * 5000) + 15000,
          conversions: parseFloat((Math.random() * 3 + 7).toFixed(1)),
          growth: parseFloat((Math.random() * 20 + 15).toFixed(1))
        });
        return;
      }

      const response = await fetch('/api/analytics/dashboard', {
        method: 'GET',
        headers: {
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          // Show subscription required message but still display demo data
          console.log('Live Dashboard subscription required for real-time data');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          console.log('Dashboard analytics limit reached');
        }
        throw new Error('Failed to fetch analytics');
      }
      
      // Update metrics with real data from API
      if (data.success && data.data) {
        setMetrics({
          revenue: data.data?.overview?.totalRevenue || Math.floor(Math.random() * 50000) + 100000,
          users: data.data?.usage?.totalUsers || Math.floor(Math.random() * 5000) + 15000,
          conversions: parseFloat((data.data?.performance?.conversionRate || Math.random() * 3 + 7).toFixed(1)),
          growth: parseFloat((data.data?.performance?.growthRate || Math.random() * 20 + 15).toFixed(1))
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to demo data if API fails
      setMetrics({
        revenue: Math.floor(Math.random() * 50000) + 100000,
        users: Math.floor(Math.random() * 5000) + 15000,
        conversions: parseFloat((Math.random() * 3 + 7).toFixed(1)),
        growth: parseFloat((Math.random() * 20 + 15).toFixed(1))
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductAccessControl productId="live-dashboard" productName="Live Dashboard" requiredPlans={["LIVE_DASHBOARD","PRO","ENTERPRISE"]} demoMode={true}>
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
              <Activity className="w-4 h-4 mr-2" />
              Real-time Analytics
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Live Dashboard
              <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Analytics & Tracking
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform your data into actionable insights with real-time analytics, predictive modeling, and comprehensive monitoring that drives business growth.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/products/live-dashboard/demo">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Try Live Dashboard
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/products/live-dashboard/docs">
                <motion.button
                  className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Documentation
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
              Comprehensive Analytics Suite
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              From real-time monitoring to predictive insights, our dashboard provides everything you need to make data-driven decisions.
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

      {/* Interactive Dashboard Demo */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Live Dashboard Demo
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Experience real-time analytics with our interactive dashboard demonstration.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">Analytics Dashboard</h3>
                  <p className="text-zinc-400">Real-time business metrics</p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 mr-2" />
                      Refresh Data
                    </>
                  )}
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 text-sm">Revenue</span>
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">${metrics.revenue.toLocaleString()}</div>
                  <div className="text-green-400 text-sm">+{metrics.growth}% from last month</div>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 text-sm">Active Users</span>
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{metrics.users.toLocaleString()}</div>
                  <div className="text-blue-400 text-sm">+12% from last week</div>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 text-sm">Conversion Rate</span>
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{metrics.conversions}%</div>
                  <div className="text-purple-400 text-sm">+0.8% from last month</div>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 text-sm">Growth Rate</span>
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{metrics.growth}%</div>
                  <div className="text-orange-400 text-sm">+5.2% from last quarter</div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Revenue Trend</h4>
                  <div className="h-64 bg-zinc-900/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-zinc-400">Interactive Revenue Chart</p>
                      <p className="text-sm text-zinc-500">Real-time data visualization</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">User Distribution</h4>
                  <div className="h-64 bg-zinc-900/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-zinc-400">User Analytics Chart</p>
                      <p className="text-sm text-zinc-500">Demographic breakdown</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts Section */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Alerts</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">High traffic detected</p>
                      <p className="text-zinc-400 text-sm">Server load increased by 40% in the last hour</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">Conversion rate improved</p>
                      <p className="text-zinc-400 text-sm">Checkout completion rate increased by 15%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
              Choose Your Analytics Plan
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Scale your analytics with our flexible pricing plans designed for businesses of all sizes.
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
                $49<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Basic analytics dashboard
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Real-time data updates
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Email support
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300">
                Get Started
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
                $149<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Advanced analytics features
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Predictive modeling
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Custom dashboards
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Priority support
                </li>
              </ul>
              <CheckoutButton
                productName="Live Dashboard Pro"
                productId="live-dashboard-pro"
                price={{
                  monthly: 149,
                  yearly: 1490
                }}
                features={[
                  "Advanced analytics features",
                  "Predictive modeling",
                  "Custom dashboards",
                  "Priority support",
                  "API integrations",
                  "Advanced reporting"
                ]}
                className="w-full"
                variant="primary"
              />
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
                $399<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  API access
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  White-label options
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
            Ready to Transform Your Analytics?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 200,000+ users who have revolutionized their business with real-time analytics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <CheckoutButton
              productName="Live Dashboard"
              productId="live-dashboard"
              price={{
                monthly: 149,
                yearly: 1490
              }}
              features={[
                "Real-time analytics",
                "Predictive modeling",
                "Custom dashboards",
                "Advanced reporting",
                "API integrations",
                "Priority support"
              ]}
              variant="secondary"
            />
          </motion.div>
        </div>
      </section>
    </div>
    </ProductAccessControl>
  );
} 