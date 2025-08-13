"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Minus, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  BarChart3,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Brain,
  Zap,
  Target,
  ShoppingCart,
  Tag,
  Gift,
  Rocket,
  Star,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Clock,
  Users
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface BundleItem extends Product {
  selected: boolean;
}

export default function BundleBuilderDemo() {
  const [products, setProducts] = useState<BundleItem[]>([
    {
      id: '1',
      name: 'Premium Video Course',
      description: 'Complete 10-hour masterclass on digital marketing',
      price: 297,
      category: 'Education',
      image: '/api/placeholder/100/100',
      selected: false
    },
    {
      id: '2',
      name: 'Template Bundle',
      description: '50+ professional marketing templates',
      price: 97,
      category: 'Templates',
      image: '/api/placeholder/100/100',
      selected: false
    },
    {
      id: '3',
      name: 'AI Writing Tool',
      description: '1-year license for AI content creation',
      price: 197,
      category: 'Software',
      image: '/api/placeholder/100/100',
      selected: false
    },
    {
      id: '4',
      name: 'Social Media Toolkit',
      description: 'Complete social media management suite',
      price: 147,
      category: 'Tools',
      image: '/api/placeholder/100/100',
      selected: false
    },
    {
      id: '5',
      name: 'SEO Optimization Guide',
      description: 'Advanced SEO strategies and checklists',
      price: 77,
      category: 'Guides',
      image: '/api/placeholder/100/100',
      selected: false
    },
    {
      id: '6',
      name: 'Email Marketing System',
      description: 'Automated email sequences and templates',
      price: 127,
      category: 'Marketing',
      image: '/api/placeholder/100/100',
      selected: false
    }
  ]);

  const [bundleName, setBundleName] = useState('Digital Marketing Mastery Bundle');
  const [discountPercentage, setDiscountPercentage] = useState(30);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [bundleInsights, setBundleInsights] = useState<any[]>([]);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  const processingStepsData = [
    { text: '🚀 Initializing Bundle Optimization Engine...', duration: 800 },
    { text: '📊 Analyzing product compatibility matrix...', duration: 1200 },
    { text: '🧠 Running AI pricing optimization...', duration: 1000 },
    { text: '💡 Calculating cross-sell potential...', duration: 900 },
    { text: '🎯 Determining optimal bundle structure...', duration: 700 },
    { text: '📈 Generating conversion predictions...', duration: 800 },
    { text: '✨ Creating marketing recommendations...', duration: 600 },
    { text: '🏆 Finalizing bundle optimization...', duration: 500 }
  ];

  const toggleProduct = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, selected: !product.selected }
        : product
    ));
    setOptimizationComplete(false);
  };

  const selectedProducts = products.filter(p => p.selected);
  const totalValue = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const bundlePrice = Math.round(totalValue * (1 - discountPercentage / 100));
  const savings = totalValue - bundlePrice;

  const runBundleOptimization = async () => {
    setShowAnalysis(true);
    setProcessingSteps([]);
    setCurrentStep(0);
    setOptimizationComplete(false);

    // Simulate AI processing
    for (let i = 0; i < processingStepsData.length; i++) {
      setCurrentStep(i);
      setProcessingSteps(prev => [...prev, processingStepsData[i].text]);
      await new Promise(resolve => setTimeout(resolve, processingStepsData[i].duration));
    }

    // Generate insights
    const insights = [
      {
        type: 'pricing',
        title: 'Optimal Pricing Strategy',
        description: `${discountPercentage}% discount maximizes perceived value while maintaining margins`,
        metric: '+45% conversion rate',
        icon: DollarSign,
        color: 'green'
      },
      {
        type: 'psychology',
        title: 'Psychological Pricing',
        description: `$${bundlePrice} creates a strong value perception vs $${totalValue} individual pricing`,
        metric: `$${savings} savings`,
        icon: Brain,
        color: 'purple'
      },
      {
        type: 'crosssell',
        title: 'Cross-sell Synergy',
        description: 'Selected products have 87% compatibility score for upselling',
        metric: '87% synergy',
        icon: Target,
        color: 'blue'
      },
      {
        type: 'market',
        title: 'Market Positioning',
        description: 'Bundle positioned perfectly for intermediate digital marketers',
        metric: '92% fit score',
        icon: TrendingUp,
        color: 'orange'
      }
    ];

    setBundleInsights(insights);
    setOptimizationComplete(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/products/bundle-builder" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bundle Builder</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bundle Builder Demo
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Product Packaging - Create irresistible product bundles with AI-powered optimization and pricing analysis
          </p>
          
          {/* Live Demo Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>Live Working Demo</span>
          </div>
        </motion.div>

        {/* Working Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Package className="w-6 h-6 mr-3 text-blue-400" />
              Select Products
            </h2>

            {/* Bundle Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Bundle Name
              </label>
              <input
                type="text"
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bundle name..."
              />
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-1 gap-4 mb-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    product.selected 
                      ? 'bg-blue-500/10 border-blue-500/50' 
                      : 'bg-zinc-800/40 border-zinc-700 hover:border-zinc-600'
                  }`}
                  onClick={() => toggleProduct(product.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-zinc-500" />
                      </div>
                      <AnimatePresence>
                        {product.selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                      <p className="text-sm text-zinc-400 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">${product.price}</span>
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Discount Slider */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Bundle Discount: {discountPercentage}%
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={discountPercentage}
                onChange={(e) => {
                  setDiscountPercentage(Number(e.target.value));
                  setOptimizationComplete(false);
                }}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(discountPercentage - 10) * 2.5}%, #27272a ${(discountPercentage - 10) * 2.5}%, #27272a 100%)`
                }}
              />
            </div>

            {/* Optimize Button */}
            <div className="text-center">
              <motion.button
                onClick={runBundleOptimization}
                disabled={selectedProducts.length < 2}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5" />
                <span>Optimize Bundle with AI</span>
              </motion.button>
              {selectedProducts.length < 2 && (
                <p className="text-sm text-zinc-500 mt-2">Select at least 2 products to create a bundle</p>
              )}
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-green-400" />
              Bundle Summary
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Selected Products</span>
                <span className="text-white font-semibold">{selectedProducts.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Total Value</span>
                <span className="text-white font-semibold">${totalValue}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Discount</span>
                <span className="text-red-400 font-semibold">-{discountPercentage}%</span>
              </div>
              
              <div className="border-t border-zinc-700 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-white">Bundle Price</span>
                  <span className="text-2xl font-bold text-green-400">${bundlePrice}</span>
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                    <Tag className="w-4 h-4 mr-1" />
                    Save ${savings}
                  </span>
                </div>
              </div>

              {/* AI Insights */}
              {optimizationComplete && bundleInsights.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                    AI Optimization Results
                  </h3>
                  <div className="space-y-3">
                    {bundleInsights.map((insight, index) => {
                      const Icon = insight.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 bg-gradient-to-br ${
                              insight.color === 'green' ? 'from-green-500/20 to-emerald-500/20' :
                              insight.color === 'purple' ? 'from-purple-500/20 to-pink-500/20' :
                              insight.color === 'blue' ? 'from-blue-500/20 to-cyan-500/20' :
                              'from-orange-500/20 to-red-500/20'
                            } rounded-lg`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1 text-sm">{insight.title}</h4>
                              <p className="text-xs text-zinc-400 mb-2">{insight.description}</p>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                insight.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                insight.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                insight.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                {insight.metric}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to create profitable bundles?</h2>
          <p className="text-zinc-400 mb-8">Get unlimited access to Bundle Builder and 25+ other AI tools</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                View Pricing
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}