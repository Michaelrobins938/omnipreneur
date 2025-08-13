"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Kanban, 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  FileText,
  Settings,
  GitBranch,
  Plus,
  Edit,
  Trash2,
  User,
  AlertCircle,
  Brain,
  Activity
} from 'lucide-react';
import ProductPageTemplate from '../../components/ProductPageTemplate';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

export default function ProjectManagementPro() {
  const [selectedMethodology, setSelectedMethodology] = useState('agile');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Design user interface', status: 'in-progress', priority: 'high', assignee: 'Sarah' },
    { id: '2', title: 'Setup database', status: 'todo', priority: 'medium', assignee: 'John' },
    { id: '3', title: 'Write documentation', status: 'review', priority: 'low', assignee: 'Mike' },
    { id: '4', title: 'Deploy to production', status: 'done', priority: 'high', assignee: 'Lisa' }
  ]);

  const methodologies = [
    { id: 'agile', name: 'Agile', icon: GitBranch, color: 'from-blue-500 to-cyan-500' },
    { id: 'scrum', name: 'Scrum', icon: Kanban, color: 'from-green-500 to-emerald-500' },
    { id: 'waterfall', name: 'Waterfall', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { id: 'kanban', name: 'Kanban', icon: Target, color: 'from-orange-500 to-red-500' },
    { id: 'lean', name: 'Lean', icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
    { id: 'hybrid', name: 'Hybrid', icon: Settings, color: 'from-gray-500 to-zinc-500' }
  ];

  const features = [
    {
      icon: <Kanban className="w-6 h-6" />,
      title: "AI Task Management",
      description: "Intelligent task assignment, priority optimization, and automated workflow management"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Automated timeline planning, resource allocation, and deadline optimization"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Real-time collaboration with AI-powered insights and communication tools"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Advanced analytics, milestone monitoring, and predictive project insights"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Data-driven insights for project optimization and team productivity"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Recommendations",
      description: "Intelligent suggestions for process improvement and risk mitigation"
    }
  ];

  const stats = [
    { label: "Project Success Rate", value: "94%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Time Saved", value: "40%", icon: <Clock className="w-5 h-5" /> },
    { label: "Team Productivity", value: "+65%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Active Projects", value: "250K+", icon: <Kanban className="w-5 h-5" /> }
  ];

  const pricingPlans = [
    {
      name: "Project Starter",
      price: "$39",
      features: [
        "Up to 10 projects",
        "Basic task management",
        "Team collaboration",
        "Standard analytics",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Project Professional",
      price: "$99",
      features: [
        "Up to 50 projects",
        "Advanced task management",
        "AI-powered insights",
        "Priority support",
        "Custom integrations",
        "Advanced analytics"
      ],
      popular: true,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Project Enterprise",
      price: "$299",
      features: [
        "Unlimited projects",
        "Custom AI models",
        "API access",
        "Dedicated support",
        "White-label solution",
        "Enterprise security"
      ],
      popular: false
    }
  ];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'todo',
      priority: 'medium',
      assignee: 'You'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  const getStatusColumn = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const demoComponent = (
    <motion.div
      className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">AI Project Management</h3>
        <p className="text-zinc-400">Experience intelligent project management with Kanban boards and AI insights</p>
      </div>

      <div className="space-y-6">
        {/* Methodology Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">Project Methodology</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {methodologies.map((methodology) => {
              const Icon = methodology.icon;
              return (
                <button
                  key={methodology.id}
                  onClick={() => setSelectedMethodology(methodology.id)}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    selectedMethodology === methodology.id
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-zinc-600/50 bg-zinc-800/40 hover:border-zinc-500'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${
                    selectedMethodology === methodology.id ? 'text-cyan-400' : 'text-zinc-400'
                  }`} />
                  <span className={`text-xs ${
                    selectedMethodology === methodology.id ? 'text-cyan-400' : 'text-zinc-300'
                  }`}>
                    {methodology.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Task */}
        <div className="flex gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTask}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { status: 'todo' as const, title: 'To Do', color: 'border-zinc-500' },
            { status: 'in-progress' as const, title: 'In Progress', color: 'border-blue-500' },
            { status: 'review' as const, title: 'Review', color: 'border-yellow-500' },
            { status: 'done' as const, title: 'Done', color: 'border-green-500' }
          ].map((column) => (
            <div key={column.status} className={`bg-zinc-800/40 rounded-2xl p-4 border ${column.color}/30`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">{column.title}</h4>
                <span className="text-xs text-zinc-400 bg-zinc-700/50 px-2 py-1 rounded-full">
                  {getStatusColumn(column.status).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {getStatusColumn(column.status).map((task) => (
                  <motion.div
                    key={task.id}
                    className="bg-zinc-700/50 border border-zinc-600/30 rounded-xl p-3 cursor-move hover:border-zinc-500/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-medium text-white">{task.title}</h5>
                      <div className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{task.assignee}</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        {column.status !== 'done' && (
                          <button
                            onClick={() => {
                              const statuses: Task['status'][] = ['todo', 'in-progress', 'review', 'done'];
                              const currentIndex = statuses.indexOf(task.status);
                              if (currentIndex < statuses.length - 1) {
                                moveTask(task.id, statuses[currentIndex + 1] || "done");
                              }
                            }}
                            className="p-1 hover:bg-zinc-600/50 rounded"
                            title="Move to next stage"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-2 text-blue-400 mb-3">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">AI Project Insights</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-zinc-300">
              <div className="font-medium text-white mb-1">Productivity Trend</div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>+12% this week</span>
              </div>
            </div>
            <div className="text-zinc-300">
              <div className="font-medium text-white mb-1">Risk Assessment</div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span>Low risk detected</span>
              </div>
            </div>
            <div className="text-zinc-300">
              <div className="font-medium text-white mb-1">Completion Forecast</div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>On track for deadline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleGetStarted = () => {
    window.location.href = '/auth/register';
  };

  const handleWatchDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ProductPageTemplate
      title="Project Management Pro"
      subtitle="AI-Powered Project Excellence"
      description="Revolutionary project management platform with AI-driven insights, intelligent task automation, and predictive analytics for unprecedented project success."
      heroIcon={<Kanban className="w-12 h-12" />}
      heroGradient="from-blue-500 to-cyan-500"
      features={features}
      stats={stats}
      pricingPlans={pricingPlans}
      demoComponent={demoComponent}
      onGetStarted={handleGetStarted}
      onWatchDemo={handleWatchDemo}
      primaryColor="blue"
      accentColor="cyan"
    />
  );
}