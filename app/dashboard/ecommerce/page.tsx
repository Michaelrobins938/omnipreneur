'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Star,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Zap,
  Brain,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ShoppingBag,
  Percent,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
  Image,
  Tag,
  Globe
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sku: string;
  stock: number;
  image?: string;
  rating: number;
  reviews: number;
  conversionRate: number;
  views: number;
  sales: number;
  revenue: number;
  tags: string[];
  optimizationScore: number;
  lastOptimized?: string;
  createdAt: string;
  updatedAt: string;
}

interface OptimizationRecommendation {
  productId: string;
  productTitle: string;
  type: 'pricing' | 'description' | 'images' | 'inventory' | 'seo' | 'conversion';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentValue: string;
  suggestedValue: string;
  expectedImpact: string;
  confidence: number;
  implementation: 'easy' | 'medium' | 'complex';
  estimatedROI?: number;
}

interface PricingStrategy {
  productId: string;
  currentPrice: number;
  optimalPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  competitorPricing: Array<{
    competitor: string;
    price: number;
    url: string;
  }>;
  demandElasticity: number;
  recommendations: Array<{
    strategy: string;
    description: string;
    expectedImpact: string;
  }>;
}

interface EcommerceAnalytics {
  totalProducts: number;
  averagePrice: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topCategories: Array<{
    category: string;
    revenue: number;
    products: number;
    conversionRate: number;
  }>;
  performanceMetrics: {
    topPerformers: Product[];
    underPerformers: Product[];
    stockAlerts: Product[];
  };
  trends: {
    revenueGrowth: number;
    salesGrowth: number;
    conversionGrowth: number;
    inventoryTurnover: number;
  };
}

