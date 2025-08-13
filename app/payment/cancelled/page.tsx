'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CancellationData {
  reason?: string;
  sessionId?: string;
  productId?: string;
  productName?: string;
  amount?: number;
  timestamp: string;
}

export default function PaymentCancelledPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cancellationData, setCancellationData] = useState<CancellationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const reason = searchParams.get('reason');
    const productId = searchParams.get('product_id');
    const productName = searchParams.get('product_name');
    const amount = searchParams.get('amount');

    setCancellationData({
      reason: reason || 'Payment was cancelled by user',
      sessionId: sessionId || undefined,
      productId: productId || undefined,
      productName: productName || 'Selected Product',
      amount: amount ? parseInt(amount) : undefined,
      timestamp: new Date().toISOString()
    });

    setLoading(false);

    // Log the cancellation for analytics
    logCancellation({
      sessionId,
      reason,
      productId,
      productName,
      amount
    });
  }, [searchParams]);

  const logCancellation = async (data: any) => {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          event: 'payment_cancelled',
          metadata: data
        })
      });
    } catch (error) {
      console.error('Failed to log cancellation:', error);
    }
  };

  const retryPayment = () => {
    if (cancellationData?.productId) {
      router.push(`/products/${cancellationData.productId}?retry=true`);
    } else {
      router.push('/pricing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cancellation Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <XCircle className="w-20 h-20 text-amber-500 mx-auto" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-zinc-400 mb-6">
            No worries! Your payment was not processed and no charges were made.
          </p>
        </motion.div>

        {/* Cancellation Details */}
        {cancellationData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3" />
              Cancellation Details
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Product</label>
                  <p className="text-white font-semibold">{cancellationData.productName}</p>
                </div>
                
                {cancellationData.amount && (
                  <div>
                    <label className="text-sm text-zinc-400 block mb-1">Amount (Not Charged)</label>
                    <p className="text-xl font-bold text-amber-500">
                      ${(cancellationData.amount / 100).toFixed(2)} USD
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Reason</label>
                  <p className="text-white">{cancellationData.reason}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {cancellationData.sessionId && (
                  <div>
                    <label className="text-sm text-zinc-400 block mb-1">Session ID</label>
                    <p className="text-white font-mono text-sm">{cancellationData.sessionId}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Date</label>
                  <p className="text-white">
                    {new Date(cancellationData.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Status</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400">
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancelled
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Common Reasons & Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Common Reasons & Solutions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Payment Method Issues</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  Your card may have been declined or there could be insufficient funds.
                </p>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• Check your card balance</li>
                  <li>• Verify card details are correct</li>
                  <li>• Contact your bank if needed</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Browser or Technical Issues</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  Sometimes technical issues can interrupt the payment process.
                </p>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• Clear browser cache</li>
                  <li>• Disable ad blockers</li>
                  <li>• Try a different browser</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Changed Your Mind?</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  No problem! Take your time to explore our offerings.
                </p>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• Browse our product catalog</li>
                  <li>• Compare different plans</li>
                  <li>• Contact us with questions</li>
                </ul>
              </div>
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Need More Information?</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  We're here to help you make the right choice.
                </p>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• Schedule a demo call</li>
                  <li>• Read our documentation</li>
                  <li>• Check out testimonials</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">What Would You Like To Do?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Try Again</h3>
              <p className="text-zinc-400 text-sm">
                Ready to complete your purchase? Let's give it another shot.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Explore More</h3>
              <p className="text-zinc-400 text-sm">
                Check out our other products and find the perfect fit for you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Help</h3>
              <p className="text-zinc-400 text-sm">
                Have questions? Our support team is ready to assist you.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={retryPayment}
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Payment Again
            </button>
            
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              View All Plans
            </Link>
            
            <Link
              href="/support"
              className="inline-flex items-center justify-center border border-zinc-600 hover:border-zinc-500 text-zinc-300 font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Get Support
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link 
              href="/contact" 
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Contact Sales Team
            </Link>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <Link 
              href="/docs" 
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Read Documentation
            </Link>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <Link 
              href="/about" 
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </motion.div>

        {/* Special Offer (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Still Interested? Get 10% Off Your First Month!
          </h3>
          <p className="text-zinc-400 mb-6">
            Use code <span className="text-blue-400 font-mono bg-blue-500/20 px-2 py-1 rounded">RETRY10</span> at checkout for a special discount.
          </p>
          <button
            onClick={retryPayment}
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Claim Discount & Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}