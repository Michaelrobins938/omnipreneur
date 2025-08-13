'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Download, 
  AlertTriangle,
  Loader2,
  Crown,
  Settings,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Shield,
  ArrowRight,
  Clock,
  Zap,
  Star,
  Gift,
  Calculator,
  BarChart3
} from 'lucide-react';

interface SubscriptionData {
  user: {
    id: string;
    email: string;
    name: string;
  };
  subscription?: {
    id: string;
    plan: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    billingCycle: string;
    trialEndsAt?: string;
    lastPayment?: number;
    nextPayment?: number;
  };
  usage: {
    aiCreditsUsed: number;
    aiCreditsLimit: number;
    featuresUsed: string[];
    currentBillingPeriodUsage: number;
  };
  plans: {
    FREE: {
      name: string;
      monthlyPrice: number;
      yearlyPrice: number;
      features: string[];
      limits: { [key: string]: number };
    };
    PRO: {
      name: string;
      monthlyPrice: number;
      yearlyPrice: number;
      features: string[];
      limits: { [key: string]: number };
    };
    ENTERPRISE: {
      name: string;
      monthlyPrice: number;
      yearlyPrice: number;
      features: string[];
      limits: { [key: string]: number };
    };
  };
  paymentMethods: any[];
  recentPayments: any[];
  upcomingInvoice?: {
    amount: number;
    date: string;
    description: string;
  };
}

