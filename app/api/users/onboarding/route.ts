import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import prisma from '@/lib/db';

const OnboardingSchema = z.object({
  goals: z.array(z.string()).optional().default([]),
  industry: z.string().optional(),
  completed: z.boolean().default(true),
});

/**
 * POST /api/users/onboarding
 * Save user onboarding preferences
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { goals, industry, completed } = OnboardingSchema.parse(body);

    // Update user with onboarding data
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        onboardingCompleted: completed,
        preferences: {
          goals,
          industry,
          onboardingCompletedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding preferences saved successfully',
      data: {
        onboardingCompleted: updatedUser.onboardingCompleted,
        preferences: updatedUser.preferences,
      },
    });

  } catch (error: any) {
    console.error('Onboarding save error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid onboarding data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ONBOARDING_SAVE_ERROR',
          message: 'Failed to save onboarding preferences',
        },
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/users/onboarding
 * Get user onboarding status
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        onboardingCompleted: true,
        preferences: true,
        emailVerified: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        onboardingCompleted: userData.onboardingCompleted || false,
        emailVerified: !!userData.emailVerified,
        preferences: userData.preferences || {},
      },
    });

  } catch (error: any) {
    console.error('Onboarding status error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ONBOARDING_STATUS_ERROR',
          message: 'Failed to get onboarding status',
        },
      },
      { status: 500 }
    );
  }
});