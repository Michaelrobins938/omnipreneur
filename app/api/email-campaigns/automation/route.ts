// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { emailAutomationEngine } from '@/lib/email/automation-engine';
import { z } from 'zod';

const CreateAutomationSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  triggers: z.array(z.object({
    type: z.enum(['user_signup', 'purchase', 'inactivity', 'custom_event']),
    conditions: z.record(z.any()).optional(),
    delay: z.number().min(0).optional()
  })).min(1),
  actions: z.array(z.object({
    type: z.enum(['send_email', 'add_tag', 'update_field', 'webhook']),
    data: z.record(z.any()),
    delay: z.number().min(0).optional()
  })).min(1)
});

const TriggerAutomationSchema = z.object({
  automationId: z.string(),
  userId: z.string().optional(),
  triggerType: z.string(),
  triggerData: z.record(z.any()).optional()
});

/**
 * POST /api/email-campaigns/automation
 * 
 * Create email automation workflow
 * 
 * Authentication: Required
 * Subscription: PRO or higher required
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const automationData = CreateAutomationSchema.parse(body);
    
    // Check subscription level
    const userSubscription = await getUserSubscription(user.userId);
    const allowedPlans = ['PRO', 'ENTERPRISE'];
    
    if (!allowedPlans.includes(userSubscription.plan)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'SUBSCRIPTION_REQUIRED', 
            message: 'PRO subscription required for email automation',
            upgradeUrl: '/pricing'
          } 
        },
        { status: 403 }
      );
    }
    
    // Check automation limits
    const currentAutomations = await getUserAutomationCount(user.userId);
    const automationLimits = {
      PRO: 10,
      ENTERPRISE: -1 // unlimited
    };
    
    const limit = automationLimits[userSubscription.plan as keyof typeof automationLimits];
    if (limit !== -1 && currentAutomations >= limit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTOMATION_LIMIT_EXCEEDED', 
            message: `Automation limit of ${limit} reached for ${userSubscription.plan} plan`,
            upgradeUrl: '/pricing'
          } 
        },
        { status: 429 }
      );
    }
    
    // Validate automation workflow
    const validationResult = await validateAutomationWorkflow(automationData);
    if (!validationResult.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'WORKFLOW_VALIDATION_ERROR', 
            message: 'Invalid automation workflow',
            details: validationResult.errors
          } 
        },
        { status: 400 }
      );
    }
    
    // Create automation
    const automation = await emailAutomationEngine.createAutomation({
      ...automationData,
      userId: user.userId
    });
    
    // Log automation creation
    await logAutomationEvent({
      userId: user.userId,
      automationId: automation.id,
      action: 'created',
      metadata: {
        triggers: automationData.triggers.length,
        actions: automationData.actions.length
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        automation,
        workflow: await generateWorkflowVisualization(automation),
        message: 'Email automation created successfully'
      }
    });
    
  } catch (error) {
    console.error('Automation creation error:', error);
    
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid automation data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'AUTOMATION_ERROR', 
          message: 'Failed to create automation' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/email-campaigns/automation
 * 
 * List user's email automations
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - status: 'active' | 'paused' | 'draft'
 * - page: number
 * - limit: number
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Get user automations
    const automations = await getUserAutomations({
      userId: user.userId,
      status,
      page,
      limit
    });
    
    // Get automation analytics
    const automationAnalytics = await Promise.all(
      automations.automations.map(async (automation: any) => {
        const analytics = await emailAutomationEngine.getAutomationAnalytics(automation.id);
        return {
          ...automation,
          analytics: {
            triggered: analytics.metrics.triggered,
            completed: analytics.metrics.completed,
            conversionRate: analytics.metrics.triggered > 0 ? 
              (analytics.metrics.completed / analytics.metrics.triggered) * 100 : 0
          }
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      data: {
        automations: automationAnalytics,
        pagination: {
          page,
          limit,
          total: automations.total,
          pages: Math.ceil(automations.total / limit)
        },
        summary: {
          totalAutomations: automations.total,
          activeAutomations: automations.summary.active,
          totalTriggered: automations.summary.totalTriggered,
          totalCompleted: automations.summary.totalCompleted
        }
      }
    });
    
  } catch (error) {
    console.error('Get automations error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch automations' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * PATCH /api/email-campaigns/automation
 * 
 * Manually trigger automation
 * 
 * Authentication: Required
 */
