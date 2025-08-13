"use client"
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  Zap, 
  Target, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Globe,
  Code,
  Settings,
  TrendingUp,
  Lightbulb,
  Shield,
  Rocket,
  Users
} from 'lucide-react';
import CheckoutButton from '@/app/components/CheckoutButton';
import ProductAccessControl from '@/app/components/ProductAccessControl';

export default function NOVUSProtocol() {
  const [activeTab, setActiveTab] = useState('overview');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "CAL™ Technology",
      description: "Cognitive Architecture Layering for unprecedented prompt optimization"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Optimization",
      description: "Instant prompt analysis and improvement suggestions"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Multi-language Support",
      description: "Optimize prompts in 50+ languages with cultural context"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Track optimization success rates and improvement metrics"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "API Integration",
      description: "Seamless integration with your existing AI workflows"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Custom Templates",
      description: "Create and save optimized prompt templates for reuse"
    }
  ];

  const stats = [
    { label: "Optimization Success Rate", value: "99.2%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Average Improvement", value: "10x", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Languages Supported", value: "50+", icon: <Globe className="w-5 h-5" /> },
    { label: "Active Users", value: "50K+", icon: <Users className="w-5 h-5" /> }
  ];



  return (
    <ProductAccessControl
      productId="novus-protocol"
      productName="NOVUS Protocol"
      requiredPlans={['NOVUS_PROTOCOL', 'PRO', 'ENTERPRISE']}
      demoMode={true}
    >
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
          style={{ y }}
        />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              CAL™ Technology Powered
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              NOVUS Protocol
              <span className="block bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Prompt Optimizer
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Revolutionize your AI interactions with CAL™ technology. Transform ordinary prompts into optimized, high-converting content with unprecedented accuracy and performance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/products/novus-protocol/demo">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Try NOVUS Protocol
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/products/novus-protocol/docs">
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
              Powered by CAL™ Technology
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Cognitive Architecture Layering delivers unprecedented prompt optimization with real-time analysis and continuous improvement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 mr-4">
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
              Experience NOVUS Protocol in Action
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
              Try our advanced AI-powered prompt optimizer with real-time processing visualization and comprehensive analysis.
            </p>
            
            {/* Demo Preview */}
            <motion.div
              className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">27x</div>
                  <div className="text-sm text-zinc-400">More Detailed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.2%</div>
                  <div className="text-sm text-zinc-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">8-Step</div>
                  <div className="text-sm text-zinc-400">AI Processing</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-zinc-300 mb-6">
                  ✨ Neural Network Analysis • 🎯 ML Optimization • 🧠 CAL™ Framework
                </p>
                
                <Link href="/products/novus-protocol/demo">
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
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
                <Brain className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Real-Time AI Processing</h3>
                <p className="text-zinc-400 text-sm">
                  Watch as our neural network analyzes your prompts with sophisticated ML algorithms and transformer models.
                </p>
              </motion.div>
              
              <motion.div
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <BarChart3 className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Comprehensive Analysis</h3>
                <p className="text-zinc-400 text-sm">
                  Get detailed improvement metrics, success predictions, and actionable optimization insights.
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
              Start optimizing your prompts today with our flexible pricing plans.
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
                $29<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  100 optimizations/month
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Basic CAL™ optimization
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Email support
                </li>
              </ul>
              <CheckoutButton
                productName="NOVUS Protocol Starter"
                productId="novus-starter"
                price={{
                  monthly: 29,
                  yearly: 290
                }}
                features={[
                  "100 optimizations/month",
                  "Basic CAL™ optimization",
                  "Email support",
                  "Cancel anytime"
                ]}
                className="w-full"
                variant="secondary"
              />
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-xl p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $79<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Unlimited optimizations
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Advanced CAL™ features
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Custom templates
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Priority support
                </li>
              </ul>
              <CheckoutButton
                productName="NOVUS Protocol Pro"
                productId="novus-pro"
                price={{
                  monthly: 79,
                  yearly: 790
                }}
                features={[
                  "Unlimited optimizations",
                  "Advanced CAL™ features",
                  "Custom templates",
                  "Priority support",
                  "API access"
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
                $199<span className="text-lg text-zinc-400">/month</span>
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
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Optimize Your AI Prompts?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 50,000+ users who have transformed their AI interactions with NOVUS Protocol.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <CheckoutButton
              productName="NOVUS Protocol"
              productId="novus-protocol"
              price={{
                monthly: 49,
                yearly: 490
              }}
              features={[
                "Advanced prompt engineering",
                "Real-time optimization",
                "Multi-language support", 
                "Performance analytics",
                "Custom templates",
                "API integration"
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