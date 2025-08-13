'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import RegisterForm from '../../../components/auth/RegisterForm';

interface PurchaseData {
  email: string;
  productId: string;
  productName: string;
  sessionId: string;
  timestamp: number;
}

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);

  function decodeBase64Url(input: string): string {
    // Convert base64url to base64
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with '='
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);
    // Decode
    if (typeof atob === 'function') {
      return atob(base64);
    }
    // Fallback for environments without atob (shouldn't happen in browser)
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  useEffect(() => {
    const token = searchParams.get('token');
    const sessionId = searchParams.get('session_id');
    const product = searchParams.get('product');
    const plan = searchParams.get('plan');
    
    if (token) {
      try {
        // Decode the signup token (base64url-encoded JSON)
        const json = decodeBase64Url(token);
        const decodedData = JSON.parse(json);
        
        // Check if token is expired (24 hours)
        const tokenAge = Date.now() - decodedData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge > maxAge) {
          console.error('Signup token has expired');
          setPurchaseData(null);
        } else {
          setPurchaseData(decodedData);
        }
      } catch (error) {
        console.error('Invalid signup token:', error);
        setPurchaseData(null);
      }
    } else if (sessionId && product && plan) {
      // Handle direct checkout parameters (for authenticated users)
      // Check if user is already logged in
      const hasAuth = document.cookie.includes('auth_token');
      if (hasAuth) {
        // User is already authenticated and just completed checkout, redirect to dashboard
        window.location.href = '/dashboard?welcome=true&product=' + encodeURIComponent(product);
        return;
      } else {
        // Create purchase data from session parameters
        setPurchaseData({
          email: '',
          productId: product,
          productName: product.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          sessionId: sessionId,
          timestamp: Date.now()
        });
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-925 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {purchaseData ? (
            <>
              <h1 className="text-4xl font-bold text-white mb-2">
                Complete Your Account
              </h1>
              <p className="text-zinc-400 mb-4">
                You've successfully purchased <strong>{purchaseData.productName}</strong>
              </p>
              <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-4 mb-6 text-green-300">
                Payment confirmed! Create your account to get started.
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-white mb-2">
                Join Omnipreneur
              </h1>
              <p className="text-zinc-400">
                Start your AI-powered entrepreneurial journey
              </p>
            </>
          )}
        </div>
        
        <RegisterForm 
          purchaseData={purchaseData}
          onSuccess={(user) => {
            // Redirect to dashboard with product highlight
            const redirectUrl = purchaseData 
              ? `/dashboard?welcome=true&product=${purchaseData.productId}`
              : '/dashboard';
            window.location.href = redirectUrl;
          }}
        />
      </div>
    </div>
  );
} 