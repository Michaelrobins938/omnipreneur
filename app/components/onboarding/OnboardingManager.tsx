'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WelcomeTour from './WelcomeTour';
import OnboardingChecklist from './OnboardingChecklist';
import HelpSystem from './HelpSystem';

interface OnboardingManagerProps {
  children: React.ReactNode;
}

export default function OnboardingManager({ children }: OnboardingManagerProps) {
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    checkOnboardingStatus();
    
    // Handle URL params for help
    if (searchParams.get('help') === 'true') {
      setShowHelp(true);
    }
  }, [searchParams]);

  const checkOnboardingStatus = () => {
    const tourCompleted = localStorage.getItem('omnipreneur_tour_completed');
    const tourSkipped = localStorage.getItem('omnipreneur_tour_skipped');
    const lastLogin = localStorage.getItem('omnipreneur_last_login');
    const currentTime = Date.now();
    
    // Check if user is new (first visit or no recent activity)
    const isFirstVisit = !tourCompleted && !tourSkipped;
    const hasRecentActivity = lastLogin && (currentTime - parseInt(lastLogin)) < 7 * 24 * 60 * 60 * 1000; // 7 days
    
    setIsNewUser(isFirstVisit);
    
    // Auto-show tour for new users
    if (isFirstVisit) {
      setTimeout(() => setShowWelcomeTour(true), 1000);
    }
    
    // Auto-show checklist for users who haven't completed onboarding
    if (!hasRecentActivity || isFirstVisit) {
      setTimeout(() => setShowChecklist(true), isFirstVisit ? 3000 : 1000);
    }
    
    // Update last login
    localStorage.setItem('omnipreneur_last_login', currentTime.toString());
  };

  const handleTourComplete = () => {
    setShowWelcomeTour(false);
    
    // Show checklist after tour completion
    setTimeout(() => {
      setShowChecklist(true);
    }, 500);
  };

  const handleChecklistItemComplete = (itemId: string) => {
    // Track completion analytics
    console.log(`Onboarding item completed: ${itemId}`);
    
    // You could send analytics events here
    // analytics.track('onboarding_step_completed', { step: itemId });
  };

  // Global help trigger function that can be called from anywhere
  useEffect(() => {
    const showHelpHandler = (event: CustomEvent) => {
      setShowHelp(true);
    };

    window.addEventListener('show-help' as any, showHelpHandler);
    
    return () => {
      window.removeEventListener('show-help' as any, showHelpHandler);
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Welcome Tour */}
      <WelcomeTour
        isOpen={showWelcomeTour}
        onClose={() => setShowWelcomeTour(false)}
        onComplete={handleTourComplete}
      />
      
      {/* Onboarding Checklist */}
      <OnboardingChecklist
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        onItemComplete={handleChecklistItemComplete}
      />
      
      {/* Help System */}
      <HelpSystem
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        defaultQuery={searchParams.get('help-query') || ''}
      />
      
      {/* Global Help Button - Fixed position */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
        title="Get Help"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </button>
      
      {/* Floating Checklist Toggle - Only show for new users or incomplete onboarding */}
      {(isNewUser || showChecklist) && (
        <button
          onClick={() => setShowChecklist(!showChecklist)}
          className="fixed bottom-24 right-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
          title="Getting Started Checklist"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </button>
      )}
    </>
  );
}