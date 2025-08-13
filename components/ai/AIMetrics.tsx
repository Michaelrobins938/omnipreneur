'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Clock,
  Zap,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Brain,
  BarChart3,
  DollarSign,
  Users,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricData {
  value: number | string;
  label: string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percentage' | 'duration' | 'text';
  target?: number;
  status?: 'good' | 'warning' | 'critical';
}

interface AIMetricCardProps {
  metric: MetricData;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'minimal';
  className?: string;
}

export function AIMetricCard({ 
  metric, 
  icon, 
  size = 'md', 
  variant = 'default',
  className = '' 
}: AIMetricCardProps) {
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'duration':
        return `${value}ms`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const getTrendIcon = () => {
    if (!metric.change) return null;
    
    if (metric.trend === 'up' || (metric.trend === undefined && metric.change > 0)) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    } else if (metric.trend === 'down' || (metric.trend === undefined && metric.change < 0)) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return <Activity className="w-4 h-4 text-zinc-400" />;
  };

  const getTrendColor = () => {
    if (!metric.change) return 'text-zinc-400';
    
    if (metric.trend === 'up' || (metric.trend === undefined && metric.change > 0)) {
      return 'text-green-400';
    } else if (metric.trend === 'down' || (metric.trend === undefined && metric.change < 0)) {
      return 'text-red-400';
    }
    return 'text-zinc-400';
  };

  const getStatusColor = () => {
    switch (metric.status) {
      case 'good': return 'border-green-500/30 bg-green-900/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-900/10';
      case 'critical': return 'border-red-500/30 bg-red-900/10';
      default: return '';
    }
  };

  const sizes = {
    sm: { value: 'text-xl', icon: 'w-5 h-5', padding: 'p-4' },
    md: { value: 'text-2xl', icon: 'w-6 h-6', padding: 'p-6' },
    lg: { value: 'text-3xl', icon: 'w-8 h-8', padding: 'p-8' }
  };

  const sizeClasses = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={`${variant === 'gradient' ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' : ''} ${getStatusColor()}`}>
        <CardContent className={sizeClasses.padding}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {icon && (
                  <div className={`p-2 rounded-lg ${
                    variant === 'gradient' 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                      : 'bg-zinc-800/50'
                  }`}>
                    {React.cloneElement(icon as React.ReactElement, { 
                      className: sizeClasses.icon 
                    })}
                  </div>
                )}
                <h3 className="text-sm font-medium text-zinc-400">{metric.label}</h3>
              </div>
              
              <div className="space-y-1">
                <p className={`font-bold text-white ${sizeClasses.value}`}>
                  {formatValue(metric.value, metric.format)}
                </p>
                
                {metric.change !== undefined && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon()}
                    <span className={`text-sm font-medium ${getTrendColor()}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}
                      {metric.format === 'percentage' ? 'pp' : '%'}
                    </span>
                    {metric.changeLabel && (
                      <span className="text-xs text-zinc-400">{metric.changeLabel}</span>
                    )}
                  </div>
                )}
                
                {metric.target && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Progress to target</span>
                      <span>{Math.round((Number(metric.value) / metric.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((Number(metric.value) / metric.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {metric.status && (
              <div className="ml-2">
                {metric.status === 'good' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {metric.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                {metric.status === 'critical' && <AlertTriangle className="w-5 h-5 text-red-400" />}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface AIMetricsGridProps {
  metrics: Array<MetricData & { id: string; icon?: React.ReactNode }>;
  title?: string;
  description?: string;
  layout?: 'grid' | 'row';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AIMetricsGrid({ 
  metrics, 
  title, 
  description,
  layout = 'grid',
  size = 'md',
  className = '' 
}: AIMetricsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  const getGridClass = () => {
    if (layout === 'row') return 'flex flex-wrap gap-4';
    return `grid gap-6 ${gridCols[Math.min(metrics.length, 6) as keyof typeof gridCols]}`;
  };

  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>}
          {description && <p className="text-zinc-400">{description}</p>}
        </div>
      )}
      
      <div className={getGridClass()}>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AIMetricCard
              metric={metric}
              icon={metric.icon}
              size={size}
              variant={index % 3 === 0 ? 'gradient' : 'default'}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Specialized AI Performance Dashboard
interface AIPerformanceMetrics {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  tokensUsed: number;
  costThisMonth: number;
  topModel: string;
  errorRate: number;
  uptime: number;
}

interface AIPerformanceDashboardProps {
  data: AIPerformanceMetrics;
  timeframe?: string;
  className?: string;
}

export function AIPerformanceDashboard({ 
  data, 
  timeframe = 'Last 30 days',
  className = '' 
}: AIPerformanceDashboardProps) {
  const metrics = [
    {
      id: 'requests',
      value: data.totalRequests,
      label: 'Total Requests',
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      change: 12,
      changeLabel: timeframe,
      format: 'number' as const,
      status: 'good' as const
    },
    {
      id: 'success-rate',
      value: data.successRate,
      label: 'Success Rate',
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      change: 2.5,
      changeLabel: timeframe,
      format: 'percentage' as const,
      target: 95,
      status: data.successRate >= 95 ? 'good' as const : data.successRate >= 90 ? 'warning' as const : 'critical' as const
    },
    {
      id: 'response-time',
      value: data.avgResponseTime,
      label: 'Avg Response Time',
      icon: <Clock className="w-6 h-6 text-yellow-400" />,
      change: -5.2,
      changeLabel: timeframe,
      format: 'duration' as const,
      trend: 'up' as const, // Faster is better, so negative change is good
      status: data.avgResponseTime <= 2000 ? 'good' as const : data.avgResponseTime <= 5000 ? 'warning' as const : 'critical' as const
    },
    {
      id: 'cost',
      value: data.costThisMonth,
      label: 'Cost This Month',
      icon: <DollarSign className="w-6 h-6 text-green-400" />,
      change: 8.3,
      changeLabel: 'vs last month',
      format: 'currency' as const,
      target: 1000
    },
    {
      id: 'tokens',
      value: data.tokensUsed,
      label: 'Tokens Used',
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      change: 15.7,
      changeLabel: timeframe,
      format: 'number' as const
    },
    {
      id: 'uptime',
      value: data.uptime,
      label: 'System Uptime',
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      format: 'percentage' as const,
      target: 99.9,
      status: data.uptime >= 99.5 ? 'good' as const : data.uptime >= 99 ? 'warning' as const : 'critical' as const
    }
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Performance Metrics</h2>
          <p className="text-zinc-400">Real-time insights into your AI system performance</p>
        </div>
        <Badge variant="outline" className="text-blue-400 border-blue-500">
          <Sparkles className="w-3 h-3 mr-1" />
          Live Data
        </Badge>
      </div>

      <AIMetricsGrid 
        metrics={metrics}
        size="md"
      />

      {/* Additional Insights */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Model</CardTitle>
            <CardDescription>Most reliable AI model this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{data.topModel}</p>
                <p className="text-zinc-400 text-sm">Highest success rate and performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Overall platform status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Error Rate</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    data.errorRate <= 1 ? 'text-green-400' :
                    data.errorRate <= 5 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {data.errorRate}%
                  </span>
                  {data.errorRate <= 1 ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">API Health</span>
                <Badge className="text-green-400 bg-green-900/20">
                  All Systems Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Real-time metric updater hook
export function useAIMetrics(refreshInterval = 30000) {
  const [metrics, setMetrics] = React.useState<AIPerformanceMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/ai-metrics', { 
          credentials: 'include' 
        });
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch AI metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { metrics, loading };
}

// Example usage component
export function AIMetricsExample() {
  const { metrics, loading } = useAIMetrics();

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading AI metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <AIPerformanceDashboard 
      data={metrics}
      timeframe="Last 30 days"
    />
  );
}