'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  Package, 
  Zap, 
  BarChart3, 
  CreditCard, 
  User,
  Settings,
  LogOut,
  ArrowRight,
  Play,
  CheckCircle,
  Crown,
  Sparkles,
  TrendingUp,
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Link as LinkIcon,
  DollarSign,
  Loader2,
  Target
} from 'lucide-react';
import { productsRegistry } from '@/app/lib/products';
import OnboardingManager from '@/app/components/onboarding/OnboardingManager';
import UsageTracking from '@/app/components/dashboard/UsageTracking';
import ProductRecommendations from '@/app/components/dashboard/ProductRecommendations';
import MemoryOverview from '@/app/components/dashboard/MemoryOverview';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
  };
  stats?: {
    totalRewrites: number;
    totalContent: number;
    totalBundles: number;
    totalAffiliateLinks: number;
    totalPayments: number;
  };
}

interface DashboardAnalytics {
  totalRewrites: number;
  totalContentPieces: number;
  totalBundles: number;
  totalAffiliateLinks: number;
  aiRequests: number;
  aiCreditsRemaining: number | null;
  monthlyUsage: number;
  subscriptionStatus: string;
  plan: string;
}

interface RecentActivity {
  id: string;
  event: string;
  timestamp: string;
  metadata?: any;
}

interface UsageData {
  range: string;
  usage: any;
  activity: RecentActivity[];
}

interface ProductAccess {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  href: string;
  demoHref: string;
  status: 'active' | 'locked';
  gradient: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', { credentials: 'include' });
        if (response.ok) {
          const apiResponse = await response.json();
          const userData = apiResponse?.data || apiResponse?.user || apiResponse;
          setUser(userData);
          if (searchParams.get('welcome') === 'true') {
            setShowWelcome(true);
            setTimeout(() => setShowWelcome(false), 5000);
          }
          

          
          // TEMPORARILY DISABLED - Heavy analytics calls
          // fetchAnalyticsData();
        } else {
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalyticsData = async () => {
      setAnalyticsLoading(true);
      try {
        // Fetch dashboard analytics and usage data in parallel
        const [analyticsRes, usageRes] = await Promise.all([
          fetch('/api/analytics/dashboard', { credentials: 'include' }),
          fetch('/api/analytics/usage?range=30d', { credentials: 'include' })
        ]);

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData.data);
        }

        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsageData(usageData.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchUserData();
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      window.location.href = '/';
    }
  };

  const isProductOwned = (productId: string): boolean => {
    // Prefer explicit entitlements if present
    const ownedIds: string[] = (user as any)?.entitlements || (user as any)?.products || [];
    if (Array.isArray(ownedIds) && ownedIds.length > 0) {
      return ownedIds.includes(productId);
    }
    // Fallback: infer from subscription plan naming if structured that way
    const plan = user?.subscription?.plan || '';
    const normalizedPlan = String(plan).toLowerCase();
    return normalizedPlan === productId || normalizedPlan.includes(productId.replace(/[-_\s]/g, ''));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }



  // Define products with access control
  const iconById: Record<string, React.ReactNode> = {
    'novus-protocol': <Brain className="w-6 h-6" />,
    'bundle-builder': <Package className="w-6 h-6" />,
    'content-spawner': <Zap className="w-6 h-6" />,
    'auto-rewrite': <Sparkles className="w-6 h-6" />,
    'live-dashboard': <BarChart3 className="w-6 h-6" />,
  };

  const gradientById: Record<string, string> = {
    'novus-protocol': 'from-purple-500 to-pink-500',
    'bundle-builder': 'from-blue-500 to-cyan-500',
    'content-spawner': 'from-orange-500 to-red-500',
    'auto-rewrite': 'from-green-500 to-emerald-500',
    'live-dashboard': 'from-blue-500 to-indigo-500',
  };

  const products: ProductAccess[] = productsRegistry.map((p) => ({
    id: p.id,
    name: p.name,
    icon: iconById[p.id] ?? <Sparkles className="w-6 h-6" />,
    description: p.description || 'AI Tool',
    href: `${p.href}?access=true`,
    demoHref: `${p.href}?demo=true`,
    status: isProductOwned(p.id) ? 'active' : 'locked',
    gradient: gradientById[p.id] ?? 'from-slate-600 to-slate-400',
  }));

  const activeProducts = products.filter(p => p.status === 'active');
  const highlightedProduct = searchParams.get('product');

