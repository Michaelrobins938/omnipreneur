import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

interface Metric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
}

interface Activity {
  id: string;
  action: string;
  amount: string;
  time: string;
  type: 'sale' | 'user' | 'payment' | 'report';
  status: 'completed' | 'pending' | 'failed';
}

export default function LiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('90D');

  // Demo data
  const demoMetrics: Metric[] = [
    {
      id: 'revenue',
      name: 'Total Revenue',
      value: 127432,
      change: 12.5,
      changeType: 'increase',
      icon: '💰',
      color: 'from-blue-500/10 to-blue-600/10 border-blue-500/20'
    },
    {
      id: 'conversions',
      name: 'Conversions',
      value: 2847,
      change: 8.2,
      changeType: 'increase',
      icon: '📈',
      color: 'from-green-500/10 to-green-600/10 border-green-500/20'
    },
    {
      id: 'users',
      name: 'Active Users',
      value: 15234,
      change: 5.7,
      changeType: 'increase',
      icon: '👥',
      color: 'from-purple-500/10 to-purple-600/10 border-purple-500/20'
    },
    {
      id: 'growth',
      name: 'Growth Rate',
      value: 23.4,
      change: 2.1,
      changeType: 'increase',
      icon: '🚀',
      color: 'from-orange-500/10 to-orange-600/10 border-orange-500/20'
    }
  ];

  const demoActivities: Activity[] = [
    {
      id: '1',
      action: 'New sale recorded',
      amount: '$2,450',
      time: '2 minutes ago',
      type: 'sale',
      status: 'completed'
    },
    {
      id: '2',
      action: 'User registration',
      amount: 'John Doe',
      time: '5 minutes ago',
      type: 'user',
      status: 'completed'
    },
    {
      id: '3',
      action: 'Payment processed',
      amount: '$1,200',
      time: '12 minutes ago',
      type: 'payment',
      status: 'completed'
    },
    {
      id: '4',
      action: 'Report generated',
      amount: 'Q4 Summary',
      time: '1 hour ago',
      type: 'report',
      status: 'completed'
    },
    {
      id: '5',
      action: 'Bundle Builder subscription',
      amount: '$197',
      time: '15 minutes ago',
      type: 'sale',
      status: 'completed'
    },
    {
      id: '6',
      action: 'Content Spawner purchase',
      amount: '$89',
      time: '25 minutes ago',
      type: 'sale',
      status: 'completed'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setMetrics(demoMetrics);
      setActivities(demoActivities);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity: Activity = {
          id: Date.now().toString(),
          action: 'New activity detected',
          amount: `$${Math.floor(Math.random() * 1000) + 100}`,
          time: 'Just now',
          type: 'sale',
          status: 'completed'
        };
        return [newActivity, ...prev.slice(0, 9)]; // Keep last 10
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleExportData = () => {
    const exportData = {
      metrics: metrics,
      activities: activities,
      timeRange: timeRange,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    // Simulate report generation
    alert('Report generation started. You will receive an email when ready.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sale': return '💰';
      case 'user': return '👤';
      case 'payment': return '💳';
      case 'report': return '📄';
      default: return '📊';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-green-500/20';
      case 'user': return 'bg-blue-500/20';
      case 'payment': return 'bg-purple-500/20';
      case 'report': return 'bg-orange-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  const formatValue = (value: number, type: string) => {
    if (type === 'revenue' || type === 'growth') {
      return type === 'revenue' ? `$${value.toLocaleString()}` : `${value}%`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-slate-800/20 opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Hero />
        
        {/* Navigation Tabs */}
        <div className="mt-12 mb-8">
          <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-700/50">
            {['overview', 'revenue', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-8">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700 rounded w-24"></div>
                      <div className="h-8 bg-slate-700 rounded w-32"></div>
                      <div className="h-3 bg-slate-700 rounded w-20"></div>
                    </div>
                    <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
                  </div>
                </Card>
              ))
            ) : (
              metrics.map((metric) => (
                <Card key={metric.id} className={`bg-gradient-to-br ${metric.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">{metric.name}</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {formatValue(metric.value, metric.id)}
                      </p>
                      <p className={`text-sm mt-1 ${
                        metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.changeType === 'increase' ? '+' : '-'}{metric.change}% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-slate-700/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{metric.icon}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Revenue Analytics</h3>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={timeRange === '7D' ? 'primary' : 'outline'}
                    onClick={() => setTimeRange('7D')}
                  >
                    7D
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeRange === '30D' ? 'primary' : 'outline'}
                    onClick={() => setTimeRange('30D')}
                  >
                    30D
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeRange === '90D' ? 'primary' : 'outline'}
                    onClick={() => setTimeRange('90D')}
                  >
                    90D
                  </Button>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-slate-400">Interactive chart for {timeRange}</p>
                  <p className="text-slate-500 text-sm">Real-time data visualization</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Revenue Trend</span>
                      <span className="text-green-400">+12.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Conversion Rate</span>
                      <span className="text-blue-400">8.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Avg. Order Value</span>
                      <span className="text-purple-400">$147</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleGenerateReport}
                >
                  <span className="mr-3">📊</span>
                  Generate Report
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={handleExportData}
                >
                  <span className="mr-3">📧</span>
                  Export Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-3">⚙️</span>
                  Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-3">🔔</span>
                  Notifications
                </Button>
              </div>

              {/* Real-time status */}
              <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">Live data streaming</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Last updated: Just now</p>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton for activities
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-32"></div>
                        <div className="h-3 bg-slate-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-700 rounded w-20"></div>
                  </div>
                ))
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeBgColor(item.type)}`}>
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.action}</p>
                        <p className="text-slate-400 text-sm">{item.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-sm">{item.time}</span>
                      <div className={`text-xs ${getStatusColor(item.status)} capitalize`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6">Top Performing Products</h3>
              <div className="space-y-4">
                {[
                  { name: 'Bundle Builder Pro', revenue: 45234, growth: 15.2 },
                  { name: 'Content Spawner', revenue: 28765, growth: 8.7 },
                  { name: 'AutoRewrite Engine', revenue: 19876, growth: 12.3 },
                  { name: 'Affiliate Portal', revenue: 14567, growth: 6.8 }
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-slate-400 text-sm">${product.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm">+{product.growth}%</p>
                      <p className="text-slate-500 text-xs">vs last month</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-white mb-6">System Health</h3>
              <div className="space-y-4">
                {[
                  { service: 'API Response Time', status: 'Healthy', value: '0.8s', color: 'green' },
                  { service: 'Database', status: 'Optimal', value: '99.9%', color: 'green' },
                  { service: 'CDN', status: 'Fast', value: '45ms', color: 'green' },
                  { service: 'AI Processing', status: 'Active', value: '2.1s', color: 'yellow' }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{service.service}</p>
                      <p className="text-slate-400 text-sm">{service.status}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${
                        service.color === 'green' ? 'text-green-400' : 
                        service.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {service.value}
                      </p>
                      <div className={`w-2 h-2 rounded-full ${
                        service.color === 'green' ? 'bg-green-400' : 
                        service.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 