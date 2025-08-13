"use client"

import * as React from 'react';
import { Toaster as Sonner } from 'sonner';
import { X } from 'lucide-react';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-50 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-zinc-50 group-[.toast]:text-zinc-900",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

// Toast utility functions
export const toast = {
  success: (message: string, description?: string) => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.success(message, { description });
  },
  
  error: (message: string, description?: string) => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.error(message, { description });
  },
  
  warning: (message: string, description?: string) => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.warning(message, { description });
  },
  
  info: (message: string, description?: string) => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.info(message, { description });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
  
  dismiss: (toastId?: string | number) => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.dismiss(toastId);
  },
  
  // Custom toast for API errors
  apiError: (error: any, fallbackMessage = 'An error occurred') => {
    const { toast: sonnerToast } = require('sonner');
    const message = error?.message || error?.error?.message || fallbackMessage;
    return sonnerToast.error('Error', { description: message });
  },
  
  // Custom toast for network errors
  networkError: () => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.error('Network Error', {
      description: 'Please check your internet connection and try again.',
    });
  },
  
  // Custom toast for rate limit errors
  rateLimitError: () => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.warning('Rate Limit Exceeded', {
      description: 'Please wait a moment before trying again.',
    });
  },
  
  // Custom toast for authentication errors
  authError: () => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.error('Authentication Required', {
      description: 'Please log in to continue.',
    });
  },
  
  // Custom toast for subscription errors
  subscriptionError: () => {
    const { toast: sonnerToast } = require('sonner');
    return sonnerToast.warning('Subscription Required', {
      description: 'Please upgrade your plan to access this feature.',
    });
  },
};