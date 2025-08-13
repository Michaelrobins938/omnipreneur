'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Package, 
  Search,
  Loader2,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
const Progress = (props: { value: number; className?: string }) => (
  <div className={props.className}>
    <div className="w-full bg-zinc-800 rounded h-2">
      <div className="bg-blue-500 h-2 rounded" style={{ width: `${props.value}%` }} />
    </div>
  </div>
);

interface LoadingStateProps {
  type: 'content' | 'rewrite' | 'bundle' | 'niche';
  message?: string;
  progress?: number;
  stage?: string;
}

const LoadingMessages = {
  content: {
    messages: [
      "Analyzing trending content patterns...",
      "Optimizing for platform algorithms...",
      "Calculating viral potential scores...",
      "Generating engagement hooks...",
      "Creating platform-specific optimizations...",
      "Finalizing content recommendations..."
    ],
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30"
  },
  rewrite: {
    messages: [
      "Analyzing original text structure...",
      "Calculating readability metrics...",
      "Enhancing clarity and flow...",
      "Generating alternative versions...",
      "Optimizing tone and engagement...",
      "Finalizing improvement analysis..."
    ],
    icon: <Brain className="w-8 h-8 text-blue-400" />,
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30"
  },
  bundle: {
    messages: [
      "Analyzing product complementarity...",
      "Calculating optimal pricing strategy...",
      "Generating marketing materials...",
      "Creating launch timeline...",
      "Optimizing bundle positioning...",
      "Finalizing strategy recommendations..."
    ],
    icon: <Package className="w-8 h-8 text-green-400" />,
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30"
  },
  niche: {
    messages: [
      "Researching market opportunities...",
      "Analyzing competition landscape...",
      "Calculating demand scores...",
      "Identifying keyword opportunities...",
      "Evaluating monetization potential...",
      "Generating strategic action plan..."
    ],
    icon: <Search className="w-8 h-8 text-orange-400" />,
    gradient: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30"
  }
};

export default function LoadingStates({ type, message, progress, stage }: LoadingStateProps) {
  const config = LoadingMessages[type];
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const [currentProgress, setCurrentProgress] = React.useState(progress || 0);

  React.useEffect(() => {
    if (!message) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % config.messages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [message, config.messages.length]);

  React.useEffect(() => {
    if (progress === undefined) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          const next = prev + Math.random() * 15;
          return next > 95 ? 95 : next;
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress]);

  const currentMessage = message || config.messages[currentMessageIndex];

  return (
    <Card className={`bg-gradient-to-br ${config.gradient} ${config.borderColor} border-2`}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: [0.8, 1.1, 1], 
              opacity: [0.5, 1, 0.8],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="flex justify-center"
          >
            <div className="p-4 bg-zinc-800/50 rounded-full">
              {config.icon}
            </div>
          </motion.div>

          {/* Loading Spinner */}
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-medium text-white"
            >
              {currentMessage}
            </motion.p>
            
            {stage && (
              <p className="text-sm text-zinc-400">
                Stage: {stage}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={currentProgress} className="h-2" />
            <p className="text-sm text-zinc-400">
              {Math.round(currentProgress)}% complete
            </p>
          </div>

          {/* AI Processing Indicators */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              className="flex flex-col items-center space-y-2"
            >
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-zinc-400">Processing</span>
            </motion.div>
            
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="flex flex-col items-center space-y-2"
            >
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-zinc-400">Analyzing</span>
            </motion.div>
            
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              className="flex flex-col items-center space-y-2"
            >
              <BarChart3 className="w-5 h-5 text-green-400" />
              <span className="text-xs text-zinc-400">Optimizing</span>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Specific loading components for each AI service
export function ContentGenerationLoading({ progress, stage }: { progress?: number; stage?: string }) {
  return <LoadingStates type="content" progress={progress} stage={stage} />;
}

export function AutoRewriteLoading({ progress, stage }: { progress?: number; stage?: string }) {
  return <LoadingStates type="rewrite" progress={progress} stage={stage} />;
}

export function BundleBuilderLoading({ progress, stage }: { progress?: number; stage?: string }) {
  return <LoadingStates type="bundle" progress={progress} stage={stage} />;
}

export function NicheDiscoveryLoading({ progress, stage }: { progress?: number; stage?: string }) {
  return <LoadingStates type="niche" progress={progress} stage={stage} />;
}