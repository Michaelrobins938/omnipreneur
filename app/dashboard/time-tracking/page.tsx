// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause,
  Square,
  Plus,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Focus,
  Coffee,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Zap,
  Timer,
  Award,
  Settings
} from 'lucide-react';

interface TimeEntry {
  id: string;
  category: 'development' | 'design' | 'marketing' | 'meetings' | 'research' | 'admin';
  description: string;
  duration: number; // seconds
  startTime: string;
  endTime: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
}

interface ProductivityInsights {
  focusScore: number;
  distractionLevel: number;
  energyPattern: {
    peak: string;
    lowest: string;
    optimal: string[];
  };
  recommendations: Array<{
    type: 'schedule' | 'workflow' | 'break' | 'environment';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  patterns: {
    mostProductiveHour: number;
    averageSessionLength: number;
    breakFrequency: number;
    taskSwitching: number;
  };
}

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsed: number;
  currentEntry: Partial<TimeEntry> | null;
}

export default function TimeTrackingDashboard() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    currentEntry: null
  });
  const [insights, setInsights] = useState<ProductivityInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // New entry form
  const [newEntry, setNewEntry] = useState({
    category: 'development' as const,
    description: '',
    duration: '',
    projectId: '',
    tags: ''
  });

  const fetchTimeEntries = async () => {
    try {
      setLoading(true);
      
      // Mock data since we'd normally fetch from /api/time-tracking/entries
      const mockEntries: TimeEntry[] = [
        {
          id: '1',
          category: 'development',
          description: 'Implemented user authentication',
          duration: 7200, // 2 hours
          startTime: '2024-02-10T09:00:00Z',
          endTime: '2024-02-10T11:00:00Z',
          projectId: 'web-app',
          tags: ['react', 'auth', 'frontend'],
          createdAt: '2024-02-10T11:00:00Z'
        },
        {
          id: '2',
          category: 'design',
          description: 'Created wireframes for dashboard',
          duration: 5400, // 1.5 hours
          startTime: '2024-02-10T14:00:00Z',
          endTime: '2024-02-10T15:30:00Z',
          projectId: 'web-app',
          tags: ['figma', 'wireframes', 'ui'],
          createdAt: '2024-02-10T15:30:00Z'
        },
        {
          id: '3',
          category: 'meetings',
          description: 'Team standup and sprint planning',
          duration: 3600, // 1 hour
          startTime: '2024-02-09T10:00:00Z',
          endTime: '2024-02-09T11:00:00Z',
          tags: ['standup', 'planning'],
          createdAt: '2024-02-09T11:00:00Z'
        },
        {
          id: '4',
          category: 'development',
          description: 'Bug fixes and code review',
          duration: 4500, // 1.25 hours
          startTime: '2024-02-09T15:00:00Z',
          endTime: '2024-02-09T16:15:00Z',
          projectId: 'web-app',
          tags: ['bugs', 'review', 'debugging'],
          createdAt: '2024-02-09T16:15:00Z'
        },
        {
          id: '5',
          category: 'research',
          description: 'Researched new UI frameworks',
          duration: 6300, // 1.75 hours
          startTime: '2024-02-08T13:00:00Z',
          endTime: '2024-02-08T14:45:00Z',
          tags: ['research', 'frameworks', 'evaluation'],
          createdAt: '2024-02-08T14:45:00Z'
        }
      ];

      setEntries(mockEntries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load time entries');
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      setInsightsLoading(true);
      
      // Mock AI insights response
      const mockInsights: ProductivityInsights = {
        focusScore: 78,
        distractionLevel: 22,
        energyPattern: {
          peak: 'Morning (9-11 AM)',
          lowest: 'Mid-afternoon (2-3 PM)',
          optimal: ['9:00 AM', '10:30 AM', '2:30 PM', '4:00 PM']
        },
        recommendations: [
          {
            type: 'schedule',
            title: 'Optimize Deep Work Hours',
            description: 'Schedule complex development tasks during your peak focus hours (9-11 AM) when you show 85% higher productivity.',
            impact: 'high'
          },
          {
            type: 'break',
            title: 'Strategic Break Timing',
            description: 'Take a 15-minute break every 90 minutes to maintain focus. Your current 2-hour sessions show 30% productivity decline after 90 minutes.',
            impact: 'high'
          },
          {
            type: 'workflow',
            title: 'Batch Similar Tasks',
            description: 'Group design tasks together and development tasks together. Task switching is reducing your efficiency by 23%.',
            impact: 'medium'
          },
          {
            type: 'environment',
            title: 'Meeting Consolidation',
            description: 'Consolidate meetings to 2-3 blocks per week instead of daily interruptions. This could increase deep work time by 40%.',
            impact: 'high'
          }
        ],
        patterns: {
          mostProductiveHour: 10,
          averageSessionLength: 105, // minutes
          breakFrequency: 3.2, // hours between breaks
          taskSwitching: 12 // times per day
        }
      };

      setInsights(mockInsights);
    } catch (err) {
      setError('Failed to generate AI insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  const startTimer = (category: string, description: string) => {
    const now = Date.now();
    setTimer({
      isRunning: true,
      startTime: now,
      elapsed: 0,
      currentEntry: {
        category: category as any,
        description,
        startTime: new Date(now).toISOString(),
        tags: []
      }
    });
  };

  const pauseTimer = () => {
    if (timer.isRunning && timer.startTime) {
      setTimer(prev => ({
        ...prev,
        isRunning: false,
        elapsed: prev.elapsed + (Date.now() - (prev.startTime || 0))
      }));
    }
  };

  const resumeTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      startTime: Date.now()
    }));
  };

  const stopTimer = async () => {
    if (timer.currentEntry && (timer.isRunning || timer.elapsed > 0)) {
      const totalElapsed = timer.elapsed + (timer.isRunning && timer.startTime ? Date.now() - timer.startTime : 0);
      
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        category: timer.currentEntry.category as any,
        description: timer.currentEntry.description || 'Untitled task',
        duration: Math.round(totalElapsed / 1000),
        startTime: timer.currentEntry.startTime || new Date().toISOString(),
        endTime: new Date().toISOString(),
        projectId: timer.currentEntry.projectId,
        tags: timer.currentEntry.tags || [],
        createdAt: new Date().toISOString()
      };

      // In real implementation, would call:
      // await fetch('/api/time-tracking/entries', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(newEntry)
      // });

      setEntries(prev => [newEntry, ...prev]);
      setTimer({
        isRunning: false,
        startTime: null,
        elapsed: 0,
        currentEntry: null
      });
    }
  };

  const createManualEntry = async () => {
    try {
      if (!newEntry.description || !newEntry.duration) {
        setError('Please fill in description and duration');
        return;
      }

      const entry: TimeEntry = {
        id: Date.now().toString(),
        category: newEntry.category,
        description: newEntry.description,
        duration: parseInt(newEntry.duration) * 60, // convert minutes to seconds
        startTime: new Date(Date.now() - parseInt(newEntry.duration) * 60 * 1000).toISOString(),
        endTime: new Date().toISOString(),
        projectId: newEntry.projectId || undefined,
        tags: newEntry.tags.split(',').map(t => t.trim()).filter(t => t),
        createdAt: new Date().toISOString()
      };

      setEntries(prev => [entry, ...prev]);
      setNewEntry({
        category: 'development',
        description: '',
        duration: '',
        projectId: '',
        tags: ''
      });
      setShowNewEntry(false);
      setError(null);
    } catch (err) {
      setError('Failed to create time entry');
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsed: prev.elapsed + (prev.startTime ? Date.now() - prev.startTime : 0),
          startTime: Date.now()
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning]);

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getCurrentTimerDisplay = () => {
    if (!timer.isRunning && timer.elapsed === 0) return '00:00:00';
    const totalElapsed = timer.elapsed + (timer.isRunning && timer.startTime ? Date.now() - timer.startTime : 0);
    const hours = Math.floor(totalElapsed / 3600000);
    const minutes = Math.floor((totalElapsed % 3600000) / 60000);
    const seconds = Math.floor((totalElapsed % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development': return '💻';
      case 'design': return '🎨';
      case 'marketing': return '📈';
      case 'meetings': return '👥';
      case 'research': return '🔍';
      case 'admin': return '📋';
      default: return '⏰';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'meetings': return 'bg-orange-100 text-orange-800';
      case 'research': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalTimeByCategory = () => {
    const categoryTotals = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.duration;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
      percentage: Math.round((total / entries.reduce((sum, e) => sum + e.duration, 0)) * 100)
    }));
  };

  const getRecentEntries = () => {
    return entries.slice(0, 10);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-slate-200 rounded-lg"></div>
                <div className="h-96 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-slate-200 rounded-lg"></div>
                <div className="h-64 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Tracking AI</h1>
            <p className="text-gray-600 mt-1">Track your time and get AI-powered productivity insights</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                setShowInsights(!showInsights);
                if (!showInsights) generateAIInsights();
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              AI Insights
            </Button>
            <Button 
              onClick={() => setShowNewEntry(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Widget */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold mb-4">
                    {getCurrentTimerDisplay()}
                  </div>
                  
                  {timer.currentEntry && (
                    <div className="text-blue-100 mb-4">
                      <div className="text-lg">{timer.currentEntry.description}</div>
                      <div className="text-sm opacity-80 capitalize">
                        {getCategoryIcon(timer.currentEntry.category || 'development')} {timer.currentEntry.category}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    {!timer.isRunning && timer.elapsed === 0 ? (
                      <Button
                        onClick={() => {
                          const category = prompt('Category (development/design/marketing/meetings/research/admin):') || 'development';
                          const description = prompt('What are you working on?') || 'New task';
                          startTimer(category, description);
                        }}
                        className="bg-white text-blue-600 hover:bg-blue-50"
                        size="lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Timer
                      </Button>
                    ) : (
                      <>
                        {timer.isRunning ? (
                          <Button
                            onClick={pauseTimer}
                            className="bg-white text-orange-600 hover:bg-orange-50"
                            size="lg"
                          >
                            <Pause className="h-5 w-5 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button
                            onClick={resumeTimer}
                            className="bg-white text-green-600 hover:bg-green-50"
                            size="lg"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Resume
                          </Button>
                        )}
                        <Button
                          onClick={stopTimer}
                          className="bg-white text-red-600 hover:bg-red-50"
                          size="lg"
                        >
                          <Square className="h-5 w-5 mr-2" />
                          Stop & Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Panel */}
            {showInsights && insights && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    AI Productivity Insights
                  </CardTitle>
                  <CardDescription>
                    AI analysis of your work patterns and productivity recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {insightsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-green-200 rounded w-3/4"></div>
                      <div className="h-20 bg-green-200 rounded"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Focus & Energy Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center bg-white p-4 rounded-lg border">
                          <div className="text-2xl font-bold text-green-600">{insights.focusScore}%</div>
                          <div className="text-sm text-gray-500">Focus Score</div>
                        </div>
                        <div className="text-center bg-white p-4 rounded-lg border">
                          <div className="text-2xl font-bold text-orange-600">{insights.distractionLevel}%</div>
                          <div className="text-sm text-gray-500">Distraction Level</div>
                        </div>
                        <div className="text-center bg-white p-4 rounded-lg border">
                          <div className="text-2xl font-bold text-blue-600">{insights.patterns.averageSessionLength}m</div>
                          <div className="text-sm text-gray-500">Avg Session</div>
                        </div>
                      </div>

                      {/* Energy Pattern */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Energy Pattern Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Peak Energy:</span>
                            <div className="font-medium text-green-600">{insights.energyPattern.peak}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Lowest Energy:</span>
                            <div className="font-medium text-orange-600">{insights.energyPattern.lowest}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Most Productive:</span>
                            <div className="font-medium text-blue-600">{insights.patterns.mostProductiveHour}:00 AM</div>
                          </div>
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          AI Recommendations
                        </h4>
                        <div className="space-y-3">
                          {insights.recommendations.map((rec, index) => (
                            <div key={index} className="bg-white border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {rec.type}
                                    </Badge>
                                    <Badge 
                                      variant="outline"
                                      className={`text-xs ${
                                        rec.impact === 'high' ? 'border-green-400 text-green-600' :
                                        rec.impact === 'medium' ? 'border-orange-400 text-orange-600' :
                                        'border-blue-400 text-blue-600'
                                      }`}
                                    >
                                      {rec.impact} impact
                                    </Badge>
                                  </div>
                                  <h5 className="font-medium mb-1">{rec.title}</h5>
                                  <p className="text-sm text-gray-600">{rec.description}</p>
                                </div>
                                <Button size="sm" variant="outline" className="ml-4">
                                  Apply
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Time Entries</CardTitle>
                <CardDescription>Your latest tracked activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentEntries().map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{getCategoryIcon(entry.category)}</div>
                        <div className="flex-1">
                          <div className="font-medium">{entry.description}</div>
                          <div className="text-sm text-gray-500">
                            <Badge className={`text-xs mr-2 ${getCategoryColor(entry.category)}`}>
                              {entry.category}
                            </Badge>
                            {new Date(entry.createdAt).toLocaleDateString()}
                            {entry.tags.length > 0 && (
                              <span className="ml-2">
                                {entry.tags.map((tag, i) => (
                                  <span key={i} className="text-blue-600">#{tag} </span>
                                ))}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatDuration(entry.duration)}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatDuration(entries.reduce((sum, e) => sum + e.duration, 0))}
                    </div>
                    <div className="text-sm text-gray-500">Total Tracked</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Productive Hours:</span>
                      <span className="font-medium">6.5h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sessions:</span>
                      <span className="font-medium">{entries.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Session:</span>
                      <span className="font-medium">
                        {entries.length > 0 ? formatDuration(entries.reduce((sum, e) => sum + e.duration, 0) / entries.length) : '0m'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Time by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTotalTimeByCategory().map((cat) => (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 capitalize">
                          {getCategoryIcon(cat.category)} {cat.category}
                        </span>
                        <span className="font-medium">{formatDuration(cat.total)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            cat.category === 'development' ? 'bg-blue-500' :
                            cat.category === 'design' ? 'bg-purple-500' :
                            cat.category === 'marketing' ? 'bg-green-500' :
                            cat.category === 'meetings' ? 'bg-orange-500' :
                            cat.category === 'research' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">{cat.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { category: 'development', label: 'Development', icon: '💻' },
                    { category: 'design', label: 'Design Work', icon: '🎨' },
                    { category: 'meetings', label: 'Meeting', icon: '👥' },
                    { category: 'research', label: 'Research', icon: '🔍' }
                  ].map((item) => (
                    <Button
                      key={item.category}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        const description = prompt(`What ${item.label.toLowerCase()} are you working on?`) || `${item.label} task`;
                        startTimer(item.category, description);
                      }}
                    >
                      <span className="mr-2">{item.icon}</span>
                      Start {item.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Manual Entry Modal */}
        {showNewEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Time Entry</CardTitle>
                <CardDescription>Manually log a completed task</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select
                    value={newEntry.category}
                    onValueChange={(value) => setNewEntry({ ...newEntry, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">💻 Development</SelectItem>
                      <SelectItem value="design">🎨 Design</SelectItem>
                      <SelectItem value="marketing">📈 Marketing</SelectItem>
                      <SelectItem value="meetings">👥 Meetings</SelectItem>
                      <SelectItem value="research">🔍 Research</SelectItem>
                      <SelectItem value="admin">📋 Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    placeholder="What did you work on?"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={newEntry.duration}
                    onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <Input
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                    placeholder="react, frontend, feature"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowNewEntry(false);
                      setError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createManualEntry}>
                    Add Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}