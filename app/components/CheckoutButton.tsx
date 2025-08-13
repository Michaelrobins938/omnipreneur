'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, ArrowRight } from 'lucide-react';
import { apiPost, ensureCsrfCookie } from '@/lib/client/fetch';

interface CheckoutButtonProps {
  productName: string;
  productId: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  className?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export default function CheckoutButton({ 
  productName, 
  productId, 
  price, 
  features, 
  className = '', 
  variant = 'primary',
  onClick 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleCheckout = async () => {
    // Call analytics callback if provided
    onClick?.();
    
    setIsLoading(true);
    
    try {
      // No authentication required - direct to checkout
      // Ensure we have a CSRF cookie for the API call
      await ensureCsrfCookie();
      
      const resp = await apiPost<{ checkoutUrl: string }>(
        '/api/payments/anonymous-checkout',
        { productId, billingCycle }
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
    } finally {
      setIsLoading(false);
    }
  };

  const gradients = {
    primary: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    secondary: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
  };

  const currentPrice = price[billingCycle];
  const yearlyDiscount = Math.round((1 - (price.yearly / 12) / price.monthly) * 100);

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-zinc-800/50 p-1 rounded-full border border-zinc-700/50">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              billingCycle === 'monthly'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
              billingCycle === 'yearly'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Yearly
            {yearlyDiscount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                -{yearlyDiscount}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">
          ${billingCycle === 'yearly' ? Math.round(price.yearly / 12) : currentPrice}
          <span className="text-lg text-zinc-400 font-normal">
            /{billingCycle === 'yearly' ? 'month' : 'month'}
          </span>
        </div>
        {billingCycle === 'yearly' && (
          <div className="text-sm text-zinc-400">
            Billed yearly (${price.yearly} total) - Save ${Math.round((price.monthly * 12) - price.yearly)}!
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">What's included:</h4>
        <ul className="space-y-2">
          {features.slice(0, 5).map((feature, index) => (
            <li key={index} className="flex items-center text-zinc-300">
              <ArrowRight className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Checkout Button */}
      <motion.button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full px-8 py-4 bg-gradient-to-r ${gradients[variant]} text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        whileHover={{ scale: isLoading ? 1 : 1.05 }}
        whileTap={{ scale: isLoading ? 1 : 0.95 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Start Your Subscription
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>

      {/* Trust Indicators */}
      <div className="mt-4 text-center">
        <p className="text-xs text-zinc-500 mb-2">
          🔒 Secure payment by Stripe • Cancel anytime • 30-day money-back guarantee
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-zinc-600">
          <span>✓ No setup fees</span>
          <span>✓ Instant access</span>
          <span>✓ 24/7 support</span>
        </div>
      </div>
    </div>
  );
}