export const PATCH = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const { automationId, userId: targetUserId, triggerType, triggerData } = TriggerAutomationSchema.parse(body);
    
    // Use current user if no target user specified
    const effectiveUserId = targetUserId || user.userId;
    
    // Trigger automation
    const success = await emailAutomationEngine.triggerAutomation(
      automationId,
      effectiveUserId,
      {
        type: triggerType,
        data: triggerData || {},
        triggeredBy: user.userId,
        manual: true
      }
    );
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'TRIGGER_FAILED', 
            message: 'Failed to trigger automation' 
          } 
        },
        { status: 400 }
      );
    }
    
    // Log manual trigger
    await logAutomationEvent({
      userId: user.userId,
      automationId,
      action: 'manually_triggered',
      metadata: {
        targetUserId: effectiveUserId,
        triggerType,
        triggerData
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        automationId,
        triggered: true,
        message: 'Automation triggered successfully'
      }
    });
    
  } catch (error) {
    console.error('Manual trigger error:', error);
    
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid trigger data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'TRIGGER_ERROR', 
          message: 'Failed to trigger automation' 
        } 
      },
      { status: 500 }
    );
  }
});

// Helper functions
async function getUserSubscription(userId: string): Promise<{ plan: string }> {
  // Mock implementation - replace with actual database query
  return { plan: 'PRO' };
}

async function getUserAutomationCount(userId: string): Promise<number> {
  // Mock implementation - replace with actual database query
  return 3;
}

async function validateAutomationWorkflow(automationData: any): Promise<{ valid: boolean; errors?: string[] }> {
  const errors: string[] = [];
  
  // Validate triggers
  for (const trigger of automationData.triggers) {
    if (trigger.type === 'custom_event' && !trigger.conditions?.eventName) {
      errors.push('Custom event trigger requires eventName in conditions');
    }
    
    if (trigger.type === 'inactivity' && !trigger.conditions?.days) {
      errors.push('Inactivity trigger requires days in conditions');
    }
  }
  
  // Validate actions
  for (const action of automationData.actions) {
    if (action.type === 'send_email') {
      if (!action.data.templateId && !action.data.content) {
        errors.push('Send email action requires either templateId or content');
      }
      if (!action.data.subject) {
        errors.push('Send email action requires subject');
      }
    }
    
    if (action.type === 'webhook' && !action.data.url) {
      errors.push('Webhook action requires URL');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

async function generateWorkflowVisualization(automation: any): Promise<any> {
  // Generate workflow visualization data
  return {
    nodes: [
      ...automation.triggers.map((trigger: any, index: number) => ({
        id: `trigger_${index}`,
        type: 'trigger',
        data: trigger,
        position: { x: 0, y: index * 100 }
      })),
      ...automation.actions.map((action: any, index: number) => ({
        id: `action_${index}`,
        type: 'action',
        data: action,
        position: { x: 200, y: index * 100 }
      }))
    ],
    edges: automation.triggers.map((trigger: any, triggerIndex: number) => 
      automation.actions.map((action: any, actionIndex: number) => ({
        id: `edge_${triggerIndex}_${actionIndex}`,
        source: `trigger_${triggerIndex}`,
        target: `action_${actionIndex}`
      }))
    ).flat()
  };
}

async function getUserAutomations(filters: any): Promise<any> {
  // Mock implementation - replace with actual database query
  const automations = [
    {
      id: 'automation_1',
      name: 'Welcome Email Series',
      description: 'Send welcome emails to new subscribers',
      status: 'active',
      triggers: [{ type: 'user_signup' }],
      actions: [{ type: 'send_email', data: { templateId: 'welcome_1' } }],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'automation_2',
      name: 'Abandoned Cart Recovery',
      description: 'Recover abandoned carts with email reminders',
      status: 'active',
      triggers: [{ type: 'custom_event', conditions: { eventName: 'cart_abandoned' } }],
      actions: [
        { type: 'send_email', data: { templateId: 'cart_reminder_1' }, delay: 3600 },
        { type: 'send_email', data: { templateId: 'cart_reminder_2' }, delay: 86400 }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return {
    automations,
    total: automations.length,
    summary: {
      active: 2,
      totalTriggered: 150,
      totalCompleted: 135
    }
  };
}

async function logAutomationEvent(eventData: any): Promise<void> {
  // Mock implementation - replace with actual logging
  console.log('Automation event:', eventData);
}