export default function EcommerceOptimizerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<EcommerceAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [pricingStrategies, setPricingStrategies] = useState<PricingStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'optimization' | 'pricing' | 'analytics'>('products');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Optimization form
  const [optimizationGoals, setOptimizationGoals] = useState({
    primaryGoal: 'revenue' as 'revenue' | 'conversion' | 'profit',
    targetMetrics: [] as string[],
    timeframe: '30' as '7' | '30' | '90'
  });

  const fetchEcommerceData = async () => {
    try {
      setLoading(true);
      
      // Mock data since we'd normally fetch from /api/ecommerce/*
      const mockProducts: Product[] = [
        {
          id: '1',
          title: 'AI-Powered Analytics Dashboard',
          description: 'Comprehensive business analytics with AI insights and real-time reporting',
          price: 99.99,
          originalPrice: 149.99,
          category: 'Software',
          sku: 'AI-DASH-001',
          stock: 50,
          rating: 4.8,
          reviews: 156,
          conversionRate: 3.2,
          views: 2500,
          sales: 80,
          revenue: 7999.20,
          tags: ['analytics', 'ai', 'dashboard', 'business'],
          optimizationScore: 85,
          lastOptimized: '2024-02-08T10:00:00Z',
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-02-10T12:00:00Z'
        },
        {
          id: '2',
          title: 'Project Management Pro Suite',
          description: 'Advanced project management tools with team collaboration features',
          price: 199.99,
          category: 'Software',
          sku: 'PM-PRO-002',
          stock: 25,
          rating: 4.6,
          reviews: 89,
          conversionRate: 2.8,
          views: 1800,
          sales: 50,
          revenue: 9999.50,
          tags: ['project-management', 'collaboration', 'productivity'],
          optimizationScore: 72,
          createdAt: '2024-01-20T09:00:00Z',
          updatedAt: '2024-02-09T15:00:00Z'
        },
        {
          id: '3',
          title: 'Email Marketing Automation',
          description: 'Automate your email campaigns with AI-driven personalization',
          price: 79.99,
          originalPrice: 99.99,
          category: 'Marketing',
          sku: 'EMAIL-AUTO-003',
          stock: 100,
          rating: 4.4,
          reviews: 234,
          conversionRate: 4.1,
          views: 3200,
          sales: 131,
          revenue: 10479.69,
          tags: ['email', 'marketing', 'automation', 'ai'],
          optimizationScore: 91,
          lastOptimized: '2024-02-05T14:00:00Z',
          createdAt: '2024-01-10T11:00:00Z',
          updatedAt: '2024-02-10T09:00:00Z'
        },
        {
          id: '4',
          title: 'SEO Optimizer Tool',
          description: 'Comprehensive SEO analysis and optimization platform',
          price: 129.99,
          category: 'Marketing',
          sku: 'SEO-OPT-004',
          stock: 5,
          rating: 4.7,
          reviews: 67,
          conversionRate: 2.3,
          views: 1500,
          sales: 34,
          revenue: 4419.66,
          tags: ['seo', 'optimization', 'marketing', 'analytics'],
          optimizationScore: 68,
          createdAt: '2024-01-25T16:00:00Z',
          updatedAt: '2024-02-08T11:00:00Z'
        },
        {
          id: '5',
          title: 'Time Tracking AI Assistant',
          description: 'Smart time tracking with productivity insights and automation',
          price: 59.99,
          category: 'Productivity',
          sku: 'TIME-AI-005',
          stock: 75,
          rating: 4.5,
          reviews: 145,
          conversionRate: 5.2,
          views: 2800,
          sales: 146,
          revenue: 8758.54,
          tags: ['time-tracking', 'productivity', 'ai', 'insights'],
          optimizationScore: 88,
          lastOptimized: '2024-02-07T13:00:00Z',
          createdAt: '2024-01-12T14:00:00Z',
          updatedAt: '2024-02-10T16:00:00Z'
        }
      ];

      const mockAnalytics: EcommerceAnalytics = {
        totalProducts: mockProducts.length,
        averagePrice: mockProducts.reduce((sum, p) => sum + p.price, 0) / mockProducts.length,
        totalRevenue: mockProducts.reduce((sum, p) => sum + p.revenue, 0),
        conversionRate: 3.5,
        averageOrderValue: 112.50,
        topCategories: [
          { category: 'Software', revenue: 17998.70, products: 2, conversionRate: 3.0 },
          { category: 'Marketing', revenue: 14899.35, products: 2, conversionRate: 3.2 },
          { category: 'Productivity', revenue: 8758.54, products: 1, conversionRate: 5.2 }
        ],
        performanceMetrics: {
          topPerformers: mockProducts.filter(p => p.optimizationScore >= 85),
          underPerformers: mockProducts.filter(p => p.optimizationScore < 75),
          stockAlerts: mockProducts.filter(p => p.stock < 10)
        },
        trends: {
          revenueGrowth: 12.5,
          salesGrowth: 8.7,
          conversionGrowth: 2.3,
          inventoryTurnover: 4.2
        }
      };

      const mockRecommendations: OptimizationRecommendation[] = [
        {
          productId: '2',
          productTitle: 'Project Management Pro Suite',
          type: 'pricing',
          priority: 'high',
          title: 'Optimize pricing strategy',
          description: 'Current price may be too high compared to similar products',
          currentValue: '$199.99',
          suggestedValue: '$179.99',
          expectedImpact: '+25% conversions',
          confidence: 87,
          implementation: 'easy',
          estimatedROI: 4200
        },
        {
          productId: '4',
          productTitle: 'SEO Optimizer Tool',
          type: 'inventory',
          priority: 'high',
          title: 'Restock urgently needed',
          description: 'Low stock levels are limiting sales potential',
          currentValue: '5 units',
          suggestedValue: '50 units',
          expectedImpact: '+180% availability',
          confidence: 95,
          implementation: 'medium'
        },
        {
          productId: '1',
          productTitle: 'AI-Powered Analytics Dashboard',
          type: 'description',
          priority: 'medium',
          title: 'Enhance product description',
          description: 'Add more specific benefits and use cases',
          currentValue: 'Generic description',
          suggestedValue: 'Benefit-focused copy',
          expectedImpact: '+15% CTR',
          confidence: 72,
          implementation: 'easy'
        },
        {
          productId: '3',
          productTitle: 'Email Marketing Automation',
          type: 'seo',
          priority: 'low',
          title: 'Optimize for search',
          description: 'Add relevant keywords to title and description',
          currentValue: 'Basic SEO',
          suggestedValue: 'Enhanced keywords',
          expectedImpact: '+8% organic traffic',
          confidence: 65,
          implementation: 'easy'
        }
      ];

      const mockPricingStrategies: PricingStrategy[] = [
        {
          productId: '2',
          currentPrice: 199.99,
          optimalPrice: 179.99,
          priceRange: { min: 159.99, max: 219.99 },
          competitorPricing: [
            { competitor: 'Asana Pro', price: 189.99, url: 'asana.com' },
            { competitor: 'Monday.com', price: 169.99, url: 'monday.com' },
            { competitor: 'Notion Pro', price: 159.99, url: 'notion.so' }
          ],
          demandElasticity: -1.2,
          recommendations: [
            {
              strategy: 'Competitive Pricing',
              description: 'Price slightly below main competitors',
              expectedImpact: '+20% sales volume'
            },
            {
              strategy: 'Value Bundling',
              description: 'Include additional features at current price',
              expectedImpact: '+15% perceived value'
            }
          ]
        }
      ];

      setProducts(mockProducts);
      setAnalytics(mockAnalytics);
      setRecommendations(mockRecommendations);
      setPricingStrategies(mockPricingStrategies);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load e-commerce data');
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    try {
      setActionLoading('optimize');

      const productsToOptimize = selectedProducts.length > 0 
        ? products.filter(p => selectedProducts.includes(p.id))
        : products;

      // In real implementation, would call:
      // const response = await fetch('/api/ecommerce/optimize', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify({
      //     products: productsToOptimize.map(p => ({
      //       id: p.id,
      //       title: p.title,
      //       price: p.price,
      //       category: p.category,
      //       description: p.description,
      //       conversionRate: p.conversionRate
      //     })),
      //     goals: optimizationGoals
      //   })
      // });

      // Mock optimization process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate new recommendations
      const newRecommendations: OptimizationRecommendation[] = productsToOptimize.map(product => ({
        productId: product.id,
        productTitle: product.title,
        type: ['pricing', 'description', 'images', 'inventory'][Math.floor(Math.random() * 4)] as any,
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
        title: 'AI-Generated Optimization',
        description: 'New optimization opportunity identified',
        currentValue: 'Current state',
        suggestedValue: 'Optimized state',
        expectedImpact: `+${Math.floor(Math.random() * 30 + 10)}% improvement`,
        confidence: Math.floor(Math.random() * 30 + 70),
        implementation: ['easy', 'medium'][Math.floor(Math.random() * 2)] as any
      }));

      setRecommendations(prev => [...newRecommendations, ...prev]);
      setSelectedProducts([]);
      setShowOptimizeModal(false);
      setError(null);
    } catch (err) {
      setError('Failed to run optimization');
    } finally {
      setActionLoading(null);
    }
  };

  const applyRecommendation = async (recommendationId: string) => {
    try {
      setActionLoading(recommendationId);
      
      // Mock applying recommendation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecommendations(prev => prev.filter(r => r.productId !== recommendationId));
    } catch (err) {
      setError('Failed to apply recommendation');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchEcommerceData();
  }, []);

  const getOptimizationScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 55) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900/20 text-red-400 border-red-800';
      case 'medium': return 'bg-yellow-900/20 text-yellow-400 border-yellow-800';
      case 'low': return 'bg-green-900/20 text-green-400 border-green-800';
      default: return 'bg-zinc-900/20 text-zinc-400 border-zinc-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pricing': return <DollarSign className="w-4 h-4" />;
      case 'description': return <Edit className="w-4 h-4" />;
      case 'images': return <Image className="w-4 h-4" />;
      case 'inventory': return <Package className="w-4 h-4" />;
      case 'seo': return <Search className="w-4 h-4" />;
      case 'conversion': return <Target className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = search === '' || 
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'revenue': return b.revenue - a.revenue;
      case 'conversion': return b.conversionRate - a.conversionRate;
      case 'optimization': return b.optimizationScore - a.optimizationScore;
      case 'stock': return b.stock - a.stock;
      default: return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading e-commerce data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3 text-blue-500" />
                E-commerce Optimizer
              </h1>
              <p className="text-zinc-400 mt-2">Optimize products, pricing, and performance with AI insights</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>AI Insights</span>
              </button>
              <button 
                onClick={() => setShowOptimizeModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Optimize</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-zinc-800">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'products', label: 'Products', icon: Package },
                { id: 'optimization', label: 'Optimization', icon: Zap },
                { id: 'pricing', label: 'Pricing', icon: DollarSign },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className={`w-5 h-5 ${analytics.trends.revenueGrowth > 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Total Revenue</h3>
              <p className="text-3xl font-bold text-white mt-2">${analytics.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2 text-sm">
                <span className={analytics.trends.revenueGrowth > 0 ? 'text-green-400' : 'text-red-400'}>
                  {analytics.trends.revenueGrowth > 0 ? '+' : ''}{analytics.trends.revenueGrowth}%
                </span>
                <span className="text-zinc-400">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <Target className={`w-5 h-5 ${analytics.trends.conversionGrowth > 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Conversion Rate</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.conversionRate}%</p>
              <div className="flex items-center space-x-1 mt-2 text-sm">
                <span className={analytics.trends.conversionGrowth > 0 ? 'text-green-400' : 'text-red-400'}>
                  {analytics.trends.conversionGrowth > 0 ? '+' : ''}{analytics.trends.conversionGrowth}%
                </span>
                <span className="text-zinc-400">improvement</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Avg Order Value</h3>
              <p className="text-3xl font-bold text-white mt-2">${analytics.averageOrderValue}</p>
              <p className="text-sm text-zinc-400 mt-1">Per transaction</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <RefreshCw className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Products</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.totalProducts}</p>
              <p className="text-sm text-zinc-400 mt-1">{analytics.performanceMetrics.stockAlerts.length} low stock</p>
            </motion.div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {/* Filters */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Software">Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Productivity">Productivity</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="revenue">Sort by Revenue</option>
                    <option value="conversion">Sort by Conversion</option>
                    <option value="optimization">Sort by Optimization Score</option>
                    <option value="stock">Sort by Stock</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                  <span>Showing {filteredProducts.length} of {products.length} products</span>
                  <button className="text-blue-400 hover:text-blue-300">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
                >
                  {/* Product Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-zinc-600" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{product.title}</h3>
                        <p className="text-sm text-zinc-400 line-clamp-2">{product.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(prev => [...prev, product.id]);
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== product.id));
                          }
                        }}
                        className="ml-3 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-white">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-zinc-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-zinc-300">{product.rating}</span>
                        <span className="text-xs text-zinc-500">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Revenue:</span>
                        <span className="text-green-400 font-medium">${product.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Conversion:</span>
                        <span className="text-blue-400 font-medium">{product.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Stock:</span>
                        <span className={`font-medium ${product.stock < 10 ? 'text-red-400' : 'text-white'}`}>
                          {product.stock} units
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">Optimization Score</span>
                        <span className={`font-medium ${getOptimizationScoreColor(product.optimizationScore)}`}>
                          {product.optimizationScore}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            product.optimizationScore >= 85 ? 'bg-green-500' :
                            product.optimizationScore >= 70 ? 'bg-yellow-500' :
                            product.optimizationScore >= 55 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${product.optimizationScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded">{product.category}</span>
                      <span className="text-xs text-zinc-500">SKU: {product.sku}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                      <button className="flex-1 px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors text-sm">
                        <Edit className="w-4 h-4 mx-auto" />
                      </button>
                      <button className="flex-1 px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-green-500 hover:text-green-400 transition-colors text-sm">
                        <Zap className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Optimization Recommendations</h2>
              <button 
                onClick={() => setShowOptimizeModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Generate New</span>
              </button>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        {getTypeIcon(rec.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-white">{rec.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} priority
                          </span>
                          <span className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded capitalize">
                            {rec.type}
                          </span>
                        </div>
                        
                        <p className="text-sm text-zinc-400 mb-3">{rec.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-zinc-500">Current:</span>
                            <div className="text-white font-medium">{rec.currentValue}</div>
                          </div>
                          <div>
                            <span className="text-zinc-500">Suggested:</span>
                            <div className="text-green-400 font-medium">{rec.suggestedValue}</div>
                          </div>
                          <div>
                            <span className="text-zinc-500">Expected Impact:</span>
                            <div className="text-blue-400 font-medium">{rec.expectedImpact}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs">
                          <span className="text-zinc-500">
                            Confidence: <span className="text-white">{rec.confidence}%</span>
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            rec.implementation === 'easy' ? 'bg-green-900/20 text-green-400' :
                            rec.implementation === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                            'bg-red-900/20 text-red-400'
                          }`}>
                            {rec.implementation} to implement
                          </span>
                          {rec.estimatedROI && (
                            <span className="text-green-400">
                              Est. ROI: ${rec.estimatedROI.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => applyRecommendation(rec.productId)}
                        disabled={actionLoading === rec.productId}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center space-x-1"
                      >
                        {actionLoading === rec.productId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>Apply</span>
                      </button>
                      <button className="px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-red-500 hover:text-red-400 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white">Pricing Optimization</h2>
            
            {pricingStrategies.map((strategy, index) => {
              const product = products.find(p => p.id === strategy.productId);
              return (
                <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">{product?.title}</h3>
                    <span className="text-sm text-zinc-400">SKU: {product?.sku}</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Current vs Optimal Pricing */}
                    <div>
                      <h4 className="font-medium text-white mb-4">Price Analysis</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                          <div>
                            <div className="text-sm text-zinc-400">Current Price</div>
                            <div className="text-xl font-bold text-white">${strategy.currentPrice}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-zinc-400">Optimal Price</div>
                            <div className="text-xl font-bold text-green-400">${strategy.optimalPrice}</div>
                          </div>
                        </div>

                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                          <div className="text-sm text-zinc-400 mb-2">Recommended Price Range</div>
                          <div className="flex items-center justify-between">
                            <span className="text-red-400">${strategy.priceRange.min}</span>
                            <div className="flex-1 mx-4 h-2 bg-zinc-700 rounded-full relative">
                              <div 
                                className="absolute h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                                style={{ width: '100%' }}
                              ></div>
                              <div 
                                className="absolute w-3 h-3 bg-blue-500 rounded-full -mt-0.5 border-2 border-white"
                                style={{ 
                                  left: `${((strategy.optimalPrice - strategy.priceRange.min) / (strategy.priceRange.max - strategy.priceRange.min)) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-green-400">${strategy.priceRange.max}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                          <div className="text-sm text-zinc-400 mb-2">Demand Elasticity</div>
                          <div className="text-white font-medium">{strategy.demandElasticity}</div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {strategy.demandElasticity < -1 ? 'Elastic (price sensitive)' : 'Inelastic (price insensitive)'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Analysis */}
                    <div>
                      <h4 className="font-medium text-white mb-4">Competitor Pricing</h4>
                      <div className="space-y-3 mb-6">
                        {strategy.competitorPricing.map((comp, compIndex) => (
                          <div key={compIndex} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Globe className="w-4 h-4 text-zinc-400" />
                              <div>
                                <div className="text-white font-medium">{comp.competitor}</div>
                                <div className="text-xs text-zinc-500">{comp.url}</div>
                              </div>
                            </div>
                            <div className={`font-bold ${
                              comp.price < strategy.currentPrice ? 'text-red-400' :
                              comp.price > strategy.currentPrice ? 'text-green-400' :
                              'text-white'
                            }`}>
                              ${comp.price}
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="font-medium text-white mb-4">Strategy Recommendations</h4>
                      <div className="space-y-3">
                        {strategy.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="font-medium text-white mb-1">{rec.strategy}</div>
                            <div className="text-sm text-zinc-400 mb-2">{rec.description}</div>
                            <div className="text-sm text-green-400">{rec.expectedImpact}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-zinc-800">
                    <button className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors">
                      Simulate Impact
                    </button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      Apply Optimal Price
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top Performers */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-400" />
                  Top Performers
                </h3>
                <div className="space-y-3">
                  {analytics.performanceMetrics.topPerformers.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{product.title}</div>
                          <div className="text-xs text-zinc-400">{product.conversionRate}% conversion</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">${product.revenue.toLocaleString()}</div>
                        <div className="text-xs text-zinc-500">{product.sales} sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Underperformers */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-orange-400" />
                  Needs Attention
                </h3>
                <div className="space-y-3">
                  {analytics.performanceMetrics.underPerformers.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <div>
                          <div className="text-white font-medium text-sm">{product.title}</div>
                          <div className="text-xs text-orange-400">Score: {product.optimizationScore}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${product.revenue.toLocaleString()}</div>
                        <div className="text-xs text-zinc-500">{product.conversionRate}% conv</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Alerts */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-red-400" />
                  Stock Alerts
                </h3>
                <div className="space-y-3">
                  {analytics.performanceMetrics.stockAlerts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-900/10 border border-red-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                          <div className="text-white font-medium text-sm">{product.title}</div>
                          <div className="text-xs text-red-400">Low stock warning</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-400 font-medium">{product.stock} units</div>
                        <div className="text-xs text-zinc-500">Restock needed</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Category Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.topCategories.map((category, index) => (
                  <div key={category.category} className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-white">{category.category}</h4>
                      <Tag className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-400 text-sm">Revenue</span>
                        <span className="text-green-400 font-medium">${category.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 text-sm">Products</span>
                        <span className="text-white">{category.products}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 text-sm">Conversion</span>
                        <span className="text-blue-400">{category.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Optimize Modal */}
        {showOptimizeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-white">E-commerce Optimization</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Primary Goal</label>
                  <select
                    value={optimizationGoals.primaryGoal}
                    onChange={(e) => setOptimizationGoals({ 
                      ...optimizationGoals, 
                      primaryGoal: e.target.value as any 
                    })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="revenue">Maximize Revenue</option>
                    <option value="conversion">Improve Conversion Rate</option>
                    <option value="profit">Increase Profit Margin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Time Frame</label>
                  <select
                    value={optimizationGoals.timeframe}
                    onChange={(e) => setOptimizationGoals({ 
                      ...optimizationGoals, 
                      timeframe: e.target.value as any 
                    })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Products to Optimize ({selectedProducts.length > 0 ? selectedProducts.length : 'All'})
                  </label>
                  <div className="text-sm text-zinc-400">
                    {selectedProducts.length > 0 
                      ? `${selectedProducts.length} selected products`
                      : 'All products will be analyzed'
                    }
                  </div>
                </div>

                <div className="bg-blue-900/10 border border-blue-800/50 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-sm">
                      <div className="text-blue-400 font-medium mb-1">AI-Powered Analysis</div>
                      <div className="text-zinc-300">
                        Our AI will analyze product performance, competitor pricing, and market trends to generate actionable optimization recommendations.
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowOptimizeModal(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={runOptimization}
                    disabled={actionLoading === 'optimize'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {actionLoading === 'optimize' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>Run Optimization</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}