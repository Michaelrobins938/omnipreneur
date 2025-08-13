// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { ProjectManagementService, ProjectOptimizationRequest } from '@/lib/ai/project-management-service';
import prisma, { logAIRequest } from '@/lib/db';

// Types for authenticated request
interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

// Enhanced project analytics schema
const ProjectAnalyticsSchema = z.object({
  project: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    startDate: z.string(),
    targetEndDate: z.string(),
    budget: z.number().positive(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    status: z.enum(['planning', 'active', 'on-hold', 'completed']),
    type: z.enum(['development', 'marketing', 'research', 'operations', 'other'])
  }),
  tasks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    estimatedHours: z.number().positive(),
    actualHours: z.number().min(0).optional(),
    status: z.enum(['not-started', 'in-progress', 'completed', 'blocked']),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    assignedTo: z.string().optional(),
    dependencies: z.array(z.string()),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
    completedDate: z.string().optional(),
    skillsRequired: z.array(z.string()),
    complexity: z.enum(['simple', 'moderate', 'complex', 'expert'])
  })),
  resources: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    skills: z.array(z.string()),
    availability: z.number().min(0).max(100),
    hourlyRate: z.number().positive(),
    workingHours: z.object({
      start: z.string(),
      end: z.string(),
      timezone: z.string()
    }),
    currentWorkload: z.number().min(0),
    maxCapacity: z.number().positive()
  })),
  constraints: z.object({
    deadlines: z.array(z.object({
      taskId: z.string(),
      deadline: z.string(),
      importance: z.enum(['flexible', 'firm', 'critical'])
    })),
    budgetLimit: z.number().positive(),
    resourceConstraints: z.array(z.object({
      resourceId: z.string(),
      maxHours: z.number().positive(),
      unavailableDates: z.array(z.string())
    }))
  }),
  objectives: z.object({
    primaryGoal: z.enum(['time', 'budget', 'quality', 'scope']),
    successMetrics: z.array(z.string()),
    riskTolerance: z.enum(['low', 'medium', 'high'])
  })
});

/**
 * POST /api/projects/analytics
 * 
 * AI-powered project analytics with:
 * - Resource allocation optimization
 * - Timeline prediction with risk analysis
 * - Bottleneck identification
 * - Task prioritization algorithms
 * - Team productivity insights
 * 
 * Authentication: Required
 * Subscription: PROJECT_MANAGEMENT_PRO, PRO, or ENTERPRISE
 */
export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        
        // Parse and validate request body
        const body = await request.json();
        const validated = ProjectAnalyticsSchema.parse(body);
        
        // Check subscription eligibility
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['PROJECT_MANAGEMENT_PRO', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Project Management Pro subscription required for AI analytics',
              upgradeUrl: '/products/project-management-pro'
            }
          }, { status: 403 });
        }

        // Process with AI service
        const t0 = Date.now();
        const aiService = new ProjectManagementService();
        const result = await aiService.processAdvancedOptimization(validated);

        // Log AI request for tracking
        try {
          await logAIRequest({
            userId: user.userId,
            productId: 'project-management-pro',
            modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
            processingTimeMs: Date.now() - t0,
            success: true,
            inputData: {
              projectName: validated.project.name,
              taskCount: validated.tasks.length,
              resourceCount: validated.resources.length,
              totalBudget: validated.project.budget,
              primaryGoal: validated.objectives.primaryGoal
            },
            outputData: {
              optimizedResourceAllocation: result.resourceAllocation.assignments.length,
              identifiedBottlenecks: result.bottleneckAnalysis.criticalPath.length,
              riskLevel: result.riskAssessment.overallRisk,
              predictedCompletionDate: result.timeline.predictedEndDate,
              budgetVariance: result.budgetOptimization.projectedVariance
            }
          });
        } catch (logError) {
          console.warn('Failed to log AI request:', logError);
        }

        // Add metadata to response
        const responseData = {
          ...result,
          metadata: {
            processedAt: new Date().toISOString(),
            projectId: validated.project.id,
            taskCount: validated.tasks.length,
            resourceCount: validated.resources.length,
            processingTimeMs: Date.now() - t0,
            optimizationScore: result.timeline.confidenceScore || 85,
            riskLevel: result.riskAssessment.overallRisk
          }
        };

        return NextResponse.json({
          success: true,
          data: responseData
        });

      } catch (error) {
        console.error('Project analytics error:', error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request parameters',
              details: error.issues
            }
          }, { status: 400 });
        }
        
        return NextResponse.json({
          success: false,
          error: {
            code: 'PROJECT_ANALYTICS_ERROR',
            message: 'Failed to process project analytics'
          }
        }, { status: 500 });
      }
    }, {
      limit: 15, // 15 requests per 10 minutes for AI project analytics
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => {
        const user = (req as any).user?.userId || 'anonymous';
        return `projects-analytics-ai:${user}`;
      }
    })
  )
);

