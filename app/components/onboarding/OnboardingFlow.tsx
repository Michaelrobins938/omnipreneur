"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Target, 
  Users, 
  TrendingUp,
  Play,
  X
} from 'lucide-react';
import { toast } from '@/app/components/ui/toast';
import { apiPost } from '@/lib/client/fetch';

interface OnboardingStepProps {
  step: number;
  title: string;
  description: string;
  content: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  title,
  description,
  content,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {step}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-zinc-400">{description}</p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="flex items-center px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onSkip}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface OnboardingFlowProps {
  user: any;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ user, onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const steps = [
    {
      title: "Welcome to Omnipreneur AI Suite!",
      description: "Let's get you started with a quick tour of your new AI-powered workspace",
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <div className="space-y-4">
            <p className="text-zinc-300 text-lg">
              Hi {user?.name || 'there'}! You now have access to our complete suite of AI-powered business tools.
            </p>
            
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">What you'll discover:</h3>
              <ul className="text-zinc-400 text-left space-y-1">
                <li>• AI content generation and optimization</li>
                <li>• Advanced analytics and insights</li>
                <li>• Automated workflow tools</li>
                <li>• Business intelligence features</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "What are your main goals?",
      description: "Help us personalize your experience by selecting your primary objectives",
      content: (
        <div className="space-y-4">
          {[
            { id: 'content', label: 'Content Creation & Marketing', icon: Zap },
            { id: 'analytics', label: 'Business Analytics & Insights', icon: TrendingUp },
            { id: 'automation', label: 'Workflow Automation', icon: Target },
            { id: 'growth', label: 'Business Growth & Scaling', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                if (selectedGoals.includes(id)) {
                  setSelectedGoals(selectedGoals.filter(g => g !== id));
                } else {
                  setSelectedGoals([...selectedGoals, id]);
                }
              }}
              className={`w-full p-4 rounded-lg border transition-colors text-left flex items-center ${
                selectedGoals.includes(id)
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-zinc-700 hover:border-zinc-600 text-zinc-300'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
              {selectedGoals.includes(id) && (
                <CheckCircle className="w-5 h-5 ml-auto text-blue-400" />
              )}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Your Industry Focus",
      description: "Select your primary industry to customize recommendations",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            'Technology', 'E-commerce', 'Healthcare', 'Finance',
            'Education', 'Real Estate', 'Marketing', 'Consulting',
            'Media', 'Non-profit', 'Manufacturing', 'Other'
          ].map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`p-3 rounded-lg border transition-colors ${
                selectedIndustry === industry
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-zinc-700 hover:border-zinc-600 text-zinc-300'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Your Dashboard Overview",
      description: "Here's what you'll find in your personalized dashboard",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                AI Tools
              </h3>
              <p className="text-zinc-400 text-sm">
                Access content generation, automation, and optimization tools
              </p>
            </div>
            
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Analytics
              </h3>
              <p className="text-zinc-400 text-sm">
                Track performance, usage, and business insights
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Play className="w-5 h-5 mr-2 text-blue-400" />
              <span className="text-white font-semibold">Quick Start Tip</span>
            </div>
            <p className="text-zinc-300 text-sm">
              Start with the NOVUS Protocol to optimize your first AI prompts, then explore the Content Spawner for automated content creation.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save onboarding preferences
      await apiPost('/api/users/onboarding', {
        goals: selectedGoals,
        industry: selectedIndustry,
        completed: true,
      });

      toast.success('Welcome aboard!', 'Your account is now fully set up');
      onComplete();
    } catch (error) {
      console.error('Failed to save onboarding preferences:', error);
      // Still complete onboarding even if preferences fail to save
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-zinc-400 text-sm mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <OnboardingStep
            key={currentStep}
            step={currentStep + 1}
            title={steps[currentStep].title}
            description={steps[currentStep].description}
            content={steps[currentStep].content}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={onSkip}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}