export default function SubscriptionPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscriptions/details', { 
        credentials: 'include',
        headers: {
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        }
      });
      if (response.ok) {
        const result = await response.json();
        setSubscriptionData(result.data);
        if (result.data.subscription) {
          setBillingCycle(result.data.subscription.billingCycle || 'monthly');
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (newPlan: string, cycle: 'monthly' | 'yearly') => {
    setActionLoading(`${newPlan}-${cycle}`);
    try {
      const action = getCurrentPlan() === 'FREE' ? 'upgrade' : 
                   (planRank(newPlan) > planRank(getCurrentPlan())) ? 'upgrade' : 'downgrade';
      
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({ 
          action, 
          plan: newPlan,
          billingCycle: cycle
        })
      });

      if (response.ok) {
        await fetchSubscriptionData();
        alert(`Successfully ${action}d to ${newPlan} plan!`);
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to change plan');
      }
    } catch (error) {
      console.error('Plan change failed:', error);
      alert('Failed to change plan');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading('cancel');
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'cancel' })
      });

      if (response.ok) {
        await fetchSubscriptionData();
        alert('Subscription cancelled. Access will continue until the end of your billing period.');
        setShowCancelConfirm(false);
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancellation failed:', error);
      alert('Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading('reactivate');
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'reactivate' })
      });

      if (response.ok) {
        await fetchSubscriptionData();
        alert('Subscription reactivated successfully!');
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Reactivation failed:', error);
      alert('Failed to reactivate subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const getCurrentPlan = () => {
    return subscriptionData?.subscription?.plan || 'FREE';
  };

  const planRank = (plan: string) => {
    const ranks = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
    return ranks[plan as keyof typeof ranks] || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlyMonthly = yearly / 12;
    const savings = ((monthly - yearlyMonthly) / monthly) * 100;
    return Math.round(savings);
  };

  const isTrialActive = () => {
    if (!subscriptionData?.subscription?.trialEndsAt) return false;
    return new Date(subscriptionData.subscription.trialEndsAt) > new Date();
  };

  const getDaysUntilTrialEnd = () => {
    if (!subscriptionData?.subscription?.trialEndsAt) return 0;
    const trialEnd = new Date(subscriptionData.subscription.trialEndsAt);
    const now = new Date();
    return Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">Failed to load subscription data</p>
          <button 
            onClick={fetchSubscriptionData}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { user, subscription, usage, plans, upcomingInvoice } = subscriptionData;
  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-zinc-400 mt-2">Manage your plan, billing, and usage</p>
        </div>

        {/* Trial Banner */}
        {isTrialActive() && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Gift className="w-6 h-6 text-purple-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-400">Free Trial Active</h3>
                  <p className="text-zinc-400">
                    {getDaysUntilTrialEnd()} days remaining • Upgrade anytime to continue
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan('PRO')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Plan Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Current Plan
                </h2>
                {subscription && (
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      subscription.status === 'ACTIVE' ? 'bg-green-900 text-green-300' :
                      subscription.status === 'CANCELLED' ? 'bg-red-900 text-red-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                )}
              </div>

              {subscription ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{plans[currentPlan as keyof typeof plans]?.name}</h3>
                      <p className="text-zinc-400">
                        {formatAmount(
                          billingCycle === 'yearly' 
                            ? plans[currentPlan as keyof typeof plans]?.yearlyPrice / 12
                            : plans[currentPlan as keyof typeof plans]?.monthlyPrice
                        )} per month
                        {billingCycle === 'yearly' && ' (billed yearly)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-400">Next billing</p>
                      <p className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
                    </div>
                  </div>

                  {subscription.cancelAtPeriodEnd && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                          <div>
                            <p className="font-medium text-red-400">Subscription Cancelled</p>
                            <p className="text-sm text-zinc-400">
                              Access continues until {formatDate(subscription.currentPeriodEnd)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleReactivateSubscription}
                          disabled={actionLoading === 'reactivate'}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === 'reactivate' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Reactivate'
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {upcomingInvoice && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-400 mr-3" />
                          <div>
                            <p className="font-medium text-blue-400">Upcoming Payment</p>
                            <p className="text-sm text-zinc-400">{upcomingInvoice.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatAmount(upcomingInvoice.amount)}</p>
                          <p className="text-sm text-zinc-400">{formatDate(upcomingInvoice.date)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crown className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
                  <p className="text-zinc-400 mb-6">You're currently on the free plan</p>
                  <button
                    onClick={() => setSelectedPlan('PRO')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </motion.div>

            {/* Usage Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Usage This Period
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">AI Credits</span>
                    <span className="text-sm font-medium">
                      {usage.aiCreditsUsed.toLocaleString()} / {usage.aiCreditsLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((usage.aiCreditsUsed / usage.aiCreditsLimit) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {((usage.aiCreditsUsed / usage.aiCreditsLimit) * 100).toFixed(1)}% used
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Features Used</span>
                    <span className="text-sm font-medium">{usage.featuresUsed.length} tools</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {usage.featuresUsed.slice(0, 6).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-zinc-700 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                    {usage.featuresUsed.length > 6 && (
                      <span className="px-2 py-1 bg-zinc-700 text-xs rounded">
                        +{usage.featuresUsed.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Available Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Available Plans</h2>
                <div className="flex items-center space-x-2 bg-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      billingCycle === 'monthly' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      billingCycle === 'yearly' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(plans).map(([planKey, plan]) => {
                  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
                  const monthlyPrice = billingCycle === 'yearly' ? plan.yearlyPrice / 12 : plan.monthlyPrice;
                  const isCurrentPlan = currentPlan === planKey;
                  const savings = billingCycle === 'yearly' ? calculateSavings(plan.monthlyPrice, plan.yearlyPrice) : 0;

                  return (
                    <div
                      key={planKey}
                      className={`relative bg-zinc-800/50 border rounded-xl p-6 transition-all ${
                        isCurrentPlan 
                          ? 'border-blue-500 ring-2 ring-blue-500/20' 
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full">
                            Current Plan
                          </span>
                        </div>
                      )}

                      {billingCycle === 'yearly' && savings > 0 && !isCurrentPlan && (
                        <div className="absolute -top-3 right-4">
                          <span className="bg-green-600 text-white px-3 py-1 text-xs font-medium rounded-full">
                            Save {savings}%
                          </span>
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold">{formatAmount(monthlyPrice)}</span>
                          <span className="text-zinc-400">/month</span>
                          {billingCycle === 'yearly' && (
                            <p className="text-sm text-zinc-500">
                              Billed {formatAmount(price)} yearly
                            </p>
                          )}
                        </div>

                        <ul className="text-sm text-zinc-400 space-y-2 mb-6">
                          {plan.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 4 && (
                            <li className="text-blue-400">
                              +{plan.features.length - 4} more features
                            </li>
                          )}
                        </ul>

                        {!isCurrentPlan ? (
                          <button
                            onClick={() => handlePlanChange(planKey, billingCycle)}
                            disabled={actionLoading === `${planKey}-${billingCycle}`}
                            className={`w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                              planKey === 'ENTERPRISE'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {actionLoading === `${planKey}-${billingCycle}` ? (
                              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              `${planRank(planKey) > planRank(currentPlan) ? 'Upgrade to' : 'Switch to'} ${plan.name}`
                            )}
                          </button>
                        ) : (
                          <div className="w-full py-3 rounded-lg bg-zinc-700 text-zinc-400 text-center">
                            Current Plan
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard/billing"
                  className="flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-3" />
                    <span>Billing History</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard/settings#billing"
                  className="flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-3" />
                    <span>Payment Methods</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => window.open('mailto:support@omnipreneur.com')}
                  className="flex items-center justify-between w-full p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-3" />
                    <span>Contact Support</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {subscription && !subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex items-center justify-between w-full p-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <XCircle className="w-4 h-4 mr-3" />
                      <span>Cancel Subscription</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Our support team is here to help with any subscription questions.
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:billing@omnipreneur.com"
                  className="block text-blue-400 hover:text-blue-300 text-sm"
                >
                  billing@omnipreneur.com
                </a>
                <a 
                  href="/docs/billing"
                  className="block text-blue-400 hover:text-blue-300 text-sm"
                >
                  Billing Documentation
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cancel Subscription?</h3>
                <p className="text-zinc-400 mb-6">
                  You'll continue to have access until your current billing period ends on{' '}
                  {subscription && formatDate(subscription.currentPeriodEnd)}.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={actionLoading === 'cancel'}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'cancel' ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      'Cancel Subscription'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}