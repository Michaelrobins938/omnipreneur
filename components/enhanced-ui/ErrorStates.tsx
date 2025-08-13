'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  XCircle,
  RefreshCw,
  Crown,
  CreditCard,
  Wifi,
  Server,
  Clock,
  Shield,
  Zap,
  ExternalLink,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  type: 'subscription' | 'usage_limit' | 'network' | 'server' | 'timeout' | 'generic';
  message?: string;
  details?: string;
  onRetry?: () => void;
  onUpgrade?: () => void;
  onContact?: () => void;
}

const ErrorConfigs = {
  subscription: {
    icon: <Crown className="w-8 h-8 text-yellow-400" />,
    title: "Subscription Required",
    color: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/30",
    primaryAction: "Upgrade Now",
    actionIcon: <ArrowRight className="w-4 h-4" />
  },
  usage_limit: {
    icon: <Clock className="w-8 h-8 text-orange-400" />,
    title: "Usage Limit Reached",
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    primaryAction: "Upgrade Plan",
    actionIcon: <ArrowRight className="w-4 h-4" />
  },
  network: {
    icon: <Wifi className="w-8 h-8 text-blue-400" />,
    title: "Connection Error",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    primaryAction: "Retry",
    actionIcon: <RefreshCw className="w-4 h-4" />
  },
  server: {
    icon: <Server className="w-8 h-8 text-red-400" />,
    title: "Server Error",
    color: "from-red-500/20 to-pink-500/20",
    borderColor: "border-red-500/30",
    primaryAction: "Try Again",
    actionIcon: <RefreshCw className="w-4 h-4" />
  },
  timeout: {
    icon: <Clock className="w-8 h-8 text-purple-400" />,
    title: "Request Timeout",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    primaryAction: "Retry",
    actionIcon: <RefreshCw className="w-4 h-4" />
  },
  generic: {
    icon: <AlertTriangle className="w-8 h-8 text-zinc-400" />,
    title: "Something Went Wrong",
    color: "from-zinc-500/20 to-slate-500/20",
    borderColor: "border-zinc-500/30",
    primaryAction: "Try Again",
    actionIcon: <RefreshCw className="w-4 h-4" />
  }
};

const DefaultMessages = {
  subscription: "This AI feature requires an active subscription. Upgrade your plan to access advanced AI capabilities.",
  usage_limit: "You've reached your monthly AI usage limit. Upgrade your plan for unlimited access.",
  network: "Unable to connect to our servers. Please check your internet connection and try again.",
  server: "Our AI services are temporarily unavailable. We're working to resolve this issue quickly.",
  timeout: "The AI request took longer than expected. This might be due to high demand or complex processing.",
  generic: "An unexpected error occurred while processing your request. Please try again."
};

const Solutions = {
  subscription: [
    "Upgrade to Pro for unlimited AI content generation",
    "Access advanced features like viral scoring and platform optimization",
    "Get priority support and faster processing"
  ],
  usage_limit: [
    "Upgrade your plan for higher monthly limits",
    "Pro plan includes 10,000 AI requests per month",
    "Enterprise plan offers unlimited usage"
  ],
  network: [
    "Check your internet connection",
    "Try refreshing the page",
    "Disable any VPN or proxy if active"
  ],
  server: [
    "Our team has been notified and is working on a fix",
    "Try again in a few minutes",
    "Check our status page for updates"
  ],
  timeout: [
    "Try a simpler request with less content",
    "Wait a moment and retry",
    "Consider breaking large requests into smaller ones"
  ],
  generic: [
    "Refresh the page and try again",
    "Clear your browser cache if the issue persists",
    "Contact support if the problem continues"
  ]
};

export default function ErrorStates({ 
  type, 
  message, 
  details, 
  onRetry, 
  onUpgrade, 
  onContact 
}: ErrorStateProps) {
  const config = ErrorConfigs[type];
  const defaultMessage = message || DefaultMessages[type];
  const solutions = Solutions[type];

  const handlePrimaryAction = () => {
    if (type === 'subscription' || type === 'usage_limit') {
      onUpgrade?.();
    } else {
      onRetry?.();
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${config.color} ${config.borderColor} border-2`}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="p-4 bg-zinc-800/50 rounded-full">
              {config.icon}
            </div>
          </motion.div>

          {/* Error Title */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{config.title}</h3>
            <p className="text-zinc-300 max-w-md mx-auto">{defaultMessage}</p>
            
            {details && (
              <Alert className="mt-4 text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {details}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Solutions */}
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3">Suggested Solutions:</h4>
            <div className="space-y-2">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start space-x-2 text-left">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-zinc-300">{solution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handlePrimaryAction}
              className="flex items-center space-x-2"
              size="lg"
            >
              {config.actionIcon}
              <span>{config.primaryAction}</span>
            </Button>
            
            {onContact && (
              <Button 
                onClick={onContact}
                variant="outline"
                size="lg"
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Contact Support</span>
              </Button>
            )}
          </div>

          {/* Additional Info for Subscription Errors */}
          {(type === 'subscription' || type === 'usage_limit') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="flex flex-col items-center space-y-2 p-3 bg-zinc-800/30 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-zinc-300">Unlimited AI</span>
                <Badge variant="secondary" size="sm">Pro Plan</Badge>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-3 bg-zinc-800/30 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-zinc-300">Priority Support</span>
                <Badge variant="secondary" size="sm">Included</Badge>
              </div>
              
              <div className="flex flex-col items-center space-y-2 p-3 bg-zinc-800/30 rounded-lg">
                <Crown className="w-5 h-5 text-purple-400" />
                <span className="text-zinc-300">Advanced Features</span>
                <Badge variant="secondary" size="sm">Premium</Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Specific error components for common scenarios
export function SubscriptionRequiredError({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <ErrorStates 
      type="subscription" 
      onUpgrade={onUpgrade}
      message="This AI feature requires a premium subscription to access advanced capabilities."
    />
  );
}

export function UsageLimitError({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <ErrorStates 
      type="usage_limit" 
      onUpgrade={onUpgrade}
      message="You've reached your monthly AI usage limit. Upgrade for unlimited access."
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorStates 
      type="network" 
      onRetry={onRetry}
      message="Connection failed. Please check your internet connection."
    />
  );
}

export function ServerError({ onRetry, onContact }: { onRetry?: () => void; onContact?: () => void }) {
  return (
    <ErrorStates 
      type="server" 
      onRetry={onRetry}
      onContact={onContact}
      message="Our AI services are temporarily down. We're working to fix this."
    />
  );
}

export function TimeoutError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorStates 
      type="timeout" 
      onRetry={onRetry}
      message="Request timed out. The AI is processing high demand right now."
    />
  );
}

export function GenericError({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <ErrorStates 
      type="generic" 
      onRetry={onRetry}
      message={message}
    />
  );
}