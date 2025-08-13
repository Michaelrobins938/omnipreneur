// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  category: z.enum(['content', 'marketing', 'development', 'design', 'business']).default('content'),
  status: z.enum(['planning', 'active', 'completed', 'paused']).default('planning'),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  template: z.string().optional(), // For AI-generated project templates
  goals: z.array(z.string()).default([])
});

/**
 * POST /api/projects/create
 * Create a new project with AI assistance
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { name, description, category, status, dueDate, tags, template, goals } = CreateProjectSchema.parse(body);

    // Check user's subscription for project limits
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true }
    });

    const projectLimits = {
      FREE: 3,
      PRO: 25,
      ENTERPRISE: -1 // unlimited
    };

    const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
    const limit = projectLimits[userPlan as keyof typeof projectLimits] || 3;

    if (limit !== -1) {
      const existingProjectsCount = await prisma.project.count({
        where: { userId: user.userId }
      });

      if (existingProjectsCount >= limit) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'LIMIT_EXCEEDED',
            message: `Project limit reached for ${userPlan} plan (${limit} projects max)`,
            upgradeUrl: '/pricing'
          }
        }, { status: 429 });
      }
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        userId: user.userId,
        name,
        description,
        category,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: JSON.stringify(tags)
      }
    });

    // Generate AI-powered initial tasks if template is specified
    let initialTasks = [];
    if (template && template !== 'blank') {
      initialTasks = generateTasksFromTemplate(template, category, goals);
      
      // Create initial tasks
      await Promise.all(
        initialTasks.map((task: any) =>
          prisma.task.create({
            data: {
              projectId: project.id,
              userId: user.userId,
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: 'todo',
              estimatedHours: task.estimatedHours || null
            }
          })
        )
      );
    }

    // Fetch the complete project with tasks
    const completeProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        tasks: {
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    // Log project creation event
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'project_created',
        metadata: {
          projectId: project.id,
          projectName: name,
          category,
          status,
          template,
          tasksGenerated: initialTasks.length
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        project: completeProject,
        tasksGenerated: initialTasks.length,
        message: `Project "${name}" created successfully${initialTasks.length > 0 ? ` with ${initialTasks.length} AI-generated tasks` : ''}`
      }
    });

  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors }
      }, { status: 400 });
    }

    console.error('Project creation error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'CREATION_ERROR', message: 'Failed to create project' }
    }, { status: 500 });
  }
});

function generateTasksFromTemplate(template: string, category: string, goals: string[]): any[] {
  const templates = {
    'content-marketing': [
      { title: 'Research target audience', description: 'Identify and analyze target demographic', priority: 'high', estimatedHours: 4 },
      { title: 'Create content calendar', description: 'Plan content topics and publishing schedule', priority: 'high', estimatedHours: 3 },
      { title: 'Write blog posts', description: 'Create engaging blog content', priority: 'medium', estimatedHours: 8 },
      { title: 'Design social media graphics', description: 'Create visual content for social platforms', priority: 'medium', estimatedHours: 6 },
      { title: 'Set up analytics tracking', description: 'Implement tracking for content performance', priority: 'low', estimatedHours: 2 }
    ],
    'product-launch': [
      { title: 'Market research', description: 'Analyze competitors and market opportunities', priority: 'high', estimatedHours: 6 },
      { title: 'Create product roadmap', description: 'Define features and development timeline', priority: 'high', estimatedHours: 4 },
      { title: 'Design MVP wireframes', description: 'Create initial product mockups', priority: 'high', estimatedHours: 8 },
      { title: 'Set up landing page', description: 'Build product landing page', priority: 'medium', estimatedHours: 6 },
      { title: 'Plan launch strategy', description: 'Develop go-to-market plan', priority: 'medium', estimatedHours: 4 }
    ],
    'website-redesign': [
      { title: 'Audit current website', description: 'Analyze existing site performance and issues', priority: 'high', estimatedHours: 3 },
      { title: 'Define new site structure', description: 'Plan information architecture', priority: 'high', estimatedHours: 4 },
      { title: 'Create design mockups', description: 'Design new website layouts', priority: 'high', estimatedHours: 12 },
      { title: 'Develop responsive design', description: 'Code the new website', priority: 'medium', estimatedHours: 20 },
      { title: 'Test and optimize', description: 'Quality assurance and performance optimization', priority: 'medium', estimatedHours: 6 }
    ]
  };

  const defaultTasks = [
    { title: 'Project planning', description: 'Define project scope and requirements', priority: 'high', estimatedHours: 2 },
    { title: 'Research phase', description: 'Gather information and resources', priority: 'medium', estimatedHours: 4 },
    { title: 'Implementation', description: 'Execute the main project work', priority: 'medium', estimatedHours: 8 },
    { title: 'Review and testing', description: 'Quality check and refinements', priority: 'low', estimatedHours: 3 }
  ];

  return templates[template as keyof typeof templates] || defaultTasks;
}