"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  BarChart3, 
  Brain, 
  TrendingUp, 
  Calendar,
  Target,
  Activity,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Timer,
  Users,
  PieChart,
  AlertCircle,
  Coffee,
  Code,
  Briefcase,
  Mail,
  Video,
  FileText,
  Settings
} from 'lucide-react';

export default function TimeTrackingDemo() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('development');
  const [taskDescription, setTaskDescription] = useState('Building new feature components');
  const [aiInsights, setAiInsights] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [dailyStats, setDailyStats] = useState({
    totalTime: 21840, // 6h 4m
    focusTime: 18000, // 5h
    breaks: 3840, // 1h 4m
    productivity: 82
  });

  const categories = [
    { id: 'development', name: 'Development', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'meetings', name: 'Meetings', icon: Video, color: 'from-purple-500 to-pink-500' },
    { id: 'planning', name: 'Planning', icon: Briefcase, color: 'from-green-500 to-emerald-500' },
    { id: 'emails', name: 'Emails', icon: Mail, color: 'from-orange-500 to-red-500' },
    { id: 'research', name: 'Research', icon: FileText, color: 'from-indigo-500 to-purple-500' },
    { id: 'admin', name: 'Admin', icon: Settings, color: 'from-gray-500 to-zinc-500' }
  ];

  const processingStepsData = [
    { text: '🚀 Initializing AI Time Analysis Engine...', duration: 800 },
    { text: '📊 Analyzing productivity patterns...', duration: 1200 },
    { text: '🧠 Running deep learning activity detection...', duration: 1000 },
    { text: '⚡ Processing focus time optimization...', duration: 900 },
    { text: '🎯 Calculating efficiency metrics...', duration: 700 },
    { text: '📈 Generating predictive insights...', duration: 800 },
    { text: '✨ Creating personalized recommendations...', duration: 600 },
    { text: '🏆 Finalizing productivity report...', duration: 500 }
  ];

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeShort = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    setIsPaused(false);
    setShowAnalysis(false);
  };

  const handlePauseTracking = () => {
    setIsPaused(!isPaused);
  };

  const handleStopTracking = async () => {
    setIsTracking(false);
    setIsPaused(false);
    await runAIAnalysis();
  };

  const runAIAnalysis = async () => {
    setShowAnalysis(true);
    setProcessingSteps([]);
    setCurrentStep(0);

    // Simulate AI processing steps
    for (let i = 0; i < processingStepsData.length; i++) {
      setCurrentStep(i);
      setProcessingSteps(prev => [...prev, processingStepsData[i].text]);
      await new Promise(resolve => setTimeout(resolve, processingStepsData[i].duration));
    }

    // Generate AI insights
    const insights = [
      {
        type: 'productivity',
        title: 'Peak Productivity Window',
        description: 'Your most productive hours are 10 AM - 12 PM. Schedule complex tasks during this window.',
        improvement: '+23%',
        icon: TrendingUp
      },
      {
        type: 'focus',
        title: 'Focus Session Optimization',
        description: 'Extending focus sessions from 25 to 45 minutes could increase output by 30%.',
        improvement: '+30%',
        icon: Brain
      },
      {
        type: 'break',
        title: 'Break Pattern Analysis',
        description: 'You\'re taking breaks 15% less than optimal. Consider a 5-minute break every hour.',
        improvement: '+15%',
        icon: Coffee
      },
      {
        type: 'task',
        title: 'Task Switching Overhead',
        description: 'Reducing context switches by batching similar tasks could save 45 minutes daily.',
        improvement: '45m',
        icon: Zap
      }
    ];

    setAiInsights(insights);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/products/time-tracking-ai"
              className="flex items-center text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Time Tracking AI
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-zinc-500">Live Demo</span>
              <Link 
                href="/products/time-tracking-ai"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              >
                Get Full Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Time Tracking AI Live Demo
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Experience intelligent time tracking with AI-powered insights, automatic activity detection, 
              and real-time productivity analysis.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Time Tracker Panel */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Timer Display */}
                <div className="text-center mb-8">
                  <motion.div 
                    className="text-7xl font-mono font-bold text-white mb-2"
                    animate={{ scale: isTracking && !isPaused ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {formatTime(currentTime)}
                  </motion.div>
                  {isTracking && (
                    <motion.div 
                      className="flex items-center justify-center space-x-2 text-zinc-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">
                        {isPaused ? 'Paused' : 'Tracking Active'}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Task Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    What are you working on?
                  </label>
                  <input
                    type="text"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Enter task description..."
                  />
                </div>

                {/* Category Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Select Category
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <motion.button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            selectedCategory === category.id
                              ? 'border-blue-500/50 bg-blue-500/10'
                              : 'border-zinc-700 bg-zinc-800/40 hover:border-zinc-600'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            selectedCategory === category.id ? 'text-blue-400' : 'text-zinc-400'
                          }`} />
                          <span className={`text-sm ${
                            selectedCategory === category.id ? 'text-blue-400' : 'text-zinc-300'
                          }`}>
                            {category.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center space-x-4">
                  {!isTracking ? (
                    <motion.button
                      onClick={handleStartTracking}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Tracking</span>
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        onClick={handlePauseTracking}
                        className={`px-6 py-3 ${
                          isPaused 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                        } text-white rounded-full font-semibold transition-all duration-300 shadow-lg flex items-center space-x-2`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={handleStopTracking}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Square className="w-5 h-5" />
                        <span>Stop & Analyze</span>
                      </motion.button>
                    </>
                  )}
                </div>

                {/* AI Processing Animation */}
                <AnimatePresence>
                  {showAnalysis && processingSteps.length > 0 && processingSteps.length < processingStepsData.length && (
                    <motion.div
                      className="mt-8 bg-zinc-800/40 rounded-xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-8 h-8 text-blue-400" />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        {processingSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-zinc-400 flex items-center"
                          >
                            {index === currentStep && (
                              <motion.div
                                className="w-2 h-2 bg-blue-400 rounded-full mr-2"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                              />
                            )}
                            {index < currentStep && <CheckCircle className="w-4 h-4 text-green-400 mr-2" />}
                            {step}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Insights */}
                <AnimatePresence>
                  {showAnalysis && aiInsights.length > 0 && (
                    <motion.div
                      className="mt-8 space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                        AI-Powered Insights
                      </h3>
                      {aiInsights.map((insight, index) => {
                        const Icon = insight.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300"
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 bg-gradient-to-br ${
                                insight.type === 'productivity' ? 'from-green-500/20 to-emerald-500/20' :
                                insight.type === 'focus' ? 'from-blue-500/20 to-cyan-500/20' :
                                insight.type === 'break' ? 'from-yellow-500/20 to-orange-500/20' :
                                'from-purple-500/20 to-pink-500/20'
                              } rounded-lg`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                                <p className="text-sm text-zinc-400 mb-2">{insight.description}</p>
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                  insight.type === 'productivity' ? 'bg-green-500/20 text-green-400' :
                                  insight.type === 'focus' ? 'bg-blue-500/20 text-blue-400' :
                                  insight.type === 'break' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {insight.improvement} improvement
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Analytics Sidebar */}
            <div className="space-y-6">
              {/* Daily Stats */}
              <motion.div 
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
                  Today's Analytics
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Total Time</span>
                      <span className="text-white font-semibold">{formatTimeShort(dailyStats.totalTime)}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Focus Time</span>
                      <span className="text-white font-semibold">{formatTimeShort(dailyStats.focusTime)}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '82%' }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Productivity Score</span>
                      <span className="text-white font-semibold">{dailyStats.productivity}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${dailyStats.productivity}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Activity Distribution */}
              <motion.div 
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <PieChart className="w-5 h-5 text-purple-400 mr-2" />
                  Activity Distribution
                </h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'Development', percentage: 45, color: 'from-blue-500 to-cyan-500' },
                    { name: 'Meetings', percentage: 20, color: 'from-purple-500 to-pink-500' },
                    { name: 'Planning', percentage: 15, color: 'from-green-500 to-emerald-500' },
                    { name: 'Emails', percentage: 12, color: 'from-orange-500 to-red-500' },
                    { name: 'Breaks', percentage: 8, color: 'from-gray-500 to-zinc-500' }
                  ].map((activity, index) => (
                    <motion.div 
                      key={activity.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-zinc-300">{activity.name}</span>
                        <span className="text-sm font-semibold text-white">{activity.percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5">
                        <motion.div 
                          className={`bg-gradient-to-r ${activity.color} h-1.5 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${activity.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* AI Recommendations */}
              <motion.div 
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center mb-3">
                  <Brain className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">AI Recommendation</h3>
                </div>
                <p className="text-sm text-zinc-300 mb-3">
                  Based on your patterns, you're most productive between 10 AM - 12 PM. 
                  Schedule your most important tasks during this window.
                </p>
                <div className="flex items-center text-blue-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>23% productivity boost potential</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features Preview */}
          <motion.div 
            className="mt-12 bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Full Version Features
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Goal Tracking</h4>
                <p className="text-sm text-zinc-400">Set and achieve daily, weekly, and monthly productivity goals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Team Analytics</h4>
                <p className="text-sm text-zinc-400">Monitor team productivity and collaborate on time tracking</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Smart Scheduling</h4>
                <p className="text-sm text-zinc-400">AI-powered calendar optimization and time blocking</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/products/time-tracking-ai">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Unlock Full Version
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}