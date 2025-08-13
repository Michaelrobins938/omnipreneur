'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Lock, Crown, Zap, ArrowRight, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { apiGet } from '@/lib/client/fetch';

interface AccessControlProps {
  productId: string;
  productName: string;
  requiredPlans: string[];
  children: React.ReactNode;
  demoMode?: boolean;
}

interface UserData {
  id: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

export default function ProductAccessControl({ 
  productId, 
  productName, 
  requiredPlans, 
  children,
  demoMode = false 
}: AccessControlProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const searchParams = useSearchParams();
  
  // Access now controlled server-side only
  // Removed insecure client-side ?access=true bypass

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    try {
      const hasAuth = typeof document !== 'undefined' && document.cookie.includes('auth_token=');
      if (!hasAuth) {
        setLoading(false);
        return;
      }
      const response = await apiGet<any>('/api/users/me');
      if (response && response.success !== false) {
        const userData = (response.data as any) || (response as any);
        setUser(userData);
        const entitlements: Array<{ productId: string; status: string }> = userData.entitlements || [];
        const hasEntitlement = entitlements.some((e) => e.productId === productId && e.status === 'ACTIVE');
        const userPlan = userData.subscription?.plan || 'FREE';
        const hasValidPlan = requiredPlans.includes(userPlan) ||
          (requiredPlans.includes('PRO') && ['PRO', 'ENTERPRISE'].includes(userPlan)) ||
          (requiredPlans.includes('ENTERPRISE') && userPlan === 'ENTERPRISE');
        setHasAccess(hasEntitlement || hasValidPlan);
      }
    } catch (error) {
      console.error('Error checking access:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // Show demo banner if no access (non-blocking, content stays visible)
  if (!hasAccess && demoMode) {
    return (
      <div className="relative">
        {!bannerDismissed && (
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 text-center relative z-10">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Demo Mode - Limited functionality enabled</span>
              <Link 
                href={`/products/${productId}#pricing`}
                className="ml-4 bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                Get Full Access
              </Link>
              <button
                onClick={() => setBannerDismissed(true)}
                className="ml-2 p-1 hover:bg-orange-700/50 rounded-full transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        <div className="relative">
          {children}
        </div>
      </div>
    );
  }

  // Show upgrade prompt if no access and not demo mode
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-800 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Premium Access Required
            </h2>
            
            <p className="text-zinc-400 mb-6">
              {user ? (
                <>You need a <strong>{requiredPlans[0]}</strong> subscription to access <strong>{productName}</strong>.</>
              ) : (
                <>Please log in and subscribe to access <strong>{productName}</strong>.</>
              )}
            </p>

            {user?.subscription && (
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Current Plan:</span>
                  <span className="text-white font-medium">
                    {user.subscription.plan || 'FREE'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-zinc-400">Required:</span>
                  <span className="text-blue-400 font-medium">
                    {requiredPlans.join(' or ')}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {!user ? (
                <Link
                  href="/auth/login"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href={`/products/${productId}#pricing`}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              
              <Link
                href="/dashboard"
                className="w-full border border-zinc-600 text-zinc-300 py-3 px-6 rounded-lg font-medium hover:border-blue-500 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show full access
  return (
    <div>
      {/* Access granted banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Full access granted - {user?.subscription?.plan || 'Premium'} subscriber</span>
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * Hook to check if user has access to a specific product
 */
export function useProductAccess(productId: string, requiredPlans: string[]) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const hasAuth = typeof document !== 'undefined' && document.cookie.includes('auth_token=');
        if (!hasAuth) {
          setLoading(false);
          return;
        }
        const response = await apiGet<any>('/api/users/me');
        if (response && response.success !== false) {
          const userData = (response.data as any) || (response as any);
          setUser(userData);
          const userPlan = userData.subscription?.plan || 'FREE';
          const hasValidAccess = requiredPlans.includes(userPlan) || 
                               (requiredPlans.includes('PRO') && ['PRO', 'ENTERPRISE'].includes(userPlan)) ||
                               (requiredPlans.includes('ENTERPRISE') && userPlan === 'ENTERPRISE');
          setHasAccess(hasValidAccess);
        }
      } catch (error) {
        console.error('Error checking access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [productId, requiredPlans]);

  return { hasAccess, loading, user };
}