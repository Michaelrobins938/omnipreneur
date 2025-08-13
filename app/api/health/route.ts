// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const healthData: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {}
  };

  try {
    // Database connectivity check
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthData.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - startTime
      };
    } catch (dbError) {
      healthData.checks.database = {
        status: 'unhealthy',
        error: 'Database connection failed',
        responseTime: Date.now() - startTime
      };
      healthData.status = 'unhealthy';
    }

    // Memory usage check
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    healthData.checks.memory = {
      status: memoryUsagePercent < 90 ? 'healthy' : 'warning',
      usage: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        percentage: Math.round(memoryUsagePercent) + '%'
      }
    };

    if (memoryUsagePercent >= 95) {
      healthData.status = 'unhealthy';
    } else if (memoryUsagePercent >= 90) {
      healthData.status = 'warning';
    }

    // Environment variables check (critical ones)
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    healthData.checks.environment = {
      status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      missingVariables: missingEnvVars
    };

    if (missingEnvVars.length > 0) {
      healthData.status = 'unhealthy';
    }

    // AI Services check (optional)
    healthData.checks.aiServices = {
      status: 'unknown',
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY
    };

    // Redis check (optional)
    healthData.checks.redis = {
      status: process.env.REDIS_URL ? 'configured' : 'not_configured',
      url: !!process.env.REDIS_URL
    };

    healthData.responseTime = Date.now() - startTime;

    // Return appropriate HTTP status
    const httpStatus = healthData.status === 'healthy' ? 200 : 
                      healthData.status === 'warning' ? 200 : 503;

    return NextResponse.json(healthData, { status: httpStatus });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error.message,
      responseTime: Date.now() - startTime
    }, { status: 503 });
  }
}