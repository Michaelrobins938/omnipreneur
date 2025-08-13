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
  tags: z.array(z.string()).default([])
});

/**
 * GET /api/projects
 * List all projects for the authenticated user
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { userId: user.userId };
    if (status) where.status = status;
    if (category) where.category = category;

    const projects = await prisma.project.findMany({
      where,
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true
          }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });

    return NextResponse.json({
      success: true,
      data: projects
    });

  } catch (error: any) {
    console.error('Projects list error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch projects' }
    }, { status: 500 });
  }
});

/**
 * POST /api/projects
 * Create a new project
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { name, description, category, status, dueDate, tags } = CreateProjectSchema.parse(body);

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
            message: `Project limit reached for ${userPlan} plan (${limit} projects max)`
          }
        }, { status: 429 });
      }
    }

    const project = await prisma.project.create({
      data: {
        userId: user.userId,
        name,
        description,
        category,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: JSON.stringify(tags)
      },
      include: {
        tasks: true,
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
          status
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: project
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