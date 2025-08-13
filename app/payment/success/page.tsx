'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, User, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';

interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  productName: string;
  plan: string;
  billingCycle: string;
  customerEmail: string;
  timestamp: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');
    
    if (sessionId || paymentIntentId) {
      fetchPaymentData(sessionId, paymentIntentId);
    } else {
      setError('No payment information found');
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const fetchPaymentData = async (sessionId: string | null, paymentIntentId: string | null) => {
    try {
      const endpoint = sessionId 
        ? `/api/payments/verify?session_id=${sessionId}`
        : `/api/payments/verify?payment_intent=${paymentIntentId}`;
        
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: {
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentData(data.payment);
      } else {
        setError('Failed to verify payment. Please contact support if you were charged.');
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Unable to verify payment status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">Payment Verification Failed</h1>
            <p className="text-zinc-400 mb-6">{error}</p>
            <div className="space-y-3">
              <Link 
                href="/dashboard" 
                className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/support" 
                className="block border border-zinc-600 hover:border-zinc-500 text-zinc-300 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
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
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-zinc-400 mb-6">
            Welcome to Omnipreneur AI Suite. Your journey starts now!
          </p>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-400 text-sm">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>
        </motion.div>

        {/* Payment Details Card */}
        {paymentData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3" />
              Payment Details
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Product</label>
                  <p className="text-white font-semibold">{paymentData.productName}</p>
                </div>
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Plan</label>
                  <p className="text-white">{paymentData.plan} - {paymentData.billingCycle}</p>
                </div>
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Amount Paid</label>
                  <p className="text-2xl font-bold text-green-500">
                    ${(paymentData.amount / 100).toFixed(2)} {paymentData.currency.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Transaction ID</label>
                  <p className="text-white font-mono text-sm">{paymentData.id}</p>
                </div>
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Date</label>
                  <p className="text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(paymentData.timestamp).toLocaleDateString('en-US', {
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {paymentData.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Access Dashboard</h3>
              <p className="text-zinc-400 text-sm">
                Explore your new features and start creating amazing content
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Download Resources</h3>
              <p className="text-zinc-400 text-sm">
                Get access to exclusive templates, guides, and bonus materials
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start Creating</h3>
              <p className="text-zinc-400 text-sm">
                Begin your entrepreneurial journey with AI-powered tools
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 mr-2" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              href="/support"
              className="inline-flex items-center justify-center border border-zinc-600 hover:border-zinc-500 text-zinc-300 font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Need Help?
            </Link>
          </div>
          
          <p className="text-sm text-zinc-500">
            A confirmation email has been sent to {paymentData?.customerEmail || 'your email address'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}