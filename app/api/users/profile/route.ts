// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withCsrfProtection } from '@/lib/security/csrf';

const prisma = new PrismaClient();

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Get user data with subscription and usage
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        subscription: true,
        usage: true,
        _count: {
          select: {
            rewrites: true,
            contentPieces: true,
            bundles: true,
            affiliateLinks: true
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = userData;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Profile retrieved successfully'
    });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email()
});

export const PUT = requireAuth(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { name, email } = UpdateProfileSchema.parse(body);

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: user.userId }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already taken' },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        name,
        email,
        updatedAt: new Date()
      },
      include: {
        subscription: true,
        usage: true
      }
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ success: true, data: userWithoutPassword, message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Profile update error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: (error as any).errors } },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
  }
}));