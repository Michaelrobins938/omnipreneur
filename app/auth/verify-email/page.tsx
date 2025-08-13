"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { apiPost } from '@/lib/client/fetch';
import { toast } from '@/app/components/ui/toast';
import { useErrorHandler } from '@/app/hooks/useErrorHandler';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleApiError } = useErrorHandler();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setStatus('loading');
      
      const response = await apiPost('/api/auth/verify-email', {
        token: verificationToken,
      });

      if (response.success) {
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        setEmail(response.data?.email || '');
        
        toast.success('Email Verified', 'Your account is now fully activated');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        if (response.error?.code === 'INVALID_TOKEN') {
          setStatus('expired');
          setMessage('This verification link has expired or is invalid');
        } else {
          setStatus('error');
          setMessage(response.error?.message || 'Verification failed');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      handleApiError(error);
      setStatus('error');
      setMessage('Failed to verify email. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      const userEmail = prompt('Please enter your email address to resend verification:');
      if (!userEmail) return;
      setEmail(userEmail);
    }

    try {
      setIsResending(true);
      
      const response = await apiPost('/api/auth/verify-email', {
        email,
      }, 'PUT');

      if (response.success) {
        toast.success('Verification Email Sent', 'Please check your inbox for a new verification link');
        setMessage('A new verification email has been sent. Please check your inbox.');
      } else {
        toast.error('Failed to Resend', response.error?.message || 'Could not send verification email');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/30 rounded-full animate-ping mx-auto"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verifying Your Email
            </h1>
            <p className="text-zinc-400">
              Please wait while we verify your email address...
            </p>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Email Verified Successfully!
            </h1>
            <p className="text-zinc-400 mb-6">
              {message}
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">
                Redirecting to your dashboard in a few seconds...
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        );

      case 'expired':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Verification Link Expired
            </h1>
            <p className="text-zinc-400 mb-6">
              {message}
            </p>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
              <p className="text-orange-400 text-sm">
                Don't worry! You can request a new verification link below.
              </p>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </button>
          </motion.div>
        );

      case 'error':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-zinc-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Request New Verification Email
                  </>
                )}
              </button>
              
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        {renderContent()}
      </div>
    </div>
  );
}