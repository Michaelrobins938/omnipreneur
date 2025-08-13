'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  User,
  Brain,
  Eye,
  Settings,
  Crown,
  Sparkles,
  X
} from 'lucide-react';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: () => void;
  actionText?: string;
  points: number;
}

interface OnboardingChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  onItemComplete?: (itemId: string) => void;
  customItems?: ChecklistItem[];
}

const defaultItems: ChecklistItem[] = [
  {
    id: 'complete-profile',
    title: 'Complete Your Profile',
    description: 'Add your name, email, and preferences to personalize your experience.',
    icon: <User className="w-5 h-5" />,
    completed: false,
    action: () => window.location.href = '/dashboard/settings',
    actionText: 'Complete Profile',
    points: 100
  },
  {
    id: 'first-ai-interaction',
    title: 'Try Your First AI Tool',
    description: 'Experience the power of AI by trying NOVUS Protocol or Content Spawner.',
    icon: <Brain className="w-5 h-5" />,
    completed: false,
    action: () => window.location.href = '/products/novus-protocol',
    actionText: 'Try NOVUS Protocol',
    points: 200
  },
  {
    id: 'explore-dashboard',
    title: 'Explore the Dashboard',
    description: 'Familiarize yourself with all 26 AI products and their capabilities.',
    icon: <Eye className="w-5 h-5" />,
    completed: false,
    action: () => {
      const element = document.querySelector('.dashboard-products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    actionText: 'View Products',
    points: 150
  },
  {
    id: 'customize-settings',
    title: 'Customize Your Settings',
    description: 'Set up notifications, preferences, and API access for optimal experience.',
    icon: <Settings className="w-5 h-5" />,
    completed: false,
    action: () => window.location.href = '/dashboard/settings',
    actionText: 'Open Settings',
    points: 100
  },
  {
    id: 'upgrade-subscription',
    title: 'Explore Premium Features',
    description: 'Unlock advanced AI capabilities with a Pro or Enterprise subscription.',
    icon: <Crown className="w-5 h-5" />,
    completed: false,
    action: () => window.location.href = '/pricing',
    actionText: 'View Plans',
    points: 300
  }
];

export default function OnboardingChecklist({ 
  isOpen, 
  onClose, 
  onItemComplete,
  customItems = defaultItems 
}: OnboardingChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(customItems);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Load completion status from localStorage
    const loadProgress = () => {
      const savedProgress = localStorage.getItem('omnipreneur_onboarding_progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setItems(prev => prev.map(item => ({
          ...item,
          completed: progress[item.id] || false
        })));
      }
    };

    loadProgress();
  }, []);

  const completeItem = (itemId: string) => {
    setItems(prev => {
      const updated = prev.map(item => 
        item.id === itemId ? { ...item, completed: true } : item
      );
      
      // Save progress to localStorage
      const progress = updated.reduce((acc, item) => {
        acc[item.id] = item.completed;
        return acc;
      }, {} as Record<string, boolean>);
      
      localStorage.setItem('omnipreneur_onboarding_progress', JSON.stringify(progress));
      
      return updated;
    });

    onItemComplete?.(itemId);
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalPoints = items.filter(item => item.completed).reduce((sum, item) => sum + item.points, 0);
  const maxPoints = items.reduce((sum, item) => sum + item.points, 0);
  const progressPercentage = (completedCount / items.length) * 100;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-20 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-zinc-200 z-50 max-h-[calc(100vh-6rem)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Getting Started</h3>
              <p className="text-sm text-zinc-500">
                {completedCount}/{items.length} completed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-600">Progress</span>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600 font-medium">{totalPoints}</span>
              <span className="text-zinc-400">/ {maxPoints} XP</span>
            </div>
          </div>
          <div className="bg-zinc-100 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Completion celebration */}
        {completedCount === items.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="text-green-900 font-semibold">Congratulations! 🎉</h4>
                <p className="text-green-700 text-sm">You've completed all onboarding tasks!</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Checklist Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => !item.completed && completeItem(item.id)}
                      className={`mt-0.5 transition-colors ${
                        item.completed
                          ? 'text-green-600'
                          : 'text-zinc-400 hover:text-purple-500'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`${item.completed ? 'text-green-600' : 'text-purple-500'}`}>
                          {item.icon}
                        </div>
                        <h4 className={`font-medium ${
                          item.completed ? 'text-green-900 line-through' : 'text-zinc-900'
                        }`}>
                          {item.title}
                        </h4>
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          +{item.points} XP
                        </span>
                      </div>
                      <p className={`text-sm ${
                        item.completed ? 'text-green-700' : 'text-zinc-600'
                      }`}>
                        {item.description}
                      </p>

                      {!item.completed && item.action && item.actionText && (
                        <button
                          onClick={item.action}
                          className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          {item.actionText} →
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {isExpanded && (
        <div className="p-6 border-t border-zinc-100 bg-zinc-50">
          <div className="text-center">
            <p className="text-sm text-zinc-600 mb-2">
              Need help? Check out our{' '}
              <a href="/docs" className="text-purple-600 hover:text-purple-700 font-medium">
                documentation
              </a>
            </p>
            {completedCount < items.length && (
              <p className="text-xs text-zinc-500">
                Complete all tasks to unlock your onboarding rewards!
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}