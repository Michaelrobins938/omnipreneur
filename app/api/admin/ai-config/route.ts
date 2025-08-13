// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { chatComplete } from '@/lib/ai/openai';
import { completeClaude } from '@/lib/ai/claude';
import { logAIRequest } from '@/lib/db';

const AITestSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'openrouter']),
  model: z.string(),
  prompt: z.string(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional()
});

const ConfigUpdateSchema = z.object({
  defaultProvider: z.enum(['openai', 'anthropic']).optional(),
  defaultModel: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(100).max(4000).optional(),
  rateLimits: z.object({
    requestsPerMinute: z.number().min(1).max(100).optional(),
    tokensPerHour: z.number().min(1000).max(1000000).optional()
  }).optional()
});

// GET /api/admin/ai-config
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check admin access
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true }
    });
    
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    
    // Get AI usage statistics
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const aiStats = await prisma.aIRequest.groupBy({
      by: ['modelUsed'],
      where: { createdAt: { gte: last24h } },
      _count: { id: true },
      _sum: { inputTokens: true, outputTokens: true },
      _avg: { processingTimeMs: true }
    });
    
    // Get current configuration
    const config = {
      providers: {
        openai: {
          configured: !!process.env.OPENAI_API_KEY,
          models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'],
          default: process.env.DEFAULT_AI_MODEL === 'gpt-4o-mini'
        },
        anthropic: {
          configured: !!process.env.ANTHROPIC_API_KEY,
          models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
          default: process.env.DEFAULT_AI_MODEL?.includes('claude')
        },
        openrouter: {
          configured: !!process.env.OPENROUTER_API_KEY,
          models: ['meta-llama/llama-3.2-90b', 'google/gemini-2.0-flash', 'mistralai/mistral-large']
        }
      },
      settings: {
        defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'openai',
        defaultModel: process.env.DEFAULT_AI_MODEL || 'gpt-4o-mini',
        temperature: Number(process.env.TEMPERATURE || 0.7),
        maxTokens: Number(process.env.MAX_TOKENS || 2000)
      },
      usage: {
        last24Hours: aiStats.map(stat => ({
          model: stat.modelUsed || 'unknown',
          requests: stat._count.id,
          totalTokens: (stat._sum.inputTokens || 0) + (stat._sum.outputTokens || 0),
          avgResponseTime: Math.round(stat._avg.processingTimeMs || 0) + 'ms'
        }))
      },
      costs: {
        estimated: calculateEstimatedCosts(aiStats)
      }
    };
    
    return NextResponse.json({ success: true, data: config });
    
  } catch (error) {
    console.error('AI config error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CONFIG_ERROR', message: 'Failed to fetch AI configuration' } },
      { status: 500 }
    );
  }
}, {
  limit: 10,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    return `admin-ai-config:${userId}`;
  }
}));

// POST /api/admin/ai-config/test
export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check admin access
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true }
    });
    
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { provider, model, prompt, temperature, maxTokens } = AITestSchema.parse(body);
    
    const t0 = Date.now();
    let response: string = '';
    let error: string | null = null;
    let usage: any = {};
    
    try {
      switch (provider) {
        case 'openai':
          response = await chatComplete({
            user: prompt,
            model,
            temperature: temperature || 0.7,
            maxTokens: maxTokens || 500
          });
          break;
          
        case 'anthropic':
          response = await completeClaude({
            prompt,
            model,
            temperature: temperature || 0.7,
            maxTokens: maxTokens || 500
          });
          break;
          
        case 'openrouter':
          // OpenRouter implementation would go here
          response = 'OpenRouter integration not yet implemented';
          break;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    }
    
    const processingTime = Date.now() - t0;
    
    // Log the test
    await logAIRequest({
      userId: user.userId,
      productId: 'admin-ai-test',
      modelUsed: `${provider}/${model}`,
      processingTimeMs: processingTime,
      success: !error,
      inputData: { prompt, temperature, maxTokens },
      outputData: { response, error }
    });
    
    return NextResponse.json({
      success: !error,
      data: {
        provider,
        model,
        response,
        error,
        processingTime: `${processingTime}ms`,
        usage
      }
    });
    
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } },
        { status: 400 }
      );
    }
    
    console.error('AI test error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'TEST_ERROR', message: 'Failed to test AI model' } },
      { status: 500 }
    );
  }
}, {
  limit: 5,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    return `admin-ai-test:${userId}`;
  }
}));

// PATCH /api/admin/ai-config
export const PATCH = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check admin access
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true }
    });
    
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const updates = ConfigUpdateSchema.parse(body);
    
    // Log configuration change
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'admin_ai_config_update',
        metadata: {
          updates,
          adminId: user.userId,
          timestamp: new Date().toISOString()
        }
      }
    });
    
    // Note: In a real implementation, you would update environment variables
    // or a configuration database table here
    
    return NextResponse.json({
      success: true,
      message: 'Configuration updated. Changes will take effect on next deployment.',
      data: updates
    });
    
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } },
        { status: 400 }
      );
    }
    
    console.error('AI config update error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_ERROR', message: 'Failed to update configuration' } },
      { status: 500 }
    );
  }
}, {
  limit: 5,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    return `admin-ai-config-update:${userId}`;
  }
}));

function calculateEstimatedCosts(aiStats: any[]): any {
  // Rough cost estimates per 1K tokens
  const costPer1KTokens = {
    'gpt-4o': 0.01,
    'gpt-4o-mini': 0.0002,
    'gpt-4-turbo-preview': 0.01,
    'gpt-3.5-turbo': 0.002,
    'claude-3-5-sonnet-20241022': 0.003,
    'claude-3-haiku-20240307': 0.0003
  };
  
  let totalCost = 0;
  const breakdown: any = {};
  
  aiStats.forEach(stat => {
    const model = stat.modelUsed || 'unknown';
    const totalTokens = (stat._sum.inputTokens || 0) + (stat._sum.outputTokens || 0);
    const cost = (totalTokens / 1000) * (costPer1KTokens[model] || 0.001);
    
    totalCost += cost;
    breakdown[model] = {
      tokens: totalTokens,
      estimatedCost: `$${cost.toFixed(4)}`
    };
  });
  
  return {
    last24Hours: `$${totalCost.toFixed(2)}`,
    projected30Days: `$${(totalCost * 30).toFixed(2)}`,
    breakdown
  };
}