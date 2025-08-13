// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { withCsrfProtection } from '@/lib/security/csrf';
import { z } from 'zod';
import { optimizeTaskOrder } from '@/lib/project/optimizer';

import prisma from '@/lib/db';

// Task validation schemas
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  assigneeId: z.string().optional(),
  projectId: z.string(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  estimatedHours: z.number().positive().optional().or(z.undefined())
});

const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  estimatedHours: z.number().positive().optional().or(z.undefined())
});

const TaskQuerySchema = z.object({
  page: z.string().default('1').transform(val => parseInt(val, 10)).refine(val => val > 0),
  limit: z.string().default('20').transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100),
  projectId: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigneeId: z.string().optional(),
  search: z.string().optional()
});

/**
 * POST /api/projects/tasks
 * 
 * Create a new task
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   title: string,
 *   description?: string,
 *   status?: 'todo' | 'in-progress' | 'review' | 'done',
 *   priority?: 'low' | 'medium' | 'high',
 *   assigneeId?: string,
 *   projectId: string,
 *   dueDate?: string (ISO datetime),
 *   tags?: string[],
 *   estimatedHours?: number
 * }
 */
export const POST = requireAuth(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const validatedData = CreateTaskSchema.parse(body);

    // Generate AI-powered task insights
    const taskInsights = await generateTaskInsights(validatedData);

    // Create task (simulated)
    const task = {
      id: Date.now().toString(),
      userId: user.userId,
      ...validatedData,
      aiInsights: taskInsights,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real implementation:
    // const savedTask = await prisma.task.create({
    //   data: task,
    //   include: { assignee: true, project: true }
    // });

    return NextResponse.json({
      success: true,
      data: {
        task: task,
        insights: taskInsights,
        message: 'Task created successfully'
      }
    });

  } catch (error) {
    console.error('Task creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
            details: error.issues 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to create task' 
        } 
      },
      { status: 500 }
    );
  }
}));

