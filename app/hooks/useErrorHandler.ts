"use client"

import { useCallback } from 'react';
import { toast } from '@/app/components/ui/toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  redirectOnAuth?: boolean;
  retryFunction?: () => void;
}

export function useErrorHandler() {
  const handleError = useCallback(
    (error: any, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        redirectOnAuth = true,
        retryFunction,
      } = options;

      // Log error to console in development
      if (logError && process.env.NODE_ENV === 'development') {
        console.error('Error handled:', error);
      }

      // Handle different error types
      if (error?.status === 401 || error?.code === 'UNAUTHORIZED') {
        if (showToast) {
          toast.authError();
        }
        if (redirectOnAuth) {
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        }
        return;
      }

      if (error?.status === 403 || error?.code === 'FORBIDDEN') {
        if (showToast) {
          toast.subscriptionError();
        }
        return;
      }

      if (error?.status === 429 || error?.code === 'RATE_LIMIT_EXCEEDED') {
        if (showToast) {
          toast.rateLimitError();
        }
        return;
      }

      if (error?.name === 'NetworkError' || !navigator.onLine) {
        if (showToast) {
          toast.networkError();
        }
        return;
      }

      // Handle API errors
      if (error?.response || error?.status) {
        const message = error?.response?.data?.message || 
                       error?.message || 
                       error?.error?.message || 
                       'An unexpected error occurred';
        
        if (showToast) {
          toast.error('Error', message);
        }
        return;
      }

      // Handle generic errors
      const message = error?.message || 'An unexpected error occurred';
      if (showToast) {
        toast.error('Error', message);
      }

      // Log error to monitoring service in production
      if (process.env.NODE_ENV === 'production' && logError) {
        logErrorToService(error);
      }
    },
    []
  );

  const handleApiError = useCallback((error: any) => {
    handleError(error, { 
      showToast: true, 
      logError: true, 
      redirectOnAuth: true 
    });
  }, [handleError]);

  const handleSilentError = useCallback((error: any) => {
    handleError(error, { 
      showToast: false, 
      logError: true, 
      redirectOnAuth: false 
    });
  }, [handleError]);

  return {
    handleError,
    handleApiError,
    handleSilentError,
  };
}

// Utility function to log errors to monitoring service
async function logErrorToService(error: any) {
  try {
    await fetch('/api/errors/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error?.message || 'Unknown error',
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'client_error',
      }),
    });
  } catch (logError) {
    console.error('Failed to log error to service:', logError);
  }
}

export default useErrorHandler;