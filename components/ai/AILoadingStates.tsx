'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  Brain, 
  Sparkles, 
  Zap,
  Wand2,
  Bot,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AILoadingProps {
  variant?: 'default' | 'brain' | 'sparkles' | 'wand' | 'bot';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  submessage?: string;
  progress?: number;
  estimatedTime?: string;
}

export function AILoading({ 
  variant = 'default', 
  size = 'md', 
  message = 'AI is thinking...',
  submessage,
  progress,
  estimatedTime
}: AILoadingProps) {
  const icons = {
    default: Loader2,
    brain: Brain,
    sparkles: Sparkles,
    wand: Wand2,
    bot: Bot
  };

  const Icon = icons[variant];

  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-sm' },
    md: { icon: 'w-10 h-10', text: 'text-base' },
    lg: { icon: 'w-16 h-16', text: 'text-lg' }
  };

  const sizeClasses = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-4"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30" />
          <div className="relative p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
            <Icon className={`${sizeClasses.icon} text-blue-400 ${variant === 'default' ? 'animate-spin' : ''}`} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className={`font-semibold text-white ${sizeClasses.text}`}>
          {message}
        </h3>
        
        {submessage && (
          <p className="text-zinc-400 text-sm max-w-md">
            {submessage}
          </p>
        )}

        {estimatedTime && (
          <div className="flex items-center justify-center space-x-2 text-zinc-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Est. {estimatedTime}</span>
          </div>
        )}

        {progress !== undefined && (
          <div className="w-64 mx-auto mt-4">
            <div className="flex justify-between text-sm text-zinc-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface ProcessingStageProps {
  stages: Array<{
    id: string;
    label: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>;
  currentStage?: string;
}

export function AIProcessingStages({ stages, currentStage }: ProcessingStageProps) {
  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing': return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <div className="w-5 h-5 border-2 border-zinc-600 rounded-full" />;
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Processing Steps</h3>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center justify-center">
                {getStageIcon(stage.status)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className={`font-medium ${getStageColor(stage.status)}`}>
                    {stage.label}
                  </p>
                  {currentStage === stage.id && stage.status === 'processing' && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                  )}
                </div>
                
                {index < stages.length - 1 && (
                  <div className="mt-2 w-px h-6 bg-zinc-700 ml-2" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface AITypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function AITypingEffect({ 
  text, 
  speed = 30, 
  className = '', 
  onComplete 
}: AITypingEffectProps) {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block ml-1 w-0.5 h-5 bg-blue-400"
        />
      )}
    </div>
  );
}

// Usage example components
export function GenerationLoadingExample() {
  const stages = [
    { id: '1', label: 'Analyzing input parameters', status: 'completed' as const },
    { id: '2', label: 'Processing with AI model', status: 'processing' as const },
    { id: '3', label: 'Optimizing output', status: 'pending' as const },
    { id: '4', label: 'Finalizing results', status: 'pending' as const }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <AILoading 
          variant="brain"
          size="lg"
          message="Generating with AI..."
          submessage="Our advanced AI is crafting the perfect solution for your needs"
          progress={65}
          estimatedTime="2-3 minutes"
        />
      </div>
      
      <AIProcessingStages 
        stages={stages}
        currentStage="2"
      />
    </div>
  );
}