  return (
    <OnboardingManager>
      <div className="min-h-screen bg-zinc-950 text-white dashboard-header">
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                Omnipreneur
              </Link>
              <span className="text-zinc-400">Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.subscription?.plan !== 'FREE' ? (
                  <Crown className="w-4 h-4 text-yellow-500" />
                ) : null}
                <span className="text-sm text-zinc-300">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-green-600 text-white px-4 py-3 text-center"
        >
          <p className="font-semibold">
            {highlightedProduct 
              ? `🎉 Purchase successful! Welcome to ${highlightedProduct.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}!`
              : '🎉 Welcome to Omnipreneur AI! Your account has been created successfully.'
            }
          </p>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Status */}
        <div className="mb-8">
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Your Subscription</h2>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.subscription?.plan === 'FREE' 
                      ? 'bg-zinc-700 text-zinc-300' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  }`}>
                    {user.subscription?.plan || 'FREE'} Plan
                  </span>
                  <span className={`text-sm ${
                    user.subscription?.status === 'ACTIVE' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {user.subscription?.status || 'Active'}
                  </span>
                </div>
              </div>
              <Link
                href="/pricing"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Manage Subscription</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Real-time Analytics Overview */}
        {analytics && !analyticsLoading ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* AI Requests */}
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">AI Requests</h3>
                <p className="text-3xl font-bold text-white mt-2">{analytics.aiRequests}</p>
                <p className="text-sm text-zinc-400 mt-1">Total requests made</p>
              </div>

              {/* Content Created */}
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Content Created</h3>
                <p className="text-3xl font-bold text-white mt-2">{analytics.totalContentPieces + analytics.totalRewrites}</p>
                <p className="text-sm text-zinc-400 mt-1">Pieces generated</p>
              </div>

              {/* Bundles Created */}
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Bundles Built</h3>
                <p className="text-3xl font-bold text-white mt-2">{analytics.totalBundles}</p>
                <p className="text-sm text-zinc-400 mt-1">Product bundles</p>
              </div>

              {/* Affiliate Links */}
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mt-4">Affiliate Links</h3>
                <p className="text-3xl font-bold text-white mt-2">{analytics.totalAffiliateLinks}</p>
                <p className="text-sm text-zinc-400 mt-1">Active links</p>
              </div>
            </div>

            {/* Usage Progress and Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Usage Progress */}
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Monthly Usage</h3>
                  <span className={`text-sm px-2 py-1 rounded ${
                    analytics.monthlyUsage > 80 ? 'bg-red-900 text-red-300' :
                    analytics.monthlyUsage > 60 ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {analytics.monthlyUsage}%
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-zinc-400 mb-2">
                    <span>Current plan: {analytics.plan}</span>
                    {analytics.aiCreditsRemaining !== null && (
                      <span>{analytics.aiCreditsRemaining} credits left</span>
                    )}
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        analytics.monthlyUsage > 80 ? 'bg-red-500' :
                        analytics.monthlyUsage > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(analytics.monthlyUsage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                {analytics.monthlyUsage > 80 && (
                  <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-300">Approaching usage limit</span>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <Calendar className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="space-y-3">
                  {usageData?.activity.slice(0, 5).map((activity, index) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.event}</p>
                        <p className="text-xs text-zinc-400">
                          {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  )) ?? (
                    <p className="text-zinc-400 text-sm">No recent activity</p>
                  )}
                </div>
                {usageData?.activity && usageData.activity.length > 5 && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <Link href="/dashboard/analytics" className="text-blue-400 hover:text-blue-300 text-sm">
                        View all activity →
                      </Link>
                      {(user.subscription?.plan === 'PRO' || user.subscription?.plan === 'ENTERPRISE') && (
                        <Link href="/dashboard/analytics/premium" className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>Premium Analytics</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : analyticsLoading ? (
          <div className="mb-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-zinc-400">Loading analytics...</span>
            </div>
          </div>
        ) : null}

        {/* TEMPORARILY DISABLED - Heavy components causing crashes */}
        {/* 
        <div className="mb-8">
          <MemoryOverview />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <UsageTracking className="lg:col-span-1" />
          <ProductRecommendations className="lg:col-span-1" />
        </div>
        */}

        {/* Products Grid */}
        <div className="mb-8 dashboard-products">
          <div className="flex items-center justify-between mb-6 dashboard-settings">
            <h2 className="text-2xl font-bold text-white">Your AI Tools</h2>
            <span className="text-zinc-400">
              {activeProducts.length} of {products.length} products active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                data-product-id={product.id}
                className={`relative bg-zinc-900/50 rounded-xl p-6 border transition-all duration-300 ${
                  product.status === 'active'
                    ? 'border-zinc-700 hover:border-blue-500/50'
                    : 'border-zinc-800'
                } ${
                  highlightedProduct === product.id ? 'ring-2 ring-blue-500' : ''
                }`}
                whileHover={{ scale: product.status === 'active' ? 1.02 : 1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${product.gradient}`}>
                    {product.icon}
                  </div>
                  {product.status === 'active' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">Locked</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                
                <div className="flex gap-3">
                  <Link
                    href={product.status === 'active' ? product.href : product.demoHref}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                      product.status === 'active'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>{product.status === 'active' ? 'Launch Tool' : 'Try Demo'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {product.status !== 'active' && (
                    <Link
                      href={product.href}
                      className="px-4 py-2 rounded-lg border border-blue-600 text-blue-400 hover:bg-blue-950/30 transition-colors"
                    >
                      Unlock
                    </Link>
                  )}
                </div>

                {product.status !== 'active' && (
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-800/80"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/content-library" className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Content Library</h3>
            </div>
            <p className="text-zinc-400 text-sm">Browse and manage all your generated content</p>
          </Link>

          <Link href="/dashboard/billing" className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Billing</h3>
            </div>
            <p className="text-zinc-400 text-sm">Manage subscriptions and payments</p>
          </Link>

          <Link href="/dashboard/settings" className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Settings</h3>
            </div>
          </Link>

          {/* Removed Project Management quick action as requested */}

          <Link href="/dashboard/memory" className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Memory</h3>
            </div>
            <p className="text-zinc-400 text-sm">View comprehensive memory analytics</p>
          </Link>

          <Link href="/dashboard/team" className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Team</h3>
            </div>
            <p className="text-zinc-400 text-sm">Collaborate with team members</p>
          </Link>
        </div>

        {/* Admin Access (only for admin users) */}
        {user.role === 'ADMIN' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/admin" className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-red-700/50 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Admin Dashboard</h3>
                </div>
                <p className="text-zinc-400 text-sm">Manage affiliate programs and platform operations</p>
              </Link>
            </div>
          </div>
        )}
      </div>
      </div>
    </OnboardingManager>
  );
}