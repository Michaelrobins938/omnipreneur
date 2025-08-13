// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Brain, 
  Sparkles, 
  Target,
  CheckCircle,
  Play
} from 'lucide-react';

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  highlightElement?: boolean;
}

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  steps?: TourStep[];
}

const defaultSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '.dashboard-header',
    title: 'Welcome to Omnipreneur AI Suite! 🚀',
    description: 'You now have access to 26 powerful AI tools designed to supercharge your business. Let\'s take a quick tour!',
    position: 'bottom',
    highlightElement: false
  },
  {
    id: 'products-overview',
    target: '.dashboard-products',
    title: 'Your AI Arsenal',
    description: 'These are your 26 AI-powered products. Each one is designed to solve specific business challenges with cutting-edge AI technology.',
    position: 'top',
    highlightElement: true
  },
  {
    id: 'novus-protocol',
    target: '[data-product-id="novus-protocol"]',
    title: 'Start with NOVUS Protocol',
    description: 'We recommend starting here! NOVUS optimizes your AI prompts for better results across all platforms.',
    position: 'right',
    highlightElement: true,
    action: () => {
      const element = document.querySelector('[data-product-id="novus-protocol"]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },
  {
    id: 'content-spawner',
    target: '[data-product-id="content-spawner"]',
    title: 'Content Spawner - Go Viral',
    description: 'Generate viral content for social media, blogs, and marketing campaigns with AI-powered creativity.',
    position: 'left',
    highlightElement: true
  },
  {
    id: 'bundle-builder',
    target: '[data-product-id="bundle-builder"]',
    title: 'Bundle Builder - Maximize Revenue',
    description: 'Create profitable product bundles with AI-optimized pricing and marketing materials.',
    position: 'right',
    highlightElement: true
  },
  {
    id: 'live-dashboard',
    target: '[data-product-id="live-dashboard"]',
    title: 'Live Dashboard - Track Everything',
    description: 'Monitor your business metrics, AI usage, and performance with real-time analytics.',
    position: 'left',
    highlightElement: true
  },
  {
    id: 'settings',
    target: '.dashboard-settings',
    title: 'Your Account Settings',
    description: 'Manage your profile, subscription, and preferences here. You can always customize your experience.',
    position: 'bottom',
    highlightElement: true
  },
  {
    id: 'complete',
    target: '.dashboard-header',
    title: 'You\'re All Set! 🎉',
    description: 'You\'re ready to transform your business with AI. Click on any product to get started, or explore the dashboard to learn more.',
    position: 'bottom',
    highlightElement: false
  }
];

export default function WelcomeTour({ 
  isOpen, 
  onClose, 
  onComplete, 
  steps = defaultSteps 
}: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && steps[currentStep]) {
      updateTooltipPosition();
      // Execute action if present
      if (steps[currentStep].action) {
        setTimeout(() => {
          steps[currentStep].action?.();
        }, 300);
      }
    }
  }, [currentStep, isOpen, steps]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const updateTooltipPosition = () => {
    const step = steps[currentStep];
    const targetElement = document.querySelector(step.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      let x = 0, y = 0;

      switch (step.position) {
        case 'top':
          x = rect.left + rect.width / 2;
          y = rect.top - 20;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2;
          y = rect.bottom + 20;
          break;
        case 'left':
          x = rect.left - 20;
          y = rect.top + rect.height / 2;
          break;
        case 'right':
          x = rect.right + 20;
          y = rect.top + rect.height / 2;
          break;
      }

      setTooltipPosition({ x, y });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    onComplete?.();
    onClose();
    // Store completion in localStorage
    localStorage.setItem('omnipreneur_tour_completed', 'true');
  };

  const skipTour = () => {
    onClose();
    localStorage.setItem('omnipreneur_tour_skipped', 'true');
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Overlay with spotlight effect */}
        <div className="absolute inset-0 bg-black/80">
          {currentStepData.highlightElement && (
            <div 
              className="absolute pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${tooltipPosition.x}px ${tooltipPosition.y}px, transparent 100px, rgba(0,0,0,0.8) 150px)`,
              }}
            />
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute z-10 max-w-sm"
          style={{
            left: Math.max(20, Math.min(window.innerWidth - 400, tooltipPosition.x - 200)),
            top: Math.max(20, Math.min(window.innerHeight - 300, tooltipPosition.y - 100)),
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-zinc-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentStep === 0 && <Sparkles className="w-6 h-6 text-purple-500" />}
                {currentStep > 0 && currentStep < steps.length - 1 && <Brain className="w-6 h-6 text-blue-500" />}
                {currentStep === steps.length - 1 && <CheckCircle className="w-6 h-6 text-green-500" />}
                <span className="text-sm font-medium text-zinc-500">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <button
                onClick={skipTour}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-zinc-600 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Progress bar */}
            <div className="bg-zinc-100 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={skipTour}
                  className="px-4 py-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Skip Tour
                </button>
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                  {currentStep === steps.length - 1 ? <Play className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Pointer arrow */}
          {currentStepData.highlightElement && (
            <div
              className="absolute w-4 h-4 bg-white rotate-45 border border-zinc-200"
              style={{
                [currentStepData.position === 'top' ? 'bottom' : 
                 currentStepData.position === 'bottom' ? 'top' :
                 currentStepData.position === 'left' ? 'right' : 'left']: '-8px',
                [currentStepData.position === 'left' || currentStepData.position === 'right' ? 'top' : 'left']: 
                  currentStepData.position === 'left' || currentStepData.position === 'right' ? '50%' : '50%',
                transform: currentStepData.position === 'left' || currentStepData.position === 'right' ? 'translateY(-50%)' : 'translateX(-50%)'
              }}
            />
          )}
        </motion.div>

        {/* Highlight ring for target element */}
        {currentStepData.highlightElement && (
          <HighlightRing target={currentStepData.target} />
        )}
      </div>
    </AnimatePresence>
  );
}

function HighlightRing({ target }: { target: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          x: rect.left - 4,
          y: rect.top - 4,
          width: rect.width + 8,
          height: rect.height + 8
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [target]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute pointer-events-none border-4 border-purple-500 rounded-xl shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
      }}
    />
  );
}