"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiGet } from '@/lib/client/fetch';
import { useErrorHandler } from '@/app/hooks/useErrorHandler';

interface SecureProductAccessProps {
  productId: string;
  productName: string;
  requiredPlans: string[];
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
}

interface AccessResult {
  hasAccess: boolean;
  reason?: string;
  upgradeUrl?: string;
  userPlan?: string;
  isDemo?: boolean;
}

export default function SecureProductAccess({
  productId,
  productName,
  requiredPlans,
  children,
  fallbackContent,
}: SecureProductAccessProps) {
  const [accessResult, setAccessResult] = useState<AccessResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { handleApiError } = useErrorHandler();

  useEffect(() => {
    checkAccess();
  }, [productId, requiredPlans]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      
      // First get user data
      const userResponse = await apiGet('/api/users/me');
      if (!userResponse.success) {
        setAccessResult({
          hasAccess: false,
          reason: 'no_auth',
        });
        return;
      }

      const userData = userResponse.data;
      setUser(userData);

      // Check server-side access control
      const accessResponse = await apiGet(`/api/products/access?productId=${productId}&requiredPlans=${requiredPlans.join(',')}`);
      
      if (accessResponse.success) {
        setAccessResult(accessResponse.data);
      } else {
        setAccessResult({
          hasAccess: false,
          reason: 'access_denied',
        });
      }
    } catch (error) {
      console.error('Access check failed:', error);
      handleApiError(error);
      setAccessResult({
        hasAccess: false,
        reason: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!accessResult || !accessResult.hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {fallbackContent || (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center"
            >
              {accessResult?.reason === 'no_auth' ? (
                <>
                  <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                  <p className="text-zinc-400 mb-6">
                    Please log in to access {productName}.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="w-full border border-zinc-600 hover:border-blue-500 text-zinc-300 hover:text-blue-400 font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                    >
                      Create Account
                    </Link>
                  </div>
                </>
              ) : accessResult?.reason === 'no_subscription' || accessResult?.reason === 'wrong_plan' ? (
                <>
                  <Crown className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold mb-4">Upgrade Required</h1>
                  <p className="text-zinc-400 mb-2">
                    {productName} requires a {requiredPlans[0]} subscription or higher.
                  </p>
                  {user?.subscription?.plan && (
                    <p className="text-zinc-500 text-sm mb-6">
                      Current plan: {user.subscription.plan}
                    </p>
                  )}
                  
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                    <h3 className="text-orange-400 font-semibold mb-2">Premium Features</h3>
                    <ul className="text-left text-zinc-300 text-sm space-y-1">
                      <li>• Advanced AI capabilities</li>
                      <li>• Unlimited usage</li>
                      <li>• Priority support</li>
                      <li>• Export and integration features</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={accessResult.upgradeUrl || '/pricing'}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                    >
                      Upgrade Now
                    </Link>
                    <Link
                      href="/dashboard"
                      className="w-full border border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                    >
                      Back to Dashboard
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                  <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                  <p className="text-zinc-400 mb-6">
                    You don't have permission to access {productName}.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={checkAccess}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                    <Link
                      href="/dashboard"
                      className="w-full border border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
                    >
                      Back to Dashboard
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Show demo mode indicator if applicable
  if (accessResult.isDemo) {
    return (
      <div className="relative">
        <div className="sticky top-0 z-40 bg-gradient-to-r from-orange-600 to-red-600 text-white p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Demo Mode</span>
              <span className="ml-2 text-orange-100">
                Upgrade to {requiredPlans[0]} for full access
              </span>
            </div>
            <Link
              href="/pricing"
              className="bg-white text-orange-600 px-4 py-1 rounded font-semibold hover:bg-orange-50 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // User has full access
  return <>{children}</>;
}