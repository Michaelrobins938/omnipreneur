import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';

const CreateAPIKeySchema = z.object({
  name: z.string().min(1).max(100),
  environment: z.enum(['production', 'development', 'testing']).default('development'),
  scopes: z.array(z.string()).min(1),
  rateLimit: z.number().min(10).max(10000).default(1000),
  description: z.string().optional()
});

const getHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // In a real application, you would query your API key management system
    // For now, return mock data based on user events

    const apiKeyEvents = await prisma.event.findMany({
      where: {
        userId: user.userId,
        event: 'API_KEY_CREATED'
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    const apiKeys = apiKeyEvents.map(event => {
      const metadata = event.metadata as any;
      return {
        id: event.id,
        name: metadata?.name || 'Unnamed Key',
        key: metadata?.key || `sk_${metadata?.environment || 'dev'}_${generateAPIKey()}`,
        scopes: metadata?.scopes || ['content.read'],
        rateLimit: metadata?.rateLimit || 1000,
        environment: metadata?.environment || 'development',
        status: metadata?.status || 'active',
        usage: {
          today: Math.floor(Math.random() * 100),
          thisMonth: Math.floor(Math.random() * 1000),
          total: Math.floor(Math.random() * 10000)
        },
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: event.timestamp.toISOString()
      };
    });

    // If no keys exist, create some sample ones for demo
    if (apiKeys.length === 0) {
      const defaultKeys = [
        {
          id: 'default-1',
          name: 'Development Key',
          key: `sk_dev_${generateAPIKey()}`,
          scopes: ['content.read', 'content.write'],
          rateLimit: 100,
          environment: 'development',
          status: 'active',
          usage: {
            today: 45,
            thisMonth: 234,
            total: 1567
          },
          lastUsed: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({
        success: true,
        data: { apiKeys: defaultKeys }
      });
    }

    return NextResponse.json({
      success: true,
      data: { apiKeys }
    });

  } catch (error: any) {
    console.error('API keys fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch API keys' 
        } 
      },
      { status: 500 }
    );
  }
};

const postHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();

    const validatedData = CreateAPIKeySchema.parse(body);

    // Check if user has reached API key limit
    const existingKeys = await prisma.event.count({
      where: {
        userId: user.userId,
        event: 'API_KEY_CREATED',
      }
    });

    const maxKeys = user.role === 'PREMIUM' ? 10 : user.role === 'ADMIN' ? 50 : 3;
    
    if (existingKeys >= maxKeys) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'KEY_LIMIT_EXCEEDED', 
            message: `Maximum of ${maxKeys} API keys allowed for your plan` 
          } 
        },
        { status: 400 }
      );
    }

    // Generate API key
    const keyPrefix = validatedData.environment === 'production' ? 'sk_live' : 'sk_test';
    const apiKey = `${keyPrefix}_${generateAPIKey()}`;
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate scopes
    const validScopes = [
      'content.read',
      'content.write', 
      'analytics.read',
      'users.read',
      'webhooks.manage'
    ];
    
    const invalidScopes = validatedData.scopes.filter(scope => !validScopes.includes(scope));
    if (invalidScopes.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_SCOPES', 
            message: `Invalid scopes: ${invalidScopes.join(', ')}` 
          } 
        },
        { status: 400 }
      );
    }

    // Store the API key creation event
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'API_KEY_CREATED',
        metadata: {
          keyId,
          name: validatedData.name,
          key: apiKey,
          environment: validatedData.environment,
          scopes: validatedData.scopes,
          rateLimit: validatedData.rateLimit,
          description: validatedData.description,
          status: 'active',
          createdAt: new Date().toISOString(),
          lastUsed: null,
          usage: {
            today: 0,
            thisMonth: 0,
            total: 0
          }
        }
      }
    });

    // In a real application, you would also:
    // 1. Store the API key in a secure key management system
    // 2. Hash the key for database storage
    // 3. Set up rate limiting for the key
    // 4. Configure monitoring and analytics

    const newAPIKey = {
      id: keyId,
      name: validatedData.name,
      key: apiKey,
      scopes: validatedData.scopes,
      rateLimit: validatedData.rateLimit,
      environment: validatedData.environment,
      status: 'active',
      usage: {
        today: 0,
        thisMonth: 0,
        total: 0
      },
      lastUsed: null,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newAPIKey
    });

  } catch (error: any) {
    console.error('API key creation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid API key data',
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
          code: 'CREATE_ERROR', 
          message: 'Failed to create API key' 
        } 
      },
      { status: 500 }
    );
  }
};

export const GET = requireAuth(withRateLimit(getHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 requests per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `developer-keys:${userId}:${ip}`;
  }
}));

export const POST = requireAuth(withCsrfProtection(withRateLimit(postHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 key creations per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `developer-keys-create:${userId}:${ip}`;
  }
})));

/**
 * Generate a secure API key
 */
function generateAPIKey(): string {
  return crypto.randomBytes(32).toString('hex');
}