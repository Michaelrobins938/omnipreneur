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
  Shield
} from 'lucide-react';

interface BillingData {
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
  };
  paymentMethods: any[];
  recentPayments: any[];
  plans: {
    PRO: {
      name: string;
      monthlyPrice: number;
      yearlyPrice: number;
      features: string[];
    };
    ENTERPRISE: {
      name: string;
      monthlyPrice: number;
      yearlyPrice: number;
      features: string[];
    };
  };
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const response = await fetch('/api/payments/create', { 
        method: 'GET',
        credentials: 'include' 
      });
      if (response.ok) {
        const result = await response.json();
        setBillingData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionAction = async (action: string, plan?: string) => {
    setActionLoading(action);
    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action, plan })
      });

      if (response.ok) {
        await fetchBillingData(); // Refresh data
        // Show success message
      } else {
        console.error('Subscription action failed');
      }
    } catch (error) {
      console.error('Failed to perform subscription action:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/invoices/download?paymentId=${paymentId}&format=pdf`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${paymentId.slice(-8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleBulkDownload = async () => {
    if (recentPayments.length === 0) return;
    
    try {
      const paymentIds = recentPayments.map(p => p.id);
      const response = await fetch('/api/invoices/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ paymentIds, format: 'zip' })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download invoices');
      }
    } catch (error) {
      console.error('Error downloading invoices:', error);
    }
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
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Unable to Load Billing</h1>
            <p className="text-zinc-400 mb-6">There was an error loading your billing information.</p>
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, subscription, paymentMethods, recentPayments, plans } = billingData;
  const currentPlan = subscription?.plan || 'FREE';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <CreditCard className="w-8 h-8 mr-3" />
            Billing & Subscription
          </h1>
          <p className="text-zinc-400 mt-2">Manage your subscription, payment methods, and billing history</p>
        </div>

        {/* Current Plan Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center">
                {currentPlan !== 'FREE' && <Crown className="w-5 h-5 text-yellow-500 mr-2" />}
                Current Plan: {currentPlan}
              </h2>
              {subscription && (
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.status === 'ACTIVE' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {subscription.status}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    Billing: {subscription.billingCycle}
                  </span>
                </div>
              )}
            </div>
            {subscription && (
              <div className="text-right">
                <p className="text-sm text-zinc-400">Next billing date</p>
                <p className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
              </div>
            )}
          </div>

          {subscription?.cancelAtPeriodEnd && (
            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-400 mr-3" />
                <div>
                  <p className="font-semibold text-orange-300">Subscription Ending</p>
                  <p className="text-sm text-orange-400">
                    Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Actions */}
          <div className="flex flex-wrap gap-3">
            {currentPlan === 'FREE' && (
              <>
                <button
                  onClick={() => handleSubscriptionAction('upgrade', 'PRO')}
                  disabled={actionLoading === 'upgrade-pro'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {actionLoading === 'upgrade-pro' && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Upgrade to Pro</span>
                </button>
                <button
                  onClick={() => handleSubscriptionAction('upgrade', 'ENTERPRISE')}
                  disabled={actionLoading === 'upgrade-enterprise'}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {actionLoading === 'upgrade-enterprise' && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Upgrade to Enterprise</span>
                </button>
              </>
            )}
            
            {currentPlan === 'PRO' && (
              <>
                <button
                  onClick={() => handleSubscriptionAction('upgrade', 'ENTERPRISE')}
                  disabled={actionLoading === 'upgrade-enterprise'}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {actionLoading === 'upgrade-enterprise' && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Upgrade to Enterprise</span>
                </button>
                <button
                  onClick={() => handleSubscriptionAction('cancel')}
                  disabled={actionLoading === 'cancel'}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {actionLoading === 'cancel' && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Cancel Subscription</span>
                </button>
              </>
            )}

            {currentPlan === 'ENTERPRISE' && (
              <button
                onClick={() => handleSubscriptionAction('cancel')}
                disabled={actionLoading === 'cancel'}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {actionLoading === 'cancel' && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Cancel Subscription</span>
              </button>
            )}

            {subscription?.cancelAtPeriodEnd && (
              <button
                onClick={() => handleSubscriptionAction('reactivate')}
                disabled={actionLoading === 'reactivate'}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {actionLoading === 'reactivate' && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Reactivate Subscription</span>
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Available Plans
            </h2>
            
            <div className="space-y-6">
              {Object.entries(plans).map(([planKey, plan]) => (
                <div key={planKey} className={`border rounded-lg p-4 ${
                  currentPlan === planKey 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-zinc-700'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    {currentPlan === planKey && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold">${plan.monthlyPrice}</span>
                    <span className="text-zinc-400">/month</span>
                    <span className="text-sm text-zinc-500 ml-2">
                      (${plan.yearlyPrice}/year - save 17%)
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-zinc-300">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Recent Payments
              </h2>
              {recentPayments.length > 0 && (
                <button
                  onClick={handleBulkDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
              )}
            </div>
            
            {recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{payment.productName || payment.plan}</p>
                      <p className="text-sm text-zinc-400">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <p className="font-semibold">{formatAmount(payment.amount)}</p>
                        <div className="flex items-center text-sm">
                          {payment.status === 'SUCCEEDED' ? (
                            <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 mr-1" />
                          )}
                          <span className={payment.status === 'SUCCEEDED' ? 'text-green-400' : 'text-red-400'}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                      {payment.status === 'SUCCEEDED' && (
                        <button
                          onClick={() => handleDownloadInvoice(payment.id)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {recentPayments.length > 5 && (
                  <div className="text-center pt-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      View all payments ({recentPayments.length} total)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No payment history yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Payment Methods
            </h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Add Payment Method</span>
            </button>
          </div>
          
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-zinc-400 mr-3" />
                    <div>
                      <p className="font-medium">**** **** **** {method.last4}</p>
                      <p className="text-sm text-zinc-400">{method.brand.toUpperCase()} • Expires {method.exp_month}/{method.exp_year}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.default && (
                      <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">
                        Default
                      </span>
                    )}
                    <button className="text-zinc-400 hover:text-white">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">No payment methods on file</p>
              <p className="text-sm text-zinc-500">Add a payment method to manage your subscription</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

