'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  CheckCircle,
  Target,
  Lightbulb,
  Zap
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    type: 'click' | 'hover' | 'wait';
    duration?: number;
  };
  beforeStep?: () => void | Promise<void>;
  afterStep?: () => void | Promise<void>;
}

interface TourConfig {
  id: string;
  title: string;
  description: string;
  steps: TourStep[];
  autoStart?: boolean;
  showProgress?: boolean;
  allowSkip?: boolean;
  overlay?: boolean;
}

interface OnboardingTourProps {
  config: TourConfig;
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  className?: string;
}

export function OnboardingTour({ 
  config, 
  isActive, 
  onComplete, 
  onSkip, 
  className 
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = config.steps[currentStep];

  useEffect(() => {
    if (isActive && config.autoStart) {
      startTour();
    }
  }, [isActive, config.autoStart]);

  useEffect(() => {
    if (isRunning && currentStepData) {
      updateTargetElement();
    }
  }, [isRunning, currentStep, currentStepData]);

  useEffect(() => {
    if (targetElement && tooltipRef.current) {
      updateTooltipPosition();
    }
  }, [targetElement, currentStepData?.placement]);

  const updateTargetElement = () => {
    if (!currentStepData?.target) return;

    const element = document.querySelector(currentStepData.target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the element
      element.style.position = 'relative';
      element.style.zIndex = '1001';
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      element.style.borderRadius = '8px';
    }
  };

  const updateTooltipPosition = () => {
    if (!targetElement || !tooltipRef.current) return;

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const placement = currentStepData?.placement || 'bottom';

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 12;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + 12;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - 12;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + 12;
        break;
    }

    // Ensure tooltip stays within viewport
    const margin = 16;
    top = Math.max(margin, Math.min(window.innerHeight - tooltipRect.height - margin, top));
    left = Math.max(margin, Math.min(window.innerWidth - tooltipRect.width - margin, left));

    setTooltipPosition({ top, left });
  };

  const startTour = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    if (config.steps[0]?.beforeStep) {
      await config.steps[0].beforeStep();
    }
  };

  const nextStep = async () => {
    // Clean up current step
    if (targetElement) {
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.boxShadow = '';
      targetElement.style.borderRadius = '';
    }

    if (currentStepData?.afterStep) {
      await currentStepData.afterStep();
    }

    if (currentStep < config.steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      if (config.steps[nextStepIndex]?.beforeStep) {
        await config.steps[nextStepIndex].beforeStep();
      }
    } else {
      completeTour();
    }
  };

  const prevStep = async () => {
    if (targetElement) {
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.boxShadow = '';
      targetElement.style.borderRadius = '';
    }

    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      
      if (config.steps[prevStepIndex]?.beforeStep) {
        await config.steps[prevStepIndex].beforeStep();
      }
    }
  };

  const completeTour = () => {
    if (targetElement) {
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.boxShadow = '';
      targetElement.style.borderRadius = '';
    }
    
    setIsRunning(false);
    onComplete();
  };

  const skipTour = () => {
    if (targetElement) {
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.boxShadow = '';
      targetElement.style.borderRadius = '';
    }
    
    setIsRunning(false);
    onSkip();
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {!isRunning ? (
        // Tour Start Screen
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {config.title}
              </h2>
              
              <p className="text-gray-600 dark:text-zinc-400 mb-6">
                {config.description}
              </p>

              <div className="flex items-center justify-center space-x-2 mb-6 text-sm text-gray-500 dark:text-zinc-500">
                <CheckCircle className="w-4 h-4" />
                <span>{config.steps.length} steps</span>
                <span>•</span>
                <span>~{Math.ceil(config.steps.length * 30 / 60)} min</span>
              </div>

              <div className="flex space-x-3">
                {config.allowSkip && (
                  <button
                    onClick={skipTour}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Skip Tour
                  </button>
                )}
                <button
                  onClick={startTour}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Tour</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        // Tour Running
        <>
          {/* Overlay */}
          {config.overlay && (
            <div className="fixed inset-0 bg-black/30 z-50 pointer-events-none" />
          )}

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              zIndex: 1002
            }}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-sm min-w-[300px]"
          >
            {/* Close button */}
            <button
              onClick={skipTour}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress */}
            {config.showProgress && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-500 mb-2">
                  <span>Step {currentStep + 1} of {config.steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / config.steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / config.steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>{currentStepData?.title}</span>
              </h3>
              <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
                {currentStepData?.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex space-x-2">
                {config.allowSkip && (
                  <button
                    onClick={skipTour}
                    className="px-3 py-1.5 text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    Skip
                  </button>
                )}
                
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <span>{currentStep === config.steps.length - 1 ? 'Finish' : 'Next'}</span>
                  {currentStep === config.steps.length - 1 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pointer/Arrow */}
          {targetElement && (
            <div
              className="fixed z-1003 pointer-events-none"
              style={{
                top: tooltipPosition.top + (currentStepData?.placement === 'top' ? 220 : -20),
                left: tooltipPosition.left + 150,
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-600"
              >
                <Zap className="w-6 h-6" />
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

// Tour configurations for different dashboards
export const tourConfigs = {
  adminDashboard: {
    id: 'admin-dashboard',
    title: 'Admin Dashboard Tour',
    description: 'Learn how to manage affiliates and process payouts effectively.',
    autoStart: false,
    showProgress: true,
    allowSkip: true,
    overlay: true,
    steps: [
      {
        id: 'affiliate-stats',
        title: 'Platform Overview',
        content: 'Here you can see key metrics about your affiliate program including total affiliates, revenue, and pending payouts.',
        target: '[data-tour="platform-stats"]',
        placement: 'bottom' as const
      },
      {
        id: 'search-filters',
        title: 'Search & Filter',
        content: 'Use these controls to search for specific affiliates or filter by status to quickly find what you need.',
        target: '[data-tour="search-filters"]',
        placement: 'bottom' as const
      },
      {
        id: 'affiliate-actions',
        title: 'Affiliate Management',
        content: 'Review affiliate applications and manage their status. You can approve, reject, suspend, or activate affiliates.',
        target: '[data-tour="affiliate-table"]',
        placement: 'top' as const
      },
      {
        id: 'payout-processing',
        title: 'Process Payouts',
        content: 'Click the payout button to process pending commissions. Payouts are sent via the affiliate\'s preferred method.',
        target: '[data-tour="payout-button"]',
        placement: 'top' as const
      }
    ]
  },

  leadsDashboard: {
    id: 'leads-dashboard',
    title: 'Lead Management Tour',
    description: 'Master lead capture, scoring, and nurturing with AI-powered insights.',
    autoStart: false,
    showProgress: true,
    allowSkip: true,
    overlay: true,
    steps: [
      {
        id: 'lead-overview',
        title: 'Lead Analytics',
        content: 'Monitor your lead generation performance with conversion rates, lead scores, and pipeline value.',
        target: '[data-tour="lead-analytics"]',
        placement: 'bottom' as const
      },
      {
        id: 'ai-insights',
        title: 'AI-Powered Insights',
        content: 'Get personalized recommendations for lead follow-up, nurturing strategies, and conversion optimization.',
        target: '[data-tour="ai-insights"]',
        placement: 'bottom' as const
      },
      {
        id: 'lead-capture',
        title: 'Add New Leads',
        content: 'Quickly capture new leads with automatic scoring and segmentation based on their profile.',
        target: '[data-tour="add-lead"]',
        placement: 'left' as const
      },
      {
        id: 'lead-management',
        title: 'Manage Lead Status',
        content: 'Update lead status as they progress through your sales funnel. The system tracks all interactions.',
        target: '[data-tour="lead-table"]',
        placement: 'top' as const
      }
    ]
  },

  analyticsDashboard: {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard Tour',
    description: 'Discover powerful insights about your business performance and growth.',
    autoStart: false,
    showProgress: true,
    allowSkip: true,
    overlay: true,
    steps: [
      {
        id: 'revenue-overview',
        title: 'Revenue Tracking',
        content: 'Monitor your revenue growth, subscription metrics, and financial performance in real-time.',
        target: '[data-tour="revenue-cards"]',
        placement: 'bottom' as const
      },
      {
        id: 'usage-analytics',
        title: 'Usage Analytics',
        content: 'Track how users engage with your platform and identify the most popular features.',
        target: '[data-tour="usage-chart"]',
        placement: 'top' as const
      },
      {
        id: 'time-range',
        title: 'Time Range Selection',
        content: 'Adjust the time range to analyze trends over different periods and compare performance.',
        target: '[data-tour="time-range"]',
        placement: 'bottom' as const
      }
    ]
  }
};

// Hook for managing onboarding state
export function useOnboarding() {
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [activeTour, setActiveTour] = useState<string | null>(null);

  useEffect(() => {
    // Load completed tours from localStorage
    const completed = localStorage.getItem('completed-tours');
    if (completed) {
      setCompletedTours(JSON.parse(completed));
    }
  }, []);

  const startTour = (tourId: string) => {
    setActiveTour(tourId);
  };

  const completeTour = (tourId: string) => {
    const updated = [...completedTours, tourId];
    setCompletedTours(updated);
    localStorage.setItem('completed-tours', JSON.stringify(updated));
    setActiveTour(null);
  };

  const skipTour = () => {
    setActiveTour(null);
  };

  const isTourCompleted = (tourId: string) => {
    return completedTours.includes(tourId);
  };

  const resetTours = () => {
    setCompletedTours([]);
    localStorage.removeItem('completed-tours');
  };

  return {
    activeTour,
    startTour,
    completeTour,
    skipTour,
    isTourCompleted,
    resetTours,
    completedTours
  };
}