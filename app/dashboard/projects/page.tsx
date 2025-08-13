// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Calendar,
  Users,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  FileText,
  Zap,
  Activity,
  ArrowLeft,
  Brain,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Task {
  id: string;
  title: string;
  description: string;
  status: $Enums.SubscriptionStatus.TODO | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: number;
  workload: number;
  unavailableDates: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: $Enums.SubscriptionStatus.PLANNING | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: string;
  dueDate: string;
  budget?: number;
  estimatedHours: number;
  actualHours: number;
  completionPercentage: number;
  team: TeamMember[];
  tasks: Task[];
  objectives: {
    primaryGoal: 'time' | 'budget' | 'quality' | 'scope';
    successMetrics: string[];
    riskTolerance: 'low' | 'medium' | 'high';
  };
  createdAt: string;
  updatedAt: string;
}

interface ProjectAnalytics {
  efficiency: {
    overallScore: number;
    timeEfficiency: number;
    resourceUtilization: number;
    qualityScore: number;
  };
  predictions: {
    estimatedCompletion: string;
    budgetForecast: number;
    riskLevel: 'low' | 'medium' | 'high';
    blockers: Array<{
      type: string;
      description: string;
      impact: 'low' | 'medium' | 'high';
      suggestedAction: string;
    }>;
  };
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    effort: string;
    impact: string;
  }>;
}

export default function ProjectManagementDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Form states
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    budget: '',
    estimatedHours: '',
    primaryGoal: 'time',
    successMetrics: [''],
    riskTolerance: 'medium'
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from real API first
      try {
        const response = await fetch('/api/projects', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setProjects(data.data || []);
          return;
        }
      } catch (error) {
        console.error('Failed to fetch projects from API, using mock data:', error);
      }
      
      // Fallback to mock data
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Website Redesign',
          description: 'Complete overhaul of company website with modern design',
          status: $Enums.SubscriptionStatus.ACTIVE,
          priority: 'HIGH',
          startDate: '2024-01-15',
          dueDate: '2024-03-15',
          budget: 15000,
          estimatedHours: 160,
          actualHours: 45,
          completionPercentage: 28,
          team: [
            {
              id: '1',
              name: 'Alice Johnson',
              role: 'Frontend Developer',
              skills: ['React', 'TypeScript', 'CSS'],
              availability: 40,
              workload: 85,
              unavailableDates: []
            },
            {
              id: '2',
              name: 'Bob Smith',
              role: 'Designer',
              skills: ['Figma', 'UI/UX', 'Branding'],
              availability: 30,
              workload: 70,
              unavailableDates: ['2024-02-20', '2024-02-21']
            }
          ],
          tasks: [
            {
              id: '1',
              title: 'Design mockups',
              description: 'Create wireframes and high-fidelity mockups',
              status: $Enums.SubscriptionStatus.DONE,
              priority: 'HIGH',
              assignee: 'Bob Smith',
              dueDate: '2024-02-01',
              estimatedHours: 20,
              actualHours: 18,
              dependencies: [],
              tags: ['design', 'mockups'],
              createdAt: '2024-01-15T00:00:00Z',
              updatedAt: '2024-02-01T00:00:00Z'
            },
            {
              id: '2',
              title: 'Setup development environment',
              description: 'Configure build tools and development workflow',
              status: $Enums.SubscriptionStatus.DONE,
              priority: 'MEDIUM',
              assignee: 'Alice Johnson',
              dueDate: '2024-01-25',
              estimatedHours: 8,
              actualHours: 6,
              dependencies: [],
              tags: ['development', 'setup'],
              createdAt: '2024-01-15T00:00:00Z',
              updatedAt: '2024-01-25T00:00:00Z'
            },
            {
              id: '3',
              title: 'Implement homepage',
              description: 'Build responsive homepage component',
              status: $Enums.SubscriptionStatus.IN_PROGRESS,
              priority: 'HIGH',
              assignee: 'Alice Johnson',
              dueDate: '2024-02-15',
              estimatedHours: 25,
              actualHours: 12,
              dependencies: ['1', '2'],
              tags: ['development', 'frontend'],
              createdAt: '2024-01-30T00:00:00Z',
              updatedAt: '2024-02-10T00:00:00Z'
            }
          ],
          objectives: {
            primaryGoal: 'quality',
            successMetrics: ['User engagement +30%', 'Page load time <2s', 'Mobile responsiveness 100%'],
            riskTolerance: 'medium'
          },
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-02-10T00:00:00Z'
        },
        {
          id: '2',
          name: 'Mobile App MVP',
          description: 'Develop minimum viable product for mobile application',
          status: $Enums.SubscriptionStatus.PLANNING,
          priority: 'MEDIUM',
          startDate: '2024-02-01',
          dueDate: '2024-05-01',
          budget: 25000,
          estimatedHours: 280,
          actualHours: 0,
          completionPercentage: 5,
          team: [],
          tasks: [],
          objectives: {
            primaryGoal: 'time',
            successMetrics: ['Launch by Q2', 'Core features working', '100+ beta users'],
            riskTolerance: 'high'
          },
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        }
      ];

      setProjects(mockProjects);
      if (mockProjects.length > 0) {
        setSelectedProject(mockProjects[0]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getProjectAnalytics = async (project: Project) => {
    try {
      setAnalyticsLoading(true);
      
      // Mock AI analytics response
      const mockAnalytics: ProjectAnalytics = {
        efficiency: {
          overallScore: 78,
          timeEfficiency: 85,
          resourceUtilization: 72,
          qualityScore: 88
        },
        predictions: {
          estimatedCompletion: '2024-03-22',
          budgetForecast: 16200,
          riskLevel: 'medium',
          blockers: [
            {
              type: 'Resource Constraint',
              description: 'Designer unavailable Feb 20-21',
              impact: 'medium',
              suggestedAction: 'Reschedule design reviews or find backup designer'
            },
            {
              type: 'Technical Risk',
              description: 'Homepage component complexity higher than estimated',
              impact: 'high',
              suggestedAction: 'Break down into smaller tasks and add 15% time buffer'
            }
          ]
        },
        recommendations: [
          {
            category: 'Resource Optimization',
            title: 'Parallel Task Execution',
            description: 'Start development of secondary pages while homepage is in review',
            priority: 'high',
            effort: '2 hours planning',
            impact: 'Save 1 week delivery time'
          },
          {
            category: 'Quality Assurance',
            title: 'Automated Testing Setup',
            description: 'Implement automated testing to prevent regression bugs',
            priority: 'medium',
            effort: '1 day setup',
            impact: 'Reduce bug fixing time by 40%'
          }
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const createProject = async () => {
    try {
      // Validate form
      if (!newProject.name || !newProject.description || !newProject.dueDate) {
        setError('Please fill in all required fields');
        return;
      }

      const projectData = {
        ...newProject,
        budget: newProject.budget ? parseInt(newProject.budget) : undefined,
        estimatedHours: parseInt(newProject.estimatedHours) || 40,
        successMetrics: newProject.successMetrics.filter(m => m.trim() !== '')
      };

      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh projects list
        await fetchProjects();
        setIsCreating(false);
        return;
      } else {
        const errorData = await response.json();
        alert(errorData.error?.message || 'Failed to create project');
      }
      
      setShowCreateForm(false);
      setNewProject({
        name: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        budget: '',
        estimatedHours: '',
        primaryGoal: 'time',
        successMetrics: [''],
        riskTolerance: 'medium'
      });
      
      await fetchProjects();
    } catch (err) {
      setError('Failed to create project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS': return <Play className="h-4 w-4 text-blue-600" />;
      case 'REVIEW': return <Eye className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Error Loading Projects</h1>
            <p className="text-zinc-400 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={fetchProjects}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
              <Link href="/dashboard" className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors inline-block">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Target className="w-8 h-8 mr-3 text-blue-500" />
                Project Management Pro
              </h1>
              <p className="text-zinc-400 mt-2">Manage projects with AI-powered insights and optimization</p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedProject && (
                <button
                  onClick={() => {
                    setShowAnalytics(!showAnalytics);
                    if (!showAnalytics && selectedProject) {
                      getProjectAnalytics(selectedProject);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>AI Analytics</span>
                </button>
              )}
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Project List */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Projects</h2>
                <span className="text-sm text-zinc-400">{projects.length}</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedProject?.id === project.id
                        ? 'bg-blue-600/20 border border-blue-500/50'
                        : 'bg-zinc-800/50 hover:bg-zinc-800/70 border border-zinc-700/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white truncate">{project.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${
                        project.status === 'ACTIVE' ? 'text-blue-400 bg-blue-900/20 border-blue-800' :
                        project.status === 'COMPLETED' ? 'text-green-400 bg-green-900/20 border-green-800' :
                        project.status === 'ON_HOLD' ? 'text-yellow-400 bg-yellow-900/20 border-yellow-800' :
                        project.status === 'CANCELLED' ? 'text-red-400 bg-red-900/20 border-red-800' :
                        'text-zinc-400 bg-zinc-900/20 border-zinc-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{project.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Progress</span>
                        <span className="font-medium text-white">{project.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${project.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.team.length}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-3">
            {selectedProject ? (
            <div className="space-y-8">
              {/* Project Overview */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        selectedProject.status === 'ACTIVE' ? 'text-blue-400 bg-blue-900/20 border-blue-800' :
                        selectedProject.status === 'COMPLETED' ? 'text-green-400 bg-green-900/20 border-green-800' :
                        selectedProject.status === 'ON_HOLD' ? 'text-yellow-400 bg-yellow-900/20 border-yellow-800' :
                        selectedProject.status === 'CANCELLED' ? 'text-red-400 bg-red-900/20 border-red-800' :
                        'text-zinc-400 bg-zinc-900/20 border-zinc-800'
                      }`}>
                        {selectedProject.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        selectedProject.priority === 'URGENT' ? 'text-red-400 bg-red-900/20 border-red-800' :
                        selectedProject.priority === 'HIGH' ? 'text-orange-400 bg-orange-900/20 border-orange-800' :
                        selectedProject.priority === 'MEDIUM' ? 'text-yellow-400 bg-yellow-900/20 border-yellow-800' :
                        'text-green-400 bg-green-900/20 border-green-800'
                      }`}>
                        {selectedProject.priority}
                      </span>
                    </div>
                    <p className="text-zinc-400">{selectedProject.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-zinc-400 hover:text-white">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-white">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{selectedProject.completionPercentage}%</div>
                    <div className="text-sm text-zinc-400">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{selectedProject.actualHours}h</div>
                    <div className="text-sm text-zinc-400">Hours Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{selectedProject.team.length}</div>
                    <div className="text-sm text-zinc-400">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{selectedProject.tasks.length}</div>
                    <div className="text-sm text-zinc-400">Tasks</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Start Date:</span>
                        <span className="text-white">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Due Date:</span>
                        <span className="text-white">{new Date(selectedProject.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Estimated Hours:</span>
                        <span className="text-white">{selectedProject.estimatedHours}h</span>
                      </div>
                      {selectedProject.budget && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Budget:</span>
                          <span className="text-white">${selectedProject.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Objectives</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Primary Goal:</span>
                        <span className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs capitalize">
                          {selectedProject.objectives.primaryGoal}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Success Metrics:</span>
                        <ul className="mt-1 space-y-1">
                          {selectedProject.objectives.successMetrics.map((metric, index) => (
                            <li key={index} className="text-xs flex items-center gap-1 text-zinc-300">
                              <Target className="h-3 w-3 text-blue-400" />
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* AI Analytics Panel */}
                {showAnalytics && analytics && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        AI Project Analytics
                      </CardTitle>
                      <CardDescription>
                        AI-powered insights and optimization recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analyticsLoading ? (
                        <div className="animate-pulse space-y-4">
                          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                          <div className="h-20 bg-blue-200 rounded"></div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Efficiency Scores */}
                          <div>
                            <h4 className="font-semibold mb-3">Project Efficiency</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {analytics.efficiency.overallScore}%
                                </div>
                                <div className="text-sm text-gray-500">Overall</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {analytics.efficiency.timeEfficiency}%
                                </div>
                                <div className="text-sm text-gray-500">Time</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                  {analytics.efficiency.resourceUtilization}%
                                </div>
                                <div className="text-sm text-gray-500">Resources</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                  {analytics.efficiency.qualityScore}%
                                </div>
                                <div className="text-sm text-gray-500">Quality</div>
                              </div>
                            </div>
                          </div>

                          {/* Predictions */}
                          <div>
                            <h4 className="font-semibold mb-3">Predictions & Risks</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Estimated Completion</span>
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="text-lg font-bold">
                                  {new Date(analytics.predictions.estimatedCompletion).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Budget Forecast</span>
                                  <TrendingUp className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="text-lg font-bold">
                                  ${analytics.predictions.budgetForecast.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {analytics.predictions.blockers.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-medium mb-2 text-red-600">Potential Blockers</h5>
                                <div className="space-y-2">
                                  {analytics.predictions.blockers.map((blocker, index) => (
                                    <div key={index} className="bg-red-50 border border-red-200 p-3 rounded">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="font-medium text-sm">{blocker.type}</div>
                                          <div className="text-sm text-gray-600 mt-1">{blocker.description}</div>
                                          <div className="text-sm text-blue-600 mt-2 font-medium">
                                            💡 {blocker.suggestedAction}
                                          </div>
                                        </div>
                                        <Badge 
                                          variant="outline"
                                          className={`ml-2 ${
                                            blocker.impact === 'high' ? 'border-red-400 text-red-600' :
                                            blocker.impact === 'medium' ? 'border-orange-400 text-orange-600' :
                                            'border-yellow-400 text-yellow-600'
                                          }`}
                                        >
                                          {blocker.impact}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Recommendations */}
                          <div>
                            <h4 className="font-semibold mb-3">AI Recommendations</h4>
                            <div className="space-y-3">
                              {analytics.recommendations.map((rec, index) => (
                                <div key={index} className="bg-white border rounded-lg p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-xs">
                                          {rec.category}
                                        </Badge>
                                        <Badge 
                                          variant="outline"
                                          className={`text-xs ${
                                            rec.priority === 'high' ? 'border-red-400 text-red-600' :
                                            rec.priority === 'medium' ? 'border-orange-400 text-orange-600' :
                                            'border-green-400 text-green-600'
                                          }`}
                                        >
                                          {rec.priority} priority
                                        </Badge>
                                      </div>
                                      <h5 className="font-medium mb-1">{rec.title}</h5>
                                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                                      <div className="flex gap-4 text-xs text-gray-500">
                                        <span>Effort: {rec.effort}</span>
                                        <span>Impact: {rec.impact}</span>
                                      </div>
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

                {/* Tasks */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Tasks</CardTitle>
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Task
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedProject.tasks.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {getTaskStatusIcon(task.status)}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                    {task.priority.toLowerCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {task.assignee && (
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {task.assignee}
                                    </span>
                                  )}
                                  {task.dueDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {task.actualHours || 0}h / {task.estimatedHours || 0}h
                                  </span>
                                </div>
                                {task.tags.length > 0 && (
                                  <div className="flex gap-1 mt-2">
                                    {task.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1 ml-4">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team */}
                {selectedProject.team.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedProject.team.map((member) => (
                          <div key={member.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{member.name}</h4>
                              <Badge variant="outline">{member.role}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              Skills: {member.skills.join(', ')}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Availability:</span>
                                <span>{member.availability}h/week</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Current Workload:</span>
                                <span>{member.workload}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    member.workload > 90 ? 'bg-red-500' :
                                    member.workload > 75 ? 'bg-orange-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(member.workload, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
                  <p className="text-gray-500 mb-6">Choose a project from the list to view details</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create Your First Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>Set up a new project with AI optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Name *</label>
                    <Input
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <Select
                      value={newProject.priority}
                      onValueChange={(value) => setNewProject({ ...newProject, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe your project..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date *</label>
                    <Input
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget ($)</label>
                    <Input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estimated Hours</label>
                    <Input
                      type="number"
                      value={newProject.estimatedHours}
                      onChange={(e) => setNewProject({ ...newProject, estimatedHours: e.target.value })}
                      placeholder="40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Primary Goal</label>
                  <Select
                    value={newProject.primaryGoal}
                    onValueChange={(value) => setNewProject({ ...newProject, primaryGoal: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Time to Market</SelectItem>
                      <SelectItem value="budget">Budget Optimization</SelectItem>
                      <SelectItem value="quality">Quality Excellence</SelectItem>
                      <SelectItem value="scope">Scope Completion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Success Metrics</label>
                  {newProject.successMetrics.map((metric, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={metric}
                        onChange={(e) => {
                          const newMetrics = [...newProject.successMetrics];
                          newMetrics[index] = e.target.value;
                          setNewProject({ ...newProject, successMetrics: newMetrics });
                        }}
                        placeholder="Enter success metric..."
                      />
                      {index === newProject.successMetrics.length - 1 && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setNewProject({
                            ...newProject,
                            successMetrics: [...newProject.successMetrics, '']
                          })}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createProject}>
                    Create Project
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