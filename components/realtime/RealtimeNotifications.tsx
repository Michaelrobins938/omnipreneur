'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle,
  Bell,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealtimeNotificationSystem } from './WebSocketProvider';

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function RealtimeNotifications() {
  const { notifications, removeNotification } = useRealtimeNotificationSystem();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500 bg-green-900/20';
      case 'warning': return 'border-yellow-500 bg-yellow-900/20';
      case 'error': return 'border-red-500 bg-red-900/20';
      default: return 'border-blue-500 bg-blue-900/20';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className={`mb-3 p-4 rounded-lg border backdrop-blur-sm ${getColors(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-zinc-300 mt-1">
                      {notification.message}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="ml-2 h-6 w-6 p-0 hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span className="text-xs text-zinc-400">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  
                  {notification.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={notification.action.onClick}
                      className="h-6 text-xs"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Notification bell with count
export function NotificationBell() {
  const { notifications } = useRealtimeNotificationSystem();
  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-xs text-white font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}

// Live activity feed
export function LiveActivityFeed() {
  const activities = useRealtimeData('activity_feed');

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
        Live Activity
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {activities?.map((activity: any) => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center space-x-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="flex-1">
                <p className="text-sm text-white">{activity.description}</p>
                <p className="text-xs text-zinc-400">
                  {formatTimeAgo(new Date(activity.timestamp))}
                </p>
              </div>
              {activity.type === 'ai_generation' && (
                <Zap className="w-4 h-4 text-purple-400" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {(!activities || activities.length === 0) && (
          <div className="text-center py-8 text-zinc-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Status indicator for different system components
export function SystemStatusIndicators() {
  const systemHealth = useRealtimeData('system_status');

  const services = [
    { id: 'api', name: 'API', status: systemHealth?.api || 'unknown' },
    { id: 'database', name: 'Database', status: systemHealth?.database || 'unknown' },
    { id: 'ai_services', name: 'AI Services', status: systemHealth?.ai_services || 'unknown' },
    { id: 'payments', name: 'Payments', status: systemHealth?.payments || 'unknown' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {services.map((service) => (
        <motion.div
          key={service.id}
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center"
        >
          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${getStatusColor(service.status)}`} />
          <h4 className="text-sm font-medium text-white">{service.name}</h4>
          <p className="text-xs text-zinc-400 capitalize">{service.status}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(timestamp: Date) {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return timestamp.toLocaleDateString();
}

// Import useRealtimeData hook (you may need to adjust the import path)
function useRealtimeData(eventType: string) {
  // This would be imported from your WebSocketProvider
  // import { useRealtimeData } from './WebSocketProvider';
  return null; // Placeholder
}