// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

const CreateKeySchema = z.object({
  name: z.string().min(1, 'Key name is required'),
  description: z.string().optional(),
  scopes: z.array(z.string()).default(['read']),
  expiresAt: z.string().optional()
});

/**
 * GET /api/keys
 * List all API keys for the authenticated user
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        name: true,
        description: true,
        scopes: true,
        lastUsed: true,
        expiresAt: true,
        createdAt: true,
        // Don't return the actual key for security
        keyPrefix: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: apiKeys
    });

  } catch (error: any) {
    console.error('API keys list error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch API keys' }
    }, { status: 500 });
  }
});

/**
 * POST /api/keys
 * Create a new API key
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { name, description, scopes, expiresAt } = CreateKeySchema.parse(body);

    // Check user's subscription for API key limits
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true }
    });

    const keyLimits = {
      FREE: 1,
      PRO: 5,
      ENTERPRISE: 20
    };

    const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
    const limit = keyLimits[userPlan as keyof typeof keyLimits] || 1;

    const existingKeysCount = await prisma.apiKey.count({
      where: { userId: user.userId }
    });

    if (existingKeysCount >= limit) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'LIMIT_EXCEEDED',
          message: `API key limit reached for ${userPlan} plan (${limit} keys max)`
        }
      }, { status: 429 });
    }

    // Generate API key
    const keyValue = `omni_${crypto.randomBytes(32).toString('hex')}`;
    const keyPrefix = keyValue.substring(0, 12) + '...';

    // Hash the key for storage
    const hashedKey = crypto.createHash('sha256').update(keyValue).digest('hex');

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.userId,
        name,
        description,
        scopes: JSON.stringify(scopes),
        keyHash: hashedKey,
        keyPrefix,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      select: {
        id: true,
        name: true,
        description: true,
        scopes: true,
        keyPrefix: true,
        expiresAt: true,
        createdAt: true
      }
    });

    // Return the actual key only once during creation
    return NextResponse.json({
      success: true,
      data: {
        ...apiKey,
        key: keyValue // Only returned on creation
      }
    });

  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors }
      }, { status: 400 });
    }

    console.error('API key creation error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'CREATION_ERROR', message: 'Failed to create API key' }
    }, { status: 500 });
  }
});