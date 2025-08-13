// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';
import { chatComplete } from '@/lib/ai/openai';
import { getClaude } from '@/lib/ai/claude';

// GET /api/admin/system
// System health and configuration check
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
    
    // Check database connectivity
    const dbStatus = await checkDatabaseHealth();
    
    // Check AI services
    const aiServices = await checkAIServices();
    
    // Check system resources
    const systemMetrics = await getSystemMetrics();
    
    // Check error rates
    const errorMetrics = await getErrorMetrics();
    
    // Configuration status
    const configStatus = {
      database: !!process.env.DATABASE_URL,
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      email: !!process.env.RESEND_API_KEY || !!process.env.SENDGRID_API_KEY,
      storage: !!process.env.AWS_S3_BUCKET || !!process.env.CLOUDINARY_URL
    };
    
    const health = {
      status: determineOverallHealth(dbStatus, aiServices, errorMetrics),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      aiServices,
      system: systemMetrics,
      errors: errorMetrics,
      configuration: configStatus,
      environment: process.env.NODE_ENV || 'development'
    };
    
    return NextResponse.json({ success: true, data: health });
    
  } catch (error) {
    console.error('System health check error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'HEALTH_CHECK_ERROR', message: 'Failed to check system health' } },
      { status: 500 }
    );
  }
}, {
  limit: 5,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    return `admin-system:${userId}`;
  }
}));

async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - start;
    
    // Check table counts
    const [userCount, requestCount, paymentCount] = await Promise.all([
      prisma.user.count(),
      prisma.aIRequest.count(),
      prisma.payment.count()
    ]);
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      tables: {
        users: userCount,
        aiRequests: requestCount,
        payments: paymentCount
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}

async function checkAIServices() {
  const services = {
    openai: { status: 'unknown', responseTime: null },
    anthropic: { status: 'unknown', responseTime: null }
  };
  
  // Check OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const start = Date.now();
      const response = await chatComplete({
        user: 'Test health check',
        maxTokens: 10
      });
      services.openai = {
        status: response ? 'healthy' : 'unhealthy',
        responseTime: `${Date.now() - start}ms`
      };
    } catch (error) {
      services.openai = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  } else {
    services.openai.status = 'not_configured';
  }
  
  // Check Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const start = Date.now();
      const claude = getClaude();
      const response = await claude.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }]
      });
      services.anthropic = {
        status: response ? 'healthy' : 'unhealthy',
        responseTime: `${Date.now() - start}ms`
      };
    } catch (error) {
      services.anthropic = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  } else {
    services.anthropic.status = 'not_configured';
  }
  
  return services;
}

async function getSystemMetrics() {
  const memoryUsage = process.memoryUsage();
  
  return {
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    uptime: `${Math.round(process.uptime() / 60)} minutes`,
    nodeVersion: process.version,
    platform: process.platform
  };
}

async function getErrorMetrics() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Get failed AI requests
  const [failedRequests24h, failedRequests1h] = await Promise.all([
    prisma.aIRequest.count({
      where: {
        createdAt: { gte: oneDayAgo },
        success: false
      }
    }),
    prisma.aIRequest.count({
      where: {
        createdAt: { gte: oneHourAgo },
        success: false
      }
    })
  ]);
  
  // Get failed payments
  const [failedPayments24h, failedPayments1h] = await Promise.all([
    prisma.payment.count({
      where: {
        createdAt: { gte: oneDayAgo },
        status: 'FAILED'
      }
    }),
    prisma.payment.count({
      where: {
        createdAt: { gte: oneHourAgo },
        status: 'FAILED'
      }
    })
  ]);
  
  return {
    last24Hours: {
      failedAIRequests: failedRequests24h,
      failedPayments: failedPayments24h
    },
    lastHour: {
      failedAIRequests: failedRequests1h,
      failedPayments: failedPayments1h
    },
    errorRate: {
      ai: failedRequests1h > 10 ? 'high' : failedRequests1h > 5 ? 'medium' : 'low',
      payments: failedPayments1h > 5 ? 'high' : failedPayments1h > 2 ? 'medium' : 'low'
    }
  };
}

function determineOverallHealth(dbStatus: any, aiServices: any, errorMetrics: any): string {
  if (dbStatus.status === 'unhealthy') return 'critical';
  
  const aiHealthy = Object.values(aiServices).some((service: any) => service.status === 'healthy');
  if (!aiHealthy) return 'degraded';
  
  if (errorMetrics.errorRate.ai === 'high' || errorMetrics.errorRate.payments === 'high') {
    return 'warning';
  }
  
  return 'healthy';
}