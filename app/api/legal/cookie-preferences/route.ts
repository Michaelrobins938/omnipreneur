import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const CookiePreferencesSchema = z.object({
  preferences: z.record(z.string(), z.boolean())
});

/**
 * POST /api/legal/cookie-preferences
 * 
 * Save user's cookie preferences
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const { preferences } = CookiePreferencesSchema.parse(body);

    // Validate that essential cookies cannot be disabled
    if (preferences.essential === false) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_PREFERENCES', 
            message: 'Essential cookies cannot be disabled' 
          } 
        },
        { status: 400 }
      );
    }

    // Save preferences to user preferences table
    await prisma.userPreference.upsert({
      where: {
        userId_category_key: {
          userId: user.userId,
          category: 'privacy',
          key: 'cookie_preferences'
        }
      },
      update: {
        value: JSON.stringify(preferences),
        lastUsed: new Date(),
        usage_count: { increment: 1 }
      },
      create: {
        userId: user.userId,
        category: 'privacy',
        key: 'cookie_preferences',
        value: JSON.stringify(preferences),
        isExplicit: true,
        isActive: true
      }
    });

    // Log the preference update for compliance tracking
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'COOKIE_PREFERENCES_UPDATED',
        metadata: {
          preferences,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        preferences,
        savedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Cookie preferences error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid preferences data',
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
          code: 'PREFERENCES_ERROR', 
          message: 'Failed to save cookie preferences' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 preference updates per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `cookie-preferences:${userId}:${ip}`;
})));

/**
 * GET /api/legal/cookie-preferences
 * 
 * Get user's current cookie preferences
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    const preference = await prisma.userPreference.findUnique({
      where: {
        userId_category_key: {
          userId: user.userId,
          category: 'privacy',
          key: 'cookie_preferences'
        }
      }
    });

    let preferences = {
      essential: true, // Always true
      analytics: true, // Default to true
      functional: false, // Default to false
      marketing: false // Default to false
    };

    if (preference?.value) {
      try {
        const savedPreferences = JSON.parse(preference.value);
        preferences = { ...preferences, ...savedPreferences };
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        preferences,
        lastUpdated: preference?.updatedAt?.toISOString() || null
      }
    });

  } catch (error: any) {
    console.error('Cookie preferences fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch cookie preferences' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 30 // 30 requests per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `cookie-preferences-get:${userId}:${ip}`;
}));