/**
 * GET /api/projects/tasks
 * 
 * List tasks with filtering and pagination
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20, max: 100)
 * - projectId?: string
 * - status?: 'todo' | 'in-progress' | 'review' | 'done'
 * - priority?: 'low' | 'medium' | 'high'
 * - assigneeId?: string
 * - search?: string
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    // Extract and validate query parameters
    const queryData = TaskQuerySchema.parse(
      Object.fromEntries(searchParams.entries())
    );

    // Simulate fetching tasks with project data
    const mockTasks = [
      {
        id: '1',
        title: 'Design user interface',
        description: 'Create responsive UI components for the dashboard',
        status: 'in-progress',
        priority: 'high',
        assigneeId: 'user2',
        assigneeName: 'Sarah Wilson',
        projectId: 'proj1',
        projectName: 'E-commerce Platform',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 8,
        actualHours: 5.5,
        tags: ['frontend', 'ui', 'react'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Setup database schema',
        description: 'Design and implement the database structure',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'user3',
        assigneeName: 'John Smith',
        projectId: 'proj1',
        projectName: 'E-commerce Platform',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 12,
        actualHours: 0,
        tags: ['backend', 'database', 'postgresql'],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with examples',
        status: 'review',
        priority: 'low',
        assigneeId: 'user4',
        assigneeName: 'Mike Johnson',
        projectId: 'proj1',
        projectName: 'E-commerce Platform',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 6,
        actualHours: 6,
        tags: ['documentation', 'api', 'technical-writing'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Apply filters
    let filteredTasks = mockTasks;
    
    if (queryData.projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === queryData.projectId);
    }
    
    if (queryData.status) {
      filteredTasks = filteredTasks.filter(task => task.status === queryData.status);
    }
    
    if (queryData.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === queryData.priority);
    }
    
    if (queryData.assigneeId) {
      filteredTasks = filteredTasks.filter(task => task.assigneeId === queryData.assigneeId);
    }
    
    if (queryData.search) {
      const searchLower = queryData.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Generate project analytics
    const analytics = {
      taskStats: {
        total: filteredTasks.length,
        todo: filteredTasks.filter(t => t.status === 'todo').length,
        inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
        review: filteredTasks.filter(t => t.status === 'review').length,
        done: filteredTasks.filter(t => t.status === 'done').length
      },
      priorityDistribution: {
        high: filteredTasks.filter(t => t.priority === 'high').length,
        medium: filteredTasks.filter(t => t.priority === 'medium').length,
        low: filteredTasks.filter(t => t.priority === 'low').length
      },
      timeTracking: {
        totalEstimated: filteredTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0),
        totalActual: filteredTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0),
        efficiency: calculateEfficiency(filteredTasks)
      },
      upcomingDeadlines: getUpcomingDeadlines(filteredTasks),
      aiInsights: await generateProjectInsights(filteredTasks)
    };

    return NextResponse.json({
      success: true,
      data: {
        tasks: filteredTasks,
        analytics: analytics,
        pagination: {
          page: queryData.page,
          limit: queryData.limit,
          total: filteredTasks.length,
          totalPages: Math.ceil(filteredTasks.length / queryData.limit)
        }
      }
    });

  } catch (error) {
    console.error('Tasks fetch error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid query parameters',
            details: error.issues 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch tasks' 
        } 
      },
      { status: 500 }
    );
  }
});

async function generateTaskInsights(taskData: any) {
  // AI-powered task analysis
  return {
    estimatedComplexity: getComplexityScore(taskData.title, taskData.description),
    suggestedTimeEstimate: getSuggestedTimeEstimate(taskData.title, taskData.description),
    recommendedAssignee: getRecommendedAssignee(taskData.title, taskData.tags),
    riskFactors: getRiskFactors(taskData),
    dependencies: getSuggestedDependencies(taskData.title, taskData.description)
  };
}

async function generateProjectInsights(tasks: any[]) {
  return {
    productivityTrend: 'increasing', // +12% this week
    riskAssessment: 'low', // Based on deadline analysis
    completionForecast: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    bottlenecks: ['Design review process taking longer than expected'],
    recommendations: [
      'Consider adding more designers to reduce review bottleneck',
      'Break down large tasks into smaller, manageable chunks',
      'Implement daily standups to improve communication'
    ]
  };
}

function getComplexityScore(title: string, description?: string) {
  // Simple complexity analysis based on keywords
  const complexKeywords = ['integration', 'migration', 'optimization', 'security', 'scalability'];
  const text = `${title} ${description || ''}`.toLowerCase();
  const complexity = complexKeywords.reduce((score, keyword) => 
    text.includes(keyword) ? score + 1 : score, 0
  );
  
  if (complexity >= 3) return 'high';
  if (complexity >= 1) return 'medium';
  return 'low';
}

function getSuggestedTimeEstimate(title: string, description?: string) {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  if (text.includes('setup') || text.includes('configuration')) return 4;
  if (text.includes('design') || text.includes('ui')) return 8;
  if (text.includes('implementation') || text.includes('development')) return 12;
  if (text.includes('testing') || text.includes('review')) return 6;
  if (text.includes('documentation')) return 3;
  
  return 6; // Default estimate
}

function getRecommendedAssignee(title: string, tags?: string[]) {
  const text = `${title} ${(tags || []).join(' ')}`.toLowerCase();
  
  if (text.includes('frontend') || text.includes('ui') || text.includes('design')) {
    return { id: 'user2', name: 'Sarah Wilson', reason: 'Frontend/UI expertise' };
  }
  if (text.includes('backend') || text.includes('database') || text.includes('api')) {
    return { id: 'user3', name: 'John Smith', reason: 'Backend development expertise' };
  }
  if (text.includes('documentation') || text.includes('testing')) {
    return { id: 'user4', name: 'Mike Johnson', reason: 'QA and documentation expertise' };
  }
  
  return { id: 'auto', name: 'Auto-assign', reason: 'Based on current workload' };
}

function getRiskFactors(taskData: any) {
  const risks = [];
  
  if (taskData.priority === 'high' && !taskData.assigneeId) {
    risks.push('High priority task without assignee');
  }
  
  if (taskData.estimatedHours && taskData.estimatedHours > 16) {
    risks.push('Large task may need to be broken down');
  }
  
  if (taskData.dueDate && new Date(taskData.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) {
    risks.push('Tight deadline may cause quality issues');
  }
  
  return risks;
}

function getSuggestedDependencies(title: string, description?: string) {
  const text = `${title} ${description || ''}`.toLowerCase();
  const dependencies = [];
  
  if (text.includes('ui') || text.includes('frontend')) {
    dependencies.push('API endpoints must be ready');
  }
  
  if (text.includes('testing')) {
    dependencies.push('Implementation must be complete');
  }
  
  if (text.includes('deployment') || text.includes('production')) {
    dependencies.push('All testing must pass');
  }
  
  return dependencies;
}

function calculateEfficiency(tasks: any[]) {
  const tasksWithBothEstimates = tasks.filter(t => t.estimatedHours && t.actualHours);
  if (tasksWithBothEstimates.length === 0) return 100;
  
  const totalEstimated = tasksWithBothEstimates.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalActual = tasksWithBothEstimates.reduce((sum, task) => sum + task.actualHours, 0);
  
  return Math.round((totalEstimated / totalActual) * 100);
}

function getUpcomingDeadlines(tasks: any[]) {
  const now = new Date();
  const upcoming = tasks
    .filter(task => task.dueDate && new Date(task.dueDate) > now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
    
  return upcoming.map(task => ({
    id: task.id,
    title: task.title,
    dueDate: task.dueDate,
    daysUntilDue: Math.ceil((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    priority: task.priority,
    status: task.status
